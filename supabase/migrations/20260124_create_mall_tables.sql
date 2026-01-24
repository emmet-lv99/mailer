-- 1. 프로젝트 테이블
create table if not exists mall_projects (
  id uuid default gen_random_uuid() primary key,
  -- user_id removed for anonymous access
  youtube_channel_url text not null,
  competitor_channels text[], 
  channel_name text,
  
  -- 1. 마케팅 분석 (Marketing Strategy)
  marketing_analysis jsonb, 

  -- 2. 디자인 분석 (Design System Spec)
  design_analysis jsonb, 

  -- 3. 레퍼런스 분석 (Reference Style)
  reference_analysis jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
  -- updated_at removed
);

-- 2. 디자인 시안 테이블
create table if not exists mall_designs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references mall_projects on delete cascade not null,
  type text not null, -- 'MAIN' | 'LIST' | 'DETAIL'
  device_type text not null, -- 'PC' | 'MOBILE'
  image_url text not null, 
  prompt_used text, 
  is_selected boolean default false, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 비활성화 (Anonymous Access)
alter table mall_projects disable row level security;
alter table mall_designs disable row level security;

