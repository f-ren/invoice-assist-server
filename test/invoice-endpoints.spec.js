const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Invoices Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testInvoices = helpers.makeInvoices(testUser);

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

  describe(`GET /`, () => {
    context(`Given User has invoices in the databse`, () => {
      const userInvoices = testInvoices.filter(
        (inv) => inv.user_id === testUser.id
      );
      beforeEach('insert users and invoices', () => {
        return helpers.seedUsersInvoices(db, testUsers, testInvoices);
      });
      it(`responds with 200 and user's invoices`, () => {
        return supertest(app)
          .get('/')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            userInvoices.forEach((userInvoice, idx) => {
              const inv = res.body[idx];
              expect(inv).to.have.property('id', userInvoice.id);
              expect(inv).to.have.property('user_id', userInvoice.user_id);
              expect(inv).to.have.property('client', userInvoice.client);
              expect(inv).to.have.property(
                'date_created',
                userInvoice.date_created
              );
              expect(inv).to.have.property(
                'total_sale',
                userInvoice.total_sale
              );
            });
          });
      });
    });
  });
  describe(`DELETE /invoice/:id`, () => {
    context('Given invoice in the database', () => {
      const userInvoices = testInvoices.filter(
        (inv) => inv.user_id === testUser.id
      );
      beforeEach('insert users and invoices', () => {
        return helpers.seedUsersInvoices(db, testUsers, testInvoices);
      });
      it('responds 204 and removes the invoice', () => {
        const idToDelete = 2;
        return supertest(app)
          .delete(`/invoice/${idToDelete}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(204);
      });
    });
  });
  // describe(`PATCH /invoice/:id`, () => {
  //   context(`PATCH User's invoice `, () => {
  //     const userInvoices = testInvoices.filter(
  //       (inv) => inv.user_id === testUser.id
  //     );
  //     beforeEach('insert users and invoices', () => {
  //       return helpers.seedUsersInvoices(db, testUsers, testInvoices);
  //     });
  //     it(`responds with 400 when missing key`, () => {
  //       const postBody = {
  //         random: 'test missing key',
  //       };
  //       return supertest(app)
  //         .patch('/invoice/:id')
  //         .set('Authorization', helpers.makeAuthHeader(testUser))
  //         .send(postBody)
  //         .expect(400, { error: 'Missing' });
  //     });
  //   });
  // });
});
