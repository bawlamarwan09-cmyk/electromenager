BEGIN;

CREATE TABLE article (
    id text PRIMARY KEY NOT NULL,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    topic text NOT NULL,
    introduction text NOT NULL DEFAULT '',
    image_key text,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE TABLE article_section (
    article_id text NOT NULL REFERENCES article(id) ON DELETE CASCADE,
    position integer NOT NULL CHECK (position >= 0),
    heading text NOT NULL,
    body text NOT NULL,
    PRIMARY KEY (article_id, position)
);

-- Editorial inputs: supplied notes, catalogue extracts or manufacturer documents.
CREATE TABLE article_source (
    id text PRIMARY KEY NOT NULL,
    article_id text NOT NULL REFERENCES article(id) ON DELETE CASCADE,
    label text NOT NULL,
    notes text,
    url text,
    CHECK (coalesce(trim(notes), '') <> '' OR coalesce(trim(url), '') <> '')
);
CREATE INDEX sources_by_article ON article_source(article_id);

CREATE TABLE article_category (
    article_id text NOT NULL REFERENCES article(id) ON DELETE CASCADE,
    category_id text NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, category_id)
);
CREATE INDEX articles_by_category ON article_category(category_id);

CREATE TABLE article_product (
    article_id text NOT NULL REFERENCES article(id) ON DELETE CASCADE,
    product_id text NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, product_id)
);
CREATE INDEX articles_by_product ON article_product(product_id);

CREATE TABLE article_brand (
    article_id text NOT NULL REFERENCES article(id) ON DELETE CASCADE,
    brand_id text NOT NULL REFERENCES brand(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, brand_id)
);
CREATE INDEX articles_by_brand ON article_brand(brand_id);

COMMIT;
