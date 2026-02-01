-- Add evaluation column to existing table
ALTER TABLE instagram_proposals 
ADD COLUMN IF NOT EXISTS evaluation text 
CHECK (evaluation IN ('fit', 'unsuit')) 
DEFAULT 'fit' 
NOT NULL;
