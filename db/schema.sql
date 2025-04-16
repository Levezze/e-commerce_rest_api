-- Drop Tables and Triggers
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS ring CASCADE;
DROP TABLE IF EXISTS necklace CASCADE;
DROP TABLE IF EXISTS earring CASCADE;

DROP TRIGGER IF EXISTS items_set_item_name ON items;
DROP FUNCTION IF EXISTS generate_item_name;

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
  price decimal,
  in_stock boolean,
  img_url text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp,
  is_featured boolean,
  is_hidden boolean
);

CREATE TABLE ring (
  ring_id int PRIMARY KEY,
  ring_size decimal,
  ring_color colors,
  ring_style varchar(50),
  FOREIGN KEY (ring_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE necklace (
  necklace_id int PRIMARY KEY,
  necklace_length decimal,
  necklace_color colors,
  necklace_style varchar(50),
  FOREIGN KEY (necklace_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE earring (
  earring_id int PRIMARY KEY,
  earring_size decimal,
  earring_color colors,
  earring_style varchar(50),
  FOREIGN KEY (earring_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Users Tables

CREATE TABLE users (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(20),
  user_email varchar(50) UNIQUE,
  user_password text,
  is_active boolean DEFAULT true,
  last_login timestamp,
  user_role user_roles,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  password_reset_token text,
  password_reset_expires timestamp
);

-- Orders Tables

CREATE TABLE orders (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  total decimal,
  shipping_address text,
  status order_status,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Functions & Triggers
CREATE FUNCTION generate_item_name() RETURNS trigger AS $$
BEGIN
  NEW.item_name := NEW.gem_name || ' ' || NEW.jewelry_type;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TRIGGER items_set_item_name
BEFORE INSERT ON items
FOR EACH ROW
EXECUTE FUNCTION generate_item_name();

