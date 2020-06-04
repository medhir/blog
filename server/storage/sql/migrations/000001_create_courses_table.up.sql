CREATE TABLE IF NOT EXISTS courses(
    id uuid primary key not null,
    author_id uuid not null,
    title text not null,
    description text,
    created_at timestamptz not null,
    updated_at timestamptz
);