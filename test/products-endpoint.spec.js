const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Products Endpoints', function () {
  let db;
  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testProducts = helpers.makeProducts(testUser);

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

  describe(`GET /products`, () => {
    context(`Given products in the database`, () => {
      const userProducts = testProducts.filter(
        (pro) => pro.user_id === testUser.id
      );
      beforeEach('insert users and invoices', () => {
        return helpers.seedUsersProducts(db, testUsers, testProducts);
      });
      it(`responds with 200 and user's products`, () => {
        return supertest(app)
          .get('/products')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            userProducts.forEach((userProduct, idx) => {
              const pro = res.body[idx];
              expect(pro).to.have.property('id', userProduct.id);
              expect(pro).to.have.property('user_id', userProduct.user_id);
              expect(pro).to.have.property('descr', userProduct.descr);
              expect(pro).to.have.property(
                'sale_price',
                userProduct.sale_price
              );
            });
          });
      });
    });
  });
});
