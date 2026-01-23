"use client";

import { UserAuth } from "@/components/user-auth";
import { History, Home, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function GlobalNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/explorer", label: "채널 탐색", icon: Search },
    { href: "/history", label: "이력 관리", icon: History },
    { href: "/settings", label: "설정", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto">
        {/* 좌측: 로고 + 네비게이션 */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            📧 안목 메일러
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 우측: 유저 인증 */}
        <div className="flex items-center gap-4">
          <UserAuth />
        </div>
      </div>
    </header>
  );
}
