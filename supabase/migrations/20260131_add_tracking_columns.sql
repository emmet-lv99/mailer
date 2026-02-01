-- Migration to add activity tracking columns to instagram_proposals table
-- 1. Add columns if they don't exist
ALTER TABLE instagram_proposals 
ADD COLUMN IF NOT EXISTS created_by text,
ADD COLUMN IF NOT EXISTS sent_by text;

-- 2. Populate existing rows with the specified default creator
UPDATE instagram_proposals 
SET created_by = 'dachankim@parastar.co.kr' 
WHERE created_by IS NULL;
