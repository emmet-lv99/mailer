"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export function UserAuth() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-medium">{session.user?.name}</span>
            <span className="text-xs text-muted-foreground">{session.user?.email}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" size="sm" onClick={() => signIn("google")}>
      Google 로그인
    </Button>
  );
}
