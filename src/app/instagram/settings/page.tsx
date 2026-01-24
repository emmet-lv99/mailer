import { GeneralSettings } from "@/components/instagram/settings/general-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptManager } from "@/components/youtube/settings/prompt-manager";

export default function InstagramSettingsPage() {
  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
       <header className="flex-none">
        <h1 className="text-3xl font-bold tracking-tight">인스타그램 설정</h1>
        <p className="text-muted-foreground">
          분석 파라미터와 프롬프트를 관리합니다.
        </p>
      </header>

      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="prompt">프롬프트 설정</TabsTrigger>
          <TabsTrigger value="general">일반 설정</TabsTrigger>
        </TabsList>
        <TabsContent value="prompt">
           <Tabs defaultValue="insta" className="w-full">
               <TabsList className="mb-4 bg-muted/50">
                   <TabsTrigger value="insta">태그 검색 (기본)</TabsTrigger>
                   <TabsTrigger value="insta_target">타겟 검색 (심층)</TabsTrigger>
               </TabsList>
               
               <TabsContent value="insta">
                   <div className="mt-0"> 
                     <PromptManager promptType="INSTA" hideHeader={true} />
                   </div>
               </TabsContent>
               <TabsContent value="insta_target">
                   <div className="mt-0"> 
                     <PromptManager promptType="INSTA_TARGET" hideHeader={true} />
                   </div>
               </TabsContent>
           </Tabs>
        </TabsContent>
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
