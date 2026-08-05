CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  item_description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
  status VARCHAR(255) NOT NULL DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
