BEGIN;
CREATE TABLE dashboard_user (
    id text PRIMARY KEY NOT NULL,
    email text NOT NULL UNIQUE CHECK (email = lower(trim(email))),
    password_hash text NOT NULL,
    active integer NOT NULL DEFAULT 1 CHECK (active IN (0,1))
);
CREATE TABLE dashboard_session (
    token_hash text PRIMARY KEY NOT NULL,
    user_id text NOT NULL REFERENCES dashboard_user(id) ON DELETE CASCADE,
    expires_at bigint NOT NULL
);
CREATE INDEX sessions_by_user ON dashboard_session(user_id);

ALTER TABLE product ADD COLUMN stock_active integer NOT NULL DEFAULT 0 CHECK (stock_active IN (0,1));
ALTER TABLE product ADD COLUMN stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0);

CREATE TABLE promotion (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    percent_off integer NOT NULL CHECK (percent_off BETWEEN 1 AND 100),
    starts_on date NOT NULL,
    ends_on date NOT NULL CHECK (ends_on >= starts_on),
    active integer NOT NULL DEFAULT 0 CHECK (active IN (0,1))
);
CREATE TABLE promotion_product (
    promotion_id text NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    product_id text NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (promotion_id, product_id)
);
CREATE INDEX promotions_by_product ON promotion_product(product_id);
CREATE VIEW catalogue_offer AS
SELECT p.id AS product_id, p.price_centimes,
    CASE WHEN p.stock_active = 0 THEN 'unconfirmed'
         WHEN p.stock_quantity = 0 THEN 'out_of_stock' ELSE 'in_stock' END AS availability,
    coalesce(max(s.percent_off),0) AS percent_off,
    cast(round(cast(p.price_centimes AS numeric) * (100 - coalesce(max(s.percent_off),0)) / 100.0) AS integer) AS final_price_centimes
FROM product p
LEFT JOIN promotion_product t ON t.product_id = p.id
LEFT JOIN promotion s ON s.id = t.promotion_id AND s.active = 1
    AND CURRENT_DATE BETWEEN s.starts_on AND s.ends_on
GROUP BY p.id, p.price_centimes, p.stock_active, p.stock_quantity;
COMMIT;
