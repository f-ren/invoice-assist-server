const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.DATABASE_TEST_URL,
  });
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-1',
      password: 'password',
      email: 'test-1@test.com',
      first_name: 'test-1',
      last_name: 'test-1',
      company_name: 'test-1',
    },
    {
      id: 2,
      user_name: 'test-2',
      password: 'password',
      email: 'test-2@test.com',
      first_name: 'test-2',
      last_name: 'test-2',
      company_name: 'test-2',
    },
  ];
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}
function makeInvoices(user) {
  return [
    {
      id: 1,
      user_id: user.id,
      date_created: '2020-07-10T10:43:59.061Z',
      client: 'tester',
      total_sale: null,
    },
    {
      id: 2,
      user_id: user.id,
      date_created: '2020-07-10T10:43:59.061Z',
      client: 'tester2',
      total_sale: null,
    },
    {
      id: 3,
      user_id: user.id,
      date_created: '2020-07-10T10:43:59.061Z',
      client: 'tester3',
      total_sale: null,
    },
  ];
}
function makeProducts(user) {
  return [
    { id: 1, user_id: user.id, descr: 'tester', sale_price: 99 },
    { id: 2, user_id: user.id, descr: 'tester2', sale_price: 99 },
    { id: 3, user_id: user.id, descr: 'tester3', sale_price: 99 },
  ];
}

function makeItems(user, invoice, product) {
  return [
    {
      id: 1,
      user_id: user.id,
      invoice_id: invoice.id,
      product_id: product.id,
      qty: 2,
    },
    {
      id: 2,
      user_id: user.id,
      invoice_id: invoice.id,
      product_id: product.id,
      qty: 1,
    },
    {
      id: 3,
      user_id: user.id,
      invoice_id: invoice.id,
      product_id: product.id,
      qty: 3,
    },
  ];
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx.raw(
      'TRUNCATE user_info, products, invoices, items RESTART IDENTITY CASCADE'
    )
  );
}
function seedUsers(db, users) {
  const testData = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.transaction(async (trx) => {
    await trx.into('user_info').insert(testData);
  });
}

async function seedUsersInvoices(db, users, invoices) {
  await seedUsers(db, users);
  await db.transaction(async (trx) => {
    await trx.into('invoices').insert(invoices);
  });
}
async function seedUsersProducts(db, users, products) {
  await seedUsers(db, users);
  await db.transaction(async (trx) => {
    await trx.into('products').insert(products);
  });
}
async function seedUserInvProTables(db, users, invoices, products) {
  await seedUsers(db, users);
  await db.transaction(async (trx) => {
    await trx.into('invoices').insert(invoices);
  });
  await db.transaction(async (trx) => {
    await trx.into('products').insert(products);
  });
}
async function seedItems(db, users, invoices, products, items) {
  await seedUserInvProTables(db, users, invoices, products);
  await db.transaction(async (trx) => {
    await trx.into('items').insert(items);
  });
}
module.exports = {
  makeKnexInstance,
  makeAuthHeader,
  makeUsersArray,
  cleanTables,
  makeItems,
  makeProducts,
  makeInvoices,
  seedUsers,
  seedUsersInvoices,
  seedUsersProducts,
  seedUserInvProTables,
  seedItems,
};
