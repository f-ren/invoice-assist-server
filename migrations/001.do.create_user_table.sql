CREATE TABLE user_info (
    id SERIAL PRIMARY KEY UNIQUE,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT NOT NULL
);