-- Insert four legacy orders
INSERT INTO orders (id, customer_name, order_date, total_amount, status) VALUES
(1001, 'John Doe', '2023-01-15 10:30:00', 150.75, 'shipped'),
(1002, 'Jane Smith', '2023-02-20 14:00:00', 200.50, 'pending'),
(1003, 'Peter Jones', '2023-03-10 09:00:00', 45.00, 'delivered'),
(1004, 'Mary Johnson', '2023-04-01 18:45:00', 80.25, 'shipped');
