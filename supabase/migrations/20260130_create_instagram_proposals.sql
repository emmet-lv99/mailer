-- Create instagram_proposals table
create table if not exists instagram_proposals (
  id bigint primary key generated always as identity,
  instagram_id text not null unique,
  followers integer default 0,
  created_at timestamp with time zone default now() not null,
  is_sent boolean default false not null,
  sent_at timestamp with time zone,
  reaction text check (reaction in ('pending', 'accept', 'refuse')) default 'pending' not null,
  evaluation text check (evaluation in ('fit', 'unsuit')) default 'fit' not null,
  content text default '' not null,
  memo text default '' not null
);

-- Disable RLS for now as requested/patterned in other tables
alter table instagram_proposals disable row level security;
