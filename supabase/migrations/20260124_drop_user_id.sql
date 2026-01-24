-- user_id 컬럼 아예 삭제 (로그인 불필요)
-- 기존에 FK 제약조건이나 정책이 있다면 먼저 삭제 (안전장치)
alter table mall_projects drop constraint if exists mall_projects_user_id_fkey;
drop policy if exists "Users can view their own projects" on mall_projects;
drop policy if exists "Users can insert their own projects" on mall_projects;

-- 컬럼 삭제
alter table mall_projects drop column if exists user_id;

-- (참고) mall_designs는 user_id가 없으므로 영향 없음
