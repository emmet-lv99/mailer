"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export function UserAuth() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-sm">
            <span className="font-medium">{session.user?.name}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" size="sm" onClick={() => window.location.href = "/login"}>
      로그인
    </Button>
  );
}
