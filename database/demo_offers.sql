-- Example offers for the initial demo catalogue only.
BEGIN;
INSERT INTO promotion (id,name,percent_off,starts_on,ends_on,active)
VALUES ('demo-selection','Sélection de démonstration',15,'2026-01-01','2030-12-31',1);
INSERT INTO promotion_product (promotion_id,product_id)
SELECT 'demo-selection',id FROM product WHERE id IN ('AV-F420','AV-L800','AV-C650','AV-A200');
COMMIT;
