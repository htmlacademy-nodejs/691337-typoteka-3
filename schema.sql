CREATE DATABASE typoteka
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS readers CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS articles_categories;

CREATE TABLE readers
(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    pass TEXT NOT NULL,
    avatar_name TEXT NOT NULL
);

CREATE TABLE articles
(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    created_date DATE NOT NULL,
    announce TEXT NOT NULL,
    picture_name TEXT,
    full_text TEXT
);

CREATE TABLE comments
(
    id SERIAL PRIMARY KEY,
    comment_text TEXT NOT NULL,
    created_date DATE NOT NULL,
    article_id INTEGER,
    reader_id INTEGER,

    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (reader_id) REFERENCES readers (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE categories
(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE articles_categories
(
    article_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),

    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX article_title ON articles (title);
