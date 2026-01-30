
"use client";

import { UserAuth } from "@/components/common/user-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, ChevronDown, FileUp, History, Home, Instagram, Search, Settings, ShoppingBag, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AppType = "youtube" | "instagram";

export function GlobalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeApp, setActiveApp] = useState<AppType>("youtube");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure setIsMounted(true) is preserved if it was there, or add it. Original had it.
    if (pathname.startsWith("/instagram")) {
        setActiveApp("instagram");
    } else {
        setActiveApp("youtube");
    }
  }, [pathname]);

  const youtubeNavItems = [
    { href: "/youtube", label: "대시보드", icon: Home },
    { href: "/youtube/search", label: "채널 탐색", icon: Search },
    { href: "/youtube/create", label: "메일 생성", icon: FileUp },
    { href: "/youtube/mall", label: "몰 기획", icon: ShoppingBag }, // [NEW]
    { 
      label: "이력 관리", 
      icon: History,
      children: [
        { href: "/youtube/history", label: "메일 발송 이력" },
        { href: "/youtube/history/mall", label: "몰 기획 이력" } // [NEW]
      ]
    },
    { href: "/youtube/settings", label: "설정", icon: Settings },
  ];

  const instagramNavItems = [
    { href: "/instagram", label: "대시보드", icon: Home },
    { 
      label: "검색", 
      icon: Search,
      children: [
        { href: "/instagram/search", label: "태그 검색" },
        { href: "/instagram/search?mode=target", label: "타겟 검색" }
      ]
    },
    { href: "/instagram/history", label: "이력 관리", icon: History },
    { href: "/instagram/agent", label: "헌터 에이전트", icon: Bot },
    { href: "/instagram/settings", label: "설정", icon: Settings },
  ];

  const currentNavItems = activeApp === "youtube" ? youtubeNavItems : instagramNavItems;

  if (!isMounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto">
        {/* Left: Logo + App Switcher + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-2">
            📧 안목 헌터
          </Link>

          {/* App Switcher */}
          <div className="bg-muted/50 p-1 rounded-lg flex gap-1">
             <button
                onClick={() => {
                    setActiveApp("youtube");
                    router.push("/youtube");
                }}
                className={`flex items-center justify-center p-2 rounded-md transition-all ${
                    activeApp === "youtube" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
             >
                <Youtube className="h-4 w-4 text-red-600" />
             </button>
             <button
                onClick={() => {
                    setActiveApp("instagram");
                    router.push("/instagram");
                }}
                className={`flex items-center justify-center p-2 rounded-md transition-all ${
                    activeApp === "instagram" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
             >
                <Instagram className="h-4 w-4 text-pink-600" />
             </button>
          </div>

          <div className="h-4 w-[1px] bg-border mx-2 hidden md:block" />

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {currentNavItems.map((item: any) => {
              const IconComponent = item.icon;
              
              if (item.children) {
                 const isActive = item.children.some((child: any) => pathname === child.href || (child.href.includes('?') ? pathname === child.href.split('?')[0] : pathname.startsWith(child.href)));
                 return (
                   <DropdownMenu key={item.label}>
                     <DropdownMenuTrigger className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors outline-none ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}>
                         <IconComponent className="h-4 w-4" />
                         {item.label}
                         <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="start">
                        {item.children.map((child: any) => (
                           <DropdownMenuItem key={child.label} asChild>
                             <Link href={child.href} className="cursor-pointer w-full">
                               {child.label}
                             </Link>
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                   </DropdownMenu>
                 )
              }

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

        {/* Right: User Auth */}
        <div className="flex items-center gap-4">
          <UserAuth />
        </div>
      </div>
    </header>
  );
}
