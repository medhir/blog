CREATE TABLE IF NOT EXISTS BlogPost(
    id UUID PRIMARY KEY,
    title TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    markdown TEXT NOT NULL,
    created_on TIMESTAMPTZ NOT NULL,
    saved_on TIMESTAMPTZ,
    published_on TIMESTAMPTZ,
    revised_on TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS BlogPostAsset(
    post_id UUID NOT NULL REFERENCES BlogPost (id),
    name TEXT NOT NULL,
    url TEXT NOT NULL
);

