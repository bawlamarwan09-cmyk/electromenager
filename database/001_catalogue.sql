BEGIN;

CREATE TABLE catalogue_universe (
    id text PRIMARY KEY NOT NULL,
    slug text NOT NULL UNIQUE,
    name text NOT NULL
);

CREATE TABLE brand (
    id text PRIMARY KEY NOT NULL,
    slug text NOT NULL UNIQUE,
    name text NOT NULL
);

CREATE TABLE category (
    id text PRIMARY KEY NOT NULL,
    universe_id text NOT NULL REFERENCES catalogue_universe(id),
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    advice text NOT NULL DEFAULT '',
    guide_slug text
);
CREATE INDEX category_by_universe ON category(universe_id);

CREATE TABLE product (
    id text PRIMARY KEY NOT NULL,
    brand_id text NOT NULL REFERENCES brand(id),
    category_id text NOT NULL REFERENCES category(id),
    slug text NOT NULL UNIQUE,
    sku text NOT NULL UNIQUE,
    name text NOT NULL,
    description text NOT NULL DEFAULT '',
    image_key text,
    price_centimes integer CHECK (price_centimes >= 0),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    UNIQUE (category_id, id)
);
CREATE INDEX product_by_brand ON product(brand_id, category_id);
CREATE INDEX product_by_category ON product(category_id, brand_id);

CREATE TABLE product_specification (
    product_id text NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    label text NOT NULL,
    value text NOT NULL,
    display_order integer NOT NULL CHECK (display_order >= 0),
    PRIMARY KEY (product_id, label)
);

-- Each pair is stored once, in ascending ID order, within a single family.
CREATE TABLE product_comparison (
    category_id text NOT NULL,
    product_a_id text NOT NULL,
    product_b_id text NOT NULL,
    PRIMARY KEY (product_a_id, product_b_id),
    CHECK (product_a_id < product_b_id),
    FOREIGN KEY (category_id, product_a_id) REFERENCES product(category_id, id) ON DELETE CASCADE,
    FOREIGN KEY (category_id, product_b_id) REFERENCES product(category_id, id) ON DELETE CASCADE
);
CREATE INDEX comparison_by_second_product ON product_comparison(product_b_id);

COMMIT;
