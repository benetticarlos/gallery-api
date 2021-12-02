import app from '../app'
import supertest from 'supertest'
const request = supertest(app)

/* Testing  createPlaylist */
describe('POST createPlaylist /playlist', () => {
  // Success
  const user_address = '0x4a20de27d1346d80046910dc428338a49cec53e6'
  const body = {
    title: 'Crypto-Warhol ultimate NFT playlist',
    description: '',
    priority: 5,
  }
  describe('given a user_address and a body with title, description and priority', () => {
    // should save the title, description, priority, user_address, id and user_address
    // shoould respond with a JSON object
    //
    test('should respond with a 200 status code', async () => {
      const response = await request
        .post(`/v1/playlist/${user_address}`)
        .send(body)
      expect(response.statusCode).toBe(200)
    })
    // should specify JSON in the content type header
  })
  //Errors
  describe('when the user_address is invalid', () => {
    // should respond with a status 404
  })

  describe('when the some value of the body comes empty (empty strings for title, description and/or priority', () => {})

  describe('when same user tries to re-create exact same playlist (by title)', () => {})
})
