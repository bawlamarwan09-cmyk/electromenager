CREATE TABLE IF NOT EXISTS product_import_state (
    product_id text PRIMARY KEY NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    applied_values text NOT NULL
);
