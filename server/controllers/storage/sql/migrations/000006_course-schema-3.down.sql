DROP TABLE IF EXISTS lessonasset;
DROP TABLE IF EXISTS lesson;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS "user";

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
    position SMALLINT NOT NULL,
    folder_name TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS LessonAsset(
    lesson_id UUID NOT NULL REFERENCES Lesson (id),
    name TEXT NOT NULL,
    url TEXT NOT NULL
);