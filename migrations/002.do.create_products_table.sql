CREATE TABLE products (
    id SERIAL PRIMARY KEY UNIQUE,
    user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE NOT NULL,
    descr TEXT NOT NULL,
    sale_price INTEGER
);