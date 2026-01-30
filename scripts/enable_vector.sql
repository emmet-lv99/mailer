-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Add embedding column to analysis_history table
-- Gemini embedding-001 dimension is 768
alter table analysis_history 
add column if not exists embedding vector(768);

-- Create an index for faster similarity search (IVFFlat or HNSW)
-- HNSW is generally better for performance/recall trade-off
create index if not exists analysis_history_embedding_idx 
on analysis_history 
using hnsw (embedding vector_cosine_ops);

-- Optional: Function to match similar influencers
create or replace function match_influencers (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  username text,
  similarity float,
  full_analysis jsonb
)
language plpgsql
as $$
begin
  return query(
    select
      analysis_history.id,
      analysis_history.username,
      1 - (analysis_history.embedding <=> query_embedding) as similarity,
      analysis_history.full_analysis
    from analysis_history
    where 1 - (analysis_history.embedding <=> query_embedding) > match_threshold
    order by analysis_history.embedding <=> query_embedding
    limit match_count
  );
end;
$$;
