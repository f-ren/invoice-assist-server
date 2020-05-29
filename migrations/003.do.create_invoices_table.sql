CREATE TABLE invoices(
    id SERIAL PRIMARY KEY UNIQUE,
    user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now(),
    client TEXT NOT NULL,
    total_sale INTEGER
);