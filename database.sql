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