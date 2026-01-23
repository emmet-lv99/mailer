import { PromptManager } from "@/components/settings/prompt-manager";
import { TemplateManager } from "@/components/settings/template-manager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAuth } from "@/components/user-auth";
import { Home } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">설정 (Settings)</h1>
        </div>
        <UserAuth />
      </header>

      <Tabs defaultValue="prompt" className="w-full">
        {/* 탭 메뉴 */}
        <TabsList className="mb-4">
          <TabsTrigger value="prompt">프롬프트 설정</TabsTrigger>
          <TabsTrigger value="template">템플릿 설정</TabsTrigger>
        </TabsList>

        {/* 탭 내용 1: 프롬프트 */}
        <TabsContent value="prompt">
          <PromptManager />
        </TabsContent>

        {/* 탭 내용 2: 템플릿 */}
        <TabsContent value="template">
          <TemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}