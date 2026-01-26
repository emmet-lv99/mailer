import { supabase } from "@/lib/supabase";
import { DesignSpec, MallProjectAnalysis } from "./types";

export interface SaveProjectParams {
  id?: string;
  youtubeChannelUrl: string;
  competitorUrls?: string[];
  channelName?: string;
  marketingAnalysis?: MallProjectAnalysis['marketing'];
  designAnalysis?: MallProjectAnalysis['design'];
  referenceAnalysis?: DesignSpec;
}

export const saveProject = async (params: SaveProjectParams) => {

  // Use our Server API which handles NextAuth -> Supabase User mapping
  const response = await fetch("/api/mall/projects/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save project");
  }

  return await response.json();
};

export const getProject = async (id: string) => {
  const { data, error } = await supabase
    .from("mall_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const findProjectsByUrl = async (url: string) => {
  const { data, error } = await supabase
    .from("mall_projects")
    .select("*")
    .eq("youtube_channel_url", url)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
