CREATE TABLE orders (
    id BIGINT NOT NULL PRIMARY KEY,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    item_description VARCHAR(255),
    quantity INT NOT NULL,
    unit_price_cents INT NOT NULL,
    status VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
