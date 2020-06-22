CREATE TABLE items(
    id SERIAL PRIMARY KEY UNIQUE,
    user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE NOT NULL,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    qty INTEGER
);