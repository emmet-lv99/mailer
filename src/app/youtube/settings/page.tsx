import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryImporter } from "@/components/youtube/settings/history-importer";
import { PromptManager } from "@/components/youtube/settings/prompt-manager";
import { TemplateManager } from "@/components/youtube/settings/template-manager";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">설정 (Settings)</h1>
        <p className="text-muted-foreground">프롬프트와 템플릿을 관리합니다.</p>
      </div>

      <Tabs defaultValue="prompt" className="w-full">
        {/* 탭 메뉴 */}
        <TabsList className="mb-4">
          <TabsTrigger value="prompt">프롬프트 설정</TabsTrigger>
          <TabsTrigger value="template">템플릿 설정</TabsTrigger>
          <TabsTrigger value="history">발송 이력 가져오기</TabsTrigger>
        </TabsList>

        {/* 탭 내용 1: 프롬프트 */}
        <TabsContent value="prompt">
          <PromptManager />
        </TabsContent>

        {/* 탭 내용 2: 템플릿 */}
        <TabsContent value="template">
          <TemplateManager />
        </TabsContent>

        {/* 탭 내용 3: 이력 관리 */}
        <TabsContent value="history">
          <HistoryImporter />
        </TabsContent>
      </Tabs>
    </div>
  );
}