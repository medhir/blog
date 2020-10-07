DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;

CREATE TABLE IF NOT EXISTS Course(
    id UUID PRIMARY KEY,
    author_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    master_pvc_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    revised_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS Lesson(
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES Course (id),
    title TEXT NOT NULL,
    mdx TEXT NOT NULL,
    folder_name TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);
