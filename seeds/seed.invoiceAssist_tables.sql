BEGIN;

TRUNCATE
  user_info,
  products,
  invoices,
  items
  RESTART IDENTITY CASCADE;

INSERT INTO user_info (user_name, password, email, first_name, last_name, company_name)
VALUES
('dunder', '$2a$16$Uc67TFi9QAK1kYpNU2jQduG/GLIMiUyc5fqYqgEv9JN.clMvsdIK.', 'fakeemail@sofake.com', 'dunder', 'mifflin', 'Does Stuff Company'),
('helpme', '$2a$16$Uc67TFi9QAK1kYpNU2jQduG/GLIMiUyc5fqYqgEv9JN.clMvsdIK.', 'uberfake@sofake.com', 'help', 'me', 'Need Help'),
('mmm', '$2a$16$Uc67TFi9QAK1kYpNU2jQduG/GLIMiUyc5fqYqgEv9JN.clMvsdIK.', 'basicallyaunicorn@sofake.com', 'unicorn', 'magic', 'Magical Muffins for Muggles');

INSERT INTO products (user_id, descr, sale_price)
VALUES
(1,'I did a thing for someone', 99.99),
(1,'I thought about doing a thing for someone', 00.01),
(1,'I almost did it, I swear', 10.00),
(2,'Please someone', 15.99),
(2,'I beg you', 25.00),
(3,'Mulberry Muffins', 10.00),
(3,'Meringue Muffins', 10.00),
(3,'Molten Muffins', 65.00),
(3,'Moldy Muffins', 1.00);

INSERT INTO invoices(user_id, client, total_sale)
VALUES 
(1, 'Bob', 999),
(1, 'Polly', 999),
(1, 'Bob', 99),
(2, 'Polly', 99),
(2, 'Willy', 919),
(3, 'Fairies', 199),
(3, 'Peppa Pig', 299),
(3, 'Baby Shark', 99),
(3, 'Unicorns', 91),
(3, 'Peppa Pig', 99),
(3, 'Nobody', 99);

INSERT INTO items (user_id, invoice_id, product_id, qty)
VALUES
(1, 2, 1, 2),
(1, 1, 1, 10),
(1, 1, 3, 5),
(1, 3, 2, 1),
(1, 3, 1, 1),
(1, 3, 3, 1),
(2, 4, 5, 2),
(2, 5, 4, 10),
(3, 6, 7, 5),
(3, 6, 9, 1),
(3, 7, 6, 1),
(3, 8, 6, 2),
(3, 8, 8, 10),
(3, 9, 9, 5),
(3, 10, 7, 1),
(2, 11, 8, 1);

COMMIT;