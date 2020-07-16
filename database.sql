CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int ,
  "user_id" int ,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" integer,
  "price" integer NOT NULL,
  "quantity" integer DEFAULT 0,
  "status" integer DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "update_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int 
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL ,
  "email" text UNIQUE NOT NULL ,
  "password" text NOT NULL,
  "cpf_cnpj" text NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (now()),
  "update_at" timestamp DEFAULT (now())
);

-- foreign key
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--  auto updated_at products 

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products 
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--  auto updated_at users 

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users 
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--cascade 

ALTER TABLE "files" 
ADD CONSTRAINT files_product_id_fkey
FOREIGN KEY ("product_id")
references "products"("id")
on delete cascade;

ALTER TABLE "products" 
ADD CONSTRAINT products_user_id_fkey
FOREIGN KEY ("user_id")
references "users"("id")
on delete cascade;

ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;

--create table orders

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "seller_id" int not null,
  "buyer_id" int not null,
    "product_id" int not null,
    "price" int not null,
    "quantity" int default 0,
    "total" int not null,
    "status" text not null,
  "created_at" timestamp default (now()),
    "updated_at" timestamp default (now())
  );
  
  ALTER TABLE "orders" add foreign key ("seller_id") references "users"("id");
  ALTER TABLE "orders" add foreign key ("seller_id") references "users"("id");
  ALTER TABLE "orders" add foreign key ("seller_id") references "products"("id");
  
  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

--SOFT DELETE
--1. Criar uma colua na table products "deleted_at"
ALTER TABLE products ADD COLUMN "deleted_at" TIMESTAMP;
--2. Criar uma regra que vai rodar todas as vezes que solicitarmos o delete
CREATE OR REPLACE RULE delete_product AS ON delete to products do instead 
UPDATE products 
SET deleted_at = now()
WHERE products.id = old.id;
--3. Criar uma VIEW onde vamo puxar somente os produtos ativos
CREATE VIEW products_whithout_deleted AS
SELECT * FROM products Where deleted_at IS null;
--4. RENOMEAR A VIEW e TABLE
ALTER TABLE PRODUCTS RENAME TO products_with_deleted;
ALTER VIEW PRODUCTS_without_deleted RENAME TO products;
