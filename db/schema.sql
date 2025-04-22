-- Drop Tables and Triggers

DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS ring CASCADE;
DROP TABLE IF EXISTS necklace CASCADE;
DROP TABLE IF EXISTS earring CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS orders_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS items_tags CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;

-- Enums

DROP TYPE IF EXISTS jewelry_types;
CREATE TYPE jewelry_types AS ENUM ('ring', 'necklace', 'earring');

DROP TYPE IF EXISTS order_status;
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'cancelled', 'returned');

DROP TYPE IF EXISTS user_roles;
CREATE TYPE user_roles AS ENUM ('admin', 'customer');

DROP TYPE IF EXISTS gem_sizes;
CREATE TYPE gem_sizes AS ENUM ('mini', 'tini', 'midi', 'chonki');

DROP TYPE IF EXISTS gem_shapes;
CREATE TYPE gem_shapes AS ENUM ('choo', 'chaa', 'floopy', 'flippy');

DROP TYPE IF EXISTS colors;
CREATE TYPE colors AS ENUM ('gold', 'silver');

-- Catalog Tables

CREATE TABLE items (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  gem_size gem_sizes,
  gem_shape gem_shapes,
  gem_name varchar(50) NOT NULL,
  jewelry_type jewelry_types,
  item_name varchar(100),
  price numeric(10, 2) CHECK (price > 0) NOT NULL,
  in_stock boolean NOT NULL,
  img_url text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp,
  is_featured boolean,
  is_hidden boolean
);

CREATE TABLE ring (
  ring_id int PRIMARY KEY,
  ring_size numeric(10, 2),
  ring_color colors,
  ring_style varchar(50),
  FOREIGN KEY (ring_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE necklace (
  necklace_id int PRIMARY KEY,
  necklace_length numeric(10, 2),
  necklace_color colors,
  necklace_style varchar(50),
  FOREIGN KEY (necklace_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE earring (
  earring_id int PRIMARY KEY,
  earring_size numeric(10, 2),
  earring_color colors,
  earring_style varchar(50),
  FOREIGN KEY (earring_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Users Tables

CREATE TABLE users (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(20) NOT NULL,
  email varchar(50) UNIQUE NOT NULL,
  password text NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamp,
  user_role user_roles NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  password_reset_token text,
  password_reset_expires timestamp
);

-- Orders Tables

CREATE TABLE orders (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  total numeric(10, 2) NOT NULL,
  shipping_address text NOT NULL,
  status order_status DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE orders_items (
  order_id int,
  item_id int,
  price_at_purchase numeric(10, 2),
  PRIMARY KEY (order_id, item_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  rating int CHECK (rating BETWEEN 1 AND 5),
  review text NOT NULL,
  created_at date,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  item_id int,
  quantity int NOT NULL CHECK (quantity > 0),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Tags Tables

CREATE TABLE tags (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tag varchar(20) UNIQUE NOT NULL
);

CREATE TABLE items_tags (
  item_id int,
  tag_id int,
  PRIMARY KEY (item_id, tag_id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Functions & Triggers

DROP TRIGGER IF EXISTS items_set_item_name ON items;
DROP FUNCTION IF EXISTS generate_item_name;
DROP TRIGGER IF EXISTS set_updated_at ON items;
DROP FUNCTION IF EXISTS update_timestamp;

CREATE OR REPLACE FUNCTION generate_item_name() RETURNS TRIGGER AS $$
BEGIN
  NEW.item_name := NEW.gem_name || ' ' || NEW.jewelry_type;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_set_item_name
BEFORE INSERT ON items
FOR EACH ROW
EXECUTE FUNCTION generate_item_name();

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();