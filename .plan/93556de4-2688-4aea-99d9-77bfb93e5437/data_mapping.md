# Data Mapping

Treat orders-source as immutable input and orders-target as the only application database. Preserve IDs 1001-1004 plus customer_name, customer_email, item_description, quantity, unit_price_cents, status, notes, created_at, and updated_at. Store money as integer cents and preserve NEW, PAID, SHIPPED, and CANCELLED statuses.
