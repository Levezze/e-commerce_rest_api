-- Drop Tables and Triggers

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;
DROP TABLE IF EXISTS bundles CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS orders_items CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS modules_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS bundles_items CASCADE;
DROP TABLE IF EXISTS items_tags CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Enums

DROP TYPE IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('customer', 'manager', 'admin');

DROP TYPE IF EXISTS order_status;
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

DROP TYPE IF EXISTS item_category;
CREATE TYPE item_category AS ENUM ('generic', 'module', 'accessory', 'bundle');

DROP TYPE IF EXISTS item_type;
CREATE TYPE item_type AS ENUM ('manual', 'auto', 'general');

DROP TYPE IF EXISTS model_name;
CREATE TYPE model_name AS ENUM ('manual_v1', 'auto_v1');

DROP TYPE IF EXISTS frame_color;
CREATE TYPE frame_color AS ENUM ('white', 'black', 'bronze');

DROP TYPE IF EXISTS base_material;
CREATE TYPE base_material AS ENUM ('white_polymer', 'black_polymer', 'wood_oak','wood_maple', 'wood_pine');

DROP TYPE IF EXISTS module_package;
CREATE TYPE module_package AS ENUM ('custom', 'basic', 'minimal');

DROP TYPE IF EXISTS module_size;
CREATE TYPE module_size AS ENUM ('small', 'medium', 'large');

DROP TYPE IF EXISTS controller_type;
CREATE TYPE controller_type AS ENUM ('remote', 'app');

DROP TYPE IF EXISTS media_parent_type;
CREATE TYPE media_parent_type AS ENUM ('item', 'bundle');

DROP TYPE IF EXISTS media_type;
CREATE TYPE media_type AS ENUM ('image', 'video');

-- Catalog Tables

CREATE TABLE items (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_name varchar(100) NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) CHECK (price > 0) NOT NULL,
  in_stock boolean NOT NULL,
  frame_color frame_color NULL,
  base_material base_material NULL,
  module_package module_package NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp,
  is_featured boolean,
  is_hidden boolean
);

-- Bundles Table

CREATE TABLE bundles (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar,
  description text,
  price numeric(10, 2),
  discount numeric(10, 2),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp
);

-- Media Table

CREATE TABLE media (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parent_type media_parent_type NOT NULL, -- 'item' or 'bundle'
  parent_id INT NOT NULL, -- item.id or bundle.id
  url TEXT NOT NULL,
  type media_type NOT NULL,
  "order" INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_item_media FOREIGN KEY (parent_id) REFERENCES items(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
  -- Note: If parent_type is 'bundle', you may want to add a similar FK to bundles
  -- For strict OpenAPI alignment, you may split item_id and bundle_id, but keeping polymorphic for now
);

-- Index for fast lookup by parent (item/bundle) and order
CREATE INDEX IF NOT EXISTS idx_media_parent ON media(parent_type, parent_id, "order");

-- Bundles_Items Join Table

CREATE TABLE bundles_items (
  bundle_id int NOT NULL,
  item_id int NOT NULL,
  PRIMARY KEY (bundle_id, item_id),
  FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Modules Table

CREATE TABLE modules (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  size module_size NOT NULL,
  controller controller_type NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp
);

-- modules_items join table

CREATE TABLE modules_items (
  module_id int NOT NULL,
  item_id int NOT NULL,
  PRIMARY KEY (module_id, item_id),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Accessories Table

CREATE TABLE accessories (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  size module_size NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp
);

-- Users Tables

CREATE TABLE users (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(20) NOT NULL,
  email varchar(50) UNIQUE NOT NULL,
  password text NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamp,
  user_role user_role NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  password_reset_token text,
  password_reset_expires timestamp
);

-- User Addresses Table

CREATE TABLE user_addresses (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int NOT NULL,
  street varchar(100) NOT NULL,
  city varchar(50) NOT NULL,
  zip varchar(20),
  country varchar(50) NOT NULL,
  phone varchar(30),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders Tables

CREATE TABLE orders (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  total numeric(10, 2) NOT NULL,
  shipping_address text NOT NULL,
  status order_status DEFAULT 'pending',
  updated_at timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE orders_items (
  order_id int,
  item_id int,
  bundle_id int NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric(10, 2),
  item_name varchar(100),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp,
  PRIMARY KEY (order_id, item_id, bundle_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  rating int CHECK (rating BETWEEN 1 AND 5),
  review text NOT NULL,
  created_at date,
  updated_at timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  item_id int,
  quantity int NOT NULL CHECK (quantity > 0),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Tags Tables

CREATE TABLE tags (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(50) UNIQUE NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp
);

CREATE UNIQUE INDEX idx_tags_name ON tags (LOWER(name));

CREATE TABLE tags_items (
  tag_id int,
  item_id int,
  PRIMARY KEY (tag_id, item_id),
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Functions & Triggers

DROP TRIGGER IF EXISTS set_updated_at ON items;
DROP FUNCTION IF EXISTS update_timestamp;

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('items','users','user_addresses','modules','accessories','bundles','orders','reviews')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', r.tablename);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_timestamp();', r.tablename);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION normalize_tag_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := LOWER(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS normalize_tag_name_insert ON tags;
CREATE TRIGGER normalize_tag_name_insert
BEFORE INSERT OR UPDATE ON tags
FOR EACH ROW
EXECUTE FUNCTION normalize_tag_name();
