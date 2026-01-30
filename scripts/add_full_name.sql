-- Add full_name column to analysis_history table for better nickname/name-based searching
alter table analysis_history 
add column if not exists full_name text;

-- Create an index for full_name search
create index if not exists analysis_history_full_name_idx on analysis_history (full_name);
