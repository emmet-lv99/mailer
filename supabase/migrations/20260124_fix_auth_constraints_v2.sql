-- 1. 기존 정책(Policy) 삭제
-- 컬럼 타입을 변경하려면 해당 컬럼을 참조하는 정책들을 먼저 삭제해야 합니다.
drop policy if exists "Users can view their own projects" on mall_projects;
drop policy if exists "Users can insert their own projects" on mall_projects;
drop policy if exists "Users can view their own designs" on mall_designs;
drop policy if exists "Users can insert their own designs" on mall_designs;

-- 2. RLS 비활성화
alter table mall_projects disable row level security;
alter table mall_designs disable row level security;

-- 3. 컬럼 타입 변경 및 제약조건 삭제
-- user_id를 UUID -> TEXT로 변경하여 Google 이메일 등을 저장할 수 있게 함
alter table mall_projects drop constraint if exists mall_projects_user_id_fkey;
alter table mall_projects alter column user_id type text;
