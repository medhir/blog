DROP TABLE IF EXISTS lessonasset;
DROP TABLE IF EXISTS lesson;
DROP TABLE IF EXISTS course;

CREATE TABLE IF NOT EXISTS "user"(
    id UUID PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    stripe_customer_token TEXT,
    instance_password TEXT
);

CREATE TABLE IF NOT EXISTS course(
    id UUID PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES "user" (id),
    title TEXT NOT NULL,
    description TEXT,
    master_pvc_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    revised_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lesson(
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES Course (id),
    title TEXT NOT NULL,
    mdx TEXT NOT NULL,
    position SMALLINT NOT NULL,
    folder_name TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lessonasset(
    lesson_id UUID NOT NULL REFERENCES Lesson (id),
    name TEXT NOT NULL,
    url TEXT NOT NULL
);
