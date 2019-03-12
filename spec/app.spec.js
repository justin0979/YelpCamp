const Request = require('request')

describe('YelpCamp', () => {
  let server
  beforeAll(function() {
    server = require('../app')
  })
  afterAll(() => {
    server.close();
  })
  describe('GET /', () => {
    beforeAll(done => {
      Request.get('http://localhost:3000/', (err, res, body) => {
        done()
      })
    })
    it('h1', () => {
      expect(document.querySelector('#id')).toBe('Welcome to the Landing Page')
    })
  })
})
