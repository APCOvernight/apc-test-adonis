const chai = require('chai')
chai.use(require('sinon-chai'))
const expect = chai.expect
const sinon = require('sinon')
const Env = use('Env')

describe('Some fake tests to check our dependencies are working', () => {
  it('Chai asserts true is not false', () => {
    expect(true).to.not.equal(false)
  })

  it('Chai catches error', () => {
    try {
      expect(true).to.equal(false)
      throw new Error()
    } catch (e) {
      expect(e.message).to.equal('expected true to equal false')
    }
  })

  it('Env can be reached', () => {
    expect(Env.get('HOST')).to.equal('127.0.0.1')
  })

  it('Env can be stubbed', () => {
    const envStub = sinon.stub(Env, 'get').returns('192.168.0.1')
    expect(Env.get('HOST')).to.equal('192.168.0.1')
    expect(envStub).to.be.calledOnce
    envStub.restore()
  })
})
