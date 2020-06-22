const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Invoices Endpoints', function() {
  let db

  const {
    testUsers,
    testinvoices,
    testComments,
  } = helpers.makeinvoicesFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /invoices`, () => {
    context(`Given no invoices`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/invoices')
          .expect(200, [])
      })
    })
