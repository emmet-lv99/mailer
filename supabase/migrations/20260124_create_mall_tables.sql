-- 1. 프로젝트 테이블
create table if not exists mall_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  youtube_channel_url text not null,
  competitor_channels text[], -- [NEW] 경쟁 채널 URL 리스트 (N개)
  channel_name text, -- 분석 후 저장
  
  -- 1. 마케팅 분석 (Marketing Strategy)
  marketing_analysis jsonb, 
  -- {
  --   "target": { "age": "20-30", "gender": "female", "interests": [...] },
  --   "persona": { "description": "합리적인 소비를 지향하는 사회초년생", "needs": [...] }
  -- }

  -- 2. 디자인 분석 (Design System Spec)
  design_analysis jsonb, 
  -- {
  --   "foundation": { "colors": {...}, "typography": {...}, "radius": "..." },
  --   "components": { "buttonStyle": "...", "cardStyle": "..." },
  --   "mood": { "keywords": [...], "imagery": "..." }
  -- }

  -- 3. 레퍼런스 분석 (Reference Style)
  reference_analysis jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 디자인 시안 테이블
create table if not exists mall_designs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references mall_projects on delete cascade not null,
  type text not null, -- 'MAIN' | 'LIST' | 'DETAIL'
  device_type text not null, -- 'PC' | 'MOBILE' [NEW]
  image_url text not null, -- 생성된 이미지 경로
  prompt_used text, -- 나중에 디버깅용으로 저장
  is_selected boolean default false, -- 유저가 선택한 시안인지
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 설정 (선택 사항이지만 권장)
alter table mall_projects enable row level security;
alter table mall_designs enable row level security;

create policy "Users can view their own projects"
  on mall_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on mall_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own designs"
  on mall_designs for select
  using (exists (
    select 1 from mall_projects
    where mall_projects.id = mall_designs.project_id
    and mall_projects.user_id = auth.uid()
  ));

create policy "Users can insert their own designs"
  on mall_designs for insert
  with check (exists (
    select 1 from mall_projects
    where mall_projects.id = mall_designs.project_id
    and mall_projects.user_id = auth.uid()
  ));
