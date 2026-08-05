-- Insert four legacy orders
INSERT INTO orders (id, product, quantity, price, status, created_at, updated_at) VALUES
(1001, 'Legacy Product A', 1, 150.75, 'shipped', '2023-01-15 10:30:00', '2023-01-15 10:30:00'),
(1002, 'Legacy Product B', 1, 200.50, 'pending', '2023-02-20 14:00:00', '2023-02-20 14:00:00'),
(1003, 'Legacy Product C', 1, 45.00, 'delivered', '2023-03-10 09:00:00', '2023-03-10 09:00:00'),
(1004, 'Legacy Product D', 1, 80.25, 'shipped', '2023-04-01 18:45:00', '2023-04-01 18:45:00');
