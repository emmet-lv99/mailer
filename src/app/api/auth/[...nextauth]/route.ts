import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { supabaseAdmin } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.modify openid",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: '/login', // Use custom login page
    error: '/login', // Redirect errors back to login
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // [Authorization] Check if user is in 'allowed_users' table
      // We use supabaseAdmin (Service Role) because RLS may block public access
      if (supabaseAdmin) {
        try {
            const { data, error } = await supabaseAdmin
                .from('allowed_users')
                .select('id')
                .eq('email', user.email)
                .single();
            
            if (error || !data) {
                console.warn(`[Auth] Access Denied: ${user.email} is not in allowed_users.`);
                return false; // Deny access
            }
            return true; // Allow access
        } catch (e) {
            console.error("[Auth] DB Error:", e);
            return false;
        }
      } 
      
      // Fallback: If SUPABASE_SERVICE_ROLE_KEY is missing, deny everyone for safety
      console.warn("[Auth] Missing Service Role Key (supabaseAdmin is null), denying access safely.");
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
