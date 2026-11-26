BEGIN;
CREATE TABLE IF NOT EXISTS product_image (
    id text PRIMARY KEY NOT NULL,
    product_id text NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text NOT NULL,
    display_order integer NOT NULL CHECK (display_order >= 0),
    UNIQUE (product_id, image_url)
);
CREATE INDEX IF NOT EXISTS images_by_product ON product_image(product_id);
COMMIT;
