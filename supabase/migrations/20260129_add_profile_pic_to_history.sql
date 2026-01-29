-- Add profile_pic_url to analysis_history table
ALTER TABLE analysis_history ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;
