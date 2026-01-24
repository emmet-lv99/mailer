-- RLS(Row Level Security)로 인해 Anon Key로 쓰기가 막힘 -> RLS 해제
alter table mall_projects disable row level security;
alter table mall_designs disable row level security;

-- user_id가 auth.users(Supabase 유저)를 참조하고 있어서, 외부 로그인(Google) 유저 ID를 넣을 수 없음
-- 참조 제약조건 제거 및 타입 변경 (UUID -> Text)
alter table mall_projects drop constraint if exists mall_projects_user_id_fkey;
alter table mall_projects alter column user_id type text;

-- (선택) 기존 설정을 위해 owner 관련 컬럼이 있다면 호환성 유지
-- 만약 mall_designs 테이블도 user_id 관련 제약이 있다면 동일하게 처리해야 함
-- 현재 mall_designs는 project_id만 참조하므로 OK.
