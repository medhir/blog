DROP TABLE IF EXISTS Lesson;
DROP TABLE IF EXISTS Course;

CREATE TABLE IF NOT EXISTS courses(
    id uuid primary key not null,
    author_id uuid not null,
    title text not null,
    description text,
    created_at timestamptz not null,
    updated_at timestamptz
);

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
