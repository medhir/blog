CREATE TABLE IF NOT EXISTS lessons(
    id uuid primary key not null,
    course_id uuid not null,
    section text not null,
    title text not null,
    description text,
    mdx text not null,
    created_at timestamptz not null,
    updated_at timestamptz
);