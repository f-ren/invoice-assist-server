const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Items Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testInvoices = helpers.makeInvoices(testUser);
  const [testInvoice] = testInvoices;
  const testProducts = helpers.makeProducts(testUser);
  const [testProduct] = testProducts;
  const testItems = helpers.makeItems(testUser, testInvoice, testProduct);

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`GET /items`, () => {
    context(`Given  User has items in database`, () => {
      const userItems = testItems.filter((it) => it.user_id === testUser.id);
      console.log(userItems);
      beforeEach('insert users and invoices', () => {
        return helpers.seedItems(
          db,
          testUsers,
          testInvoices,
          testProducts,
          testItems
        );
      });
      it(`responds with 200 and user's items`, () => {
        return supertest(app)
          .get('/items')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            userItems.forEach((userItem, idx) => {
              const it = res.body[idx];
              console.log(res.body);
              expect(it).to.have.property('id', userItem.id);
              expect(it).to.have.property('user_id', userItem.user_id);
              expect(it).to.have.property('invoice_id', userItem.invoice_id);
              expect(it).to.have.property('product_id', userItem.product_id);
              expect(it).to.have.property('qty', userItem.qty);
            });
          });
      });
    });
  });
});
