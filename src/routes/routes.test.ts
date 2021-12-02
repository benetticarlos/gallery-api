import app from '../app'
import supertest from 'supertest'
import assetMock from './mocks/asset-mock'
const request = supertest(app)

it('Gets the hello endpoint', async done => {
  const response = await request.get('/v1/hello')

  expect(response.status).toBe(200)
  expect(response.body).toStrictEqual({ status: 'ok', msg: 'Hello!' })

  done()

})

it('Gets the open sea events endpoint', async done => {
  const response = await request.get('/v1/opensea/events')

  expect(response.status).toBe(200)
  expect(response.body).not.toBeUndefined(); 
  expect(response.body.length). toBeGreaterThan(0)
  
  done()

})

it('Gets the open sea assets endpoint', async done => {
  const response = await request.get('/v1/opensea/assets')

  expect(response.status).toBe(200)
  expect(response.body).not.toBeUndefined();
  expect(response.body.length). toBeGreaterThan(0)
  
  done()

})

it('Gets the open sea collections endpoint', async done => {
  const response = await request.get('/v1/opensea/collections')

  expect(response.status).toBe(200)
  expect(response.body).not.toBeUndefined();
  expect(response.body.length). toBeGreaterThan(0)
  
  done()

})

it('Gets the open sea asset endpoint', async done => {
  const response = await request.get('/v1/opensea/asset/0x495f947276749ce646f68ac8c248420045cb7b5e/87272100997576470218316221593913462824244998321481903711455382949502373593089')

  expect(response.status).toBe(200)
  expect(response.body).not.toBeUndefined();
  // const data = await request.get('https://api.opensea.io/api/v1/asset/0x495f947276749ce646f68ac8c248420045cb7b5e/87272100997576470218316221593913462824244998321481903711455382949502373593089')
  expect(response.body).toBe(assetMock)
  
  done()

})
