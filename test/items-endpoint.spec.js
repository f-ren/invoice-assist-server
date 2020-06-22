const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Items Endpoints', function() {
  let db

  const {
    testUsers,
    testitems,
    testComments,
  } = helpers.makeitemsFixtures()

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

  describe(`GET /items`, () => {
    context(`Given no items`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/items')
          .expect(200, [])
      })
    })
