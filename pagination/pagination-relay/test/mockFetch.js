global.fetch = require('jest-fetch-mock')

export function mockFetch({ status = 200, response }) {
  global.fetch = jest.fn(async () => ({
    status,
    ok: status < 400,
    json: async () => response
  }))
}
