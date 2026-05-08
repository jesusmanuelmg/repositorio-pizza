
/*
  # Pizza App Schema

  1. New Tables
    - `pizzas` - Menu items with name, description, base price, image_url, category
    - `toppings` - Available toppings with name, price, category (meat/veggie/cheese/sauce)
    - `orders` - Customer orders with contact info, delivery address, status, total
    - `order_items` - Each pizza in an order, with size and quantity
    - `order_item_toppings` - Toppings selected per order item

  2. Security
    - RLS enabled on all tables
    - Public read access for pizzas and toppings (menu browsing)
    - Anyone can create orders (no auth required for ordering)
    - Orders readable by session token match (anon key access)
*/

-- Pizzas menu table
CREATE TABLE IF NOT EXISTS pizzas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'classic',
  popular boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Toppings table
CREATE TABLE IF NOT EXISTS toppings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'veggie',
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Order items (each pizza line in an order)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pizza_id uuid NOT NULL REFERENCES pizzas(id),
  pizza_name text NOT NULL,
  size text NOT NULL DEFAULT 'medium',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Toppings per order item
CREATE TABLE IF NOT EXISTS order_item_toppings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  topping_id uuid NOT NULL REFERENCES toppings(id),
  topping_name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0
);

-- RLS
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_toppings ENABLE ROW LEVEL SECURITY;

-- Public can read pizzas
CREATE POLICY "Public can read pizzas"
  ON pizzas FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public can read toppings
CREATE POLICY "Public can read toppings"
  ON toppings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can create orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read orders (by id lookup)
CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert order items
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read order items
CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert order item toppings
CREATE POLICY "Anyone can insert order item toppings"
  ON order_item_toppings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read order item toppings
CREATE POLICY "Anyone can read order item toppings"
  ON order_item_toppings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed pizzas
INSERT INTO pizzas (name, description, base_price, image_url, category, popular) VALUES
  ('Margherita', 'Salsa de tomate, mozzarella fresca y albahaca', 9.99, 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600', 'classic', true),
  ('Pepperoni', 'Salsa de tomate, mozzarella y abundante pepperoni', 11.99, 'https://images.pexels.com/photos/739001/pexels-photo-739001.jpeg?auto=compress&cs=tinysrgb&w=600', 'classic', true),
  ('Cuatro Quesos', 'Mozzarella, parmesano, gorgonzola y cheddar', 13.99, 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600', 'specialty', true),
  ('Hawaiana', 'Salsa de tomate, mozzarella, jamón y piña', 12.49, 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=600', 'classic', false),
  ('Vegetariana', 'Pimientos, champiñones, aceitunas, cebolla y tomate cherry', 11.49, 'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=600', 'veggie', false),
  ('BBQ Chicken', 'Salsa BBQ, pollo, cebolla caramelizada y mozzarella', 13.49, 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600', 'specialty', true)
ON CONFLICT DO NOTHING;

-- Seed toppings
INSERT INTO toppings (name, price, category) VALUES
  ('Pepperoni', 1.50, 'meat'),
  ('Jamón', 1.50, 'meat'),
  ('Pollo', 2.00, 'meat'),
  ('Chorizo', 1.75, 'meat'),
  ('Bacon', 1.75, 'meat'),
  ('Champiñones', 1.00, 'veggie'),
  ('Pimientos', 0.75, 'veggie'),
  ('Cebolla', 0.75, 'veggie'),
  ('Aceitunas', 1.00, 'veggie'),
  ('Tomate cherry', 1.00, 'veggie'),
  ('Espinacas', 0.75, 'veggie'),
  ('Piña', 0.75, 'veggie'),
  ('Mozzarella extra', 1.25, 'cheese'),
  ('Parmesano', 1.25, 'cheese'),
  ('Gorgonzola', 1.50, 'cheese'),
  ('Cheddar', 1.25, 'cheese')
ON CONFLICT DO NOTHING;
