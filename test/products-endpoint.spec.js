const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Products Endpoints', function() {
  let db

  const {
    testUsers,
    testArticles,
    testComments,
  } = helpers.makeArticlesFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /products`, () => {
    context(`Given no products`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/products')
          .expect(200, [])
      })
    })
