const chai = use('chai')
const expect = chai.expect
const request = use('supertest')
const nock = use('nock')
const Env = use('Env')
const baseUrl = Env.get('FUNCTIONAL_SERVER_URL')

describe('Functional tests', () => {
  it('Main endpoint can be reached', async () => {
    const response = await request(baseUrl)
      .get('/')
      .set('Accept', 'text/html')
      .expect(200)

    expect(response.body.message).to.equal('This is the home route')
  })

  it('Request can be mocked with nock', async () => {
    nock(baseUrl)
      .get('/')
      .reply(200, {
        message: 'Fake message'
      })

    const response = await request(baseUrl)
      .get('/')
      .set('Accept', 'text/html')
      .expect(200)

    expect(response.body.message).to.equal('Fake message')
    nock.cleanAll()
  })
})
