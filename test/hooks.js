'use strict'

/*
|--------------------------------------------------------------------------
| Test hooks file
|--------------------------------------------------------------------------
|
| The vow file is loaded before running your tests. This is the best place
| to hook operations `before` and `after` running the tests.
|
*/

const Env = use('Env')
const path = use('path')
const fs = use('fs')

const PortFinder = use('find-free-port')

use('Logger').debug('Starting tests')
/**
 * Mocks are included in the mocks directory. Each file must export an
 * object with the name of the module it is mocking, and the object/function to mock it
 */
const mock = use('mock-require')
const mocksPath = path.join(__dirname, './mocks')

fs.readdirSync(mocksPath).forEach(file => {
  const mockFile = require('./mocks/' + file)
  mock(file.replace('.js', ''), mockFile)
})

/**
 * Will we fire the test server?
 * @type {Boolean}
 */
let fireServer = true

module.exports = (runner) => {
  runner.before(async () => {
    /*
    |--------------------------------------------------------------------------
    | Start the server
    |--------------------------------------------------------------------------
    |
    | Starts the http server before running the tests. You can comment this
    | line, if http server is not required
    |
    */
    if (process.env.TEST_GROUPS && !process.env.TEST_GROUPS.includes('functional')) {
      fireServer = false
    }

    Env.set('API_URL', `http://my-fake-api-url.com`)

    if (fireServer) {
      const [freePort] = await PortFinder(9010, 9100, Env.get('HOST'))

      Env.set('FUNCTIONAL_TEST_PORT', freePort)
      Env.set('FUNCTIONAL_SERVER_URL', `http://${process.env.HOST}:${process.env.FUNCTIONAL_TEST_PORT}`)

      use('Adonis/Src/Server').listen(Env.get('HOST'), Env.get('FUNCTIONAL_TEST_PORT'))
    }
  })

  runner.after(async () => {
    /*
    |--------------------------------------------------------------------------
    | Shutdown server
    |--------------------------------------------------------------------------
    |
    | Shutdown the HTTP server when all tests have been executed.
    |
    */
    fireServer && use('Adonis/Src/Server').getInstance().close()
  })
}
