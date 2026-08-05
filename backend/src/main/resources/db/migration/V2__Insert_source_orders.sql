INSERT INTO orders (
  id, customer_name, customer_email, item_description, quantity,
  unit_price_cents, status, notes, created_at, updated_at
) VALUES
  (1001, 'Acme Corp', 'purchasing@acme.example', 'Steel widgets, 5cm', 40, 1250, 'PAID', 'Net-30 account', '2024-01-10 10:00:00Z', '2024-01-10 10:00:00Z'),
  (1002, 'Globex', 'orders@globex.example', 'Copper fittings', 12, 890, 'NEW', NULL, '2024-01-11 11:00:00Z', '2024-01-11 11:00:00Z'),
  (1003, 'Initech', 'sam@initech.example', 'TPS report binders', 100, 315, 'SHIPPED', 'Rush order, ship FedEx', '2024-01-12 12:00:00Z', '2024-01-12 12:00:00Z'),
  (1004, 'Umbrella Ltd', 'lab@umbrella.example', 'Glass vials 10ml', 500, 42, 'CANCELLED', 'Cancelled by customer 3/4', '2024-01-13 13:00:00Z', '2024-01-13 13:00:00Z');


