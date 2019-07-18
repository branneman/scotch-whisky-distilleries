'use strict'

module.exports = factory

function factory(log, { default: fetch, Headers, Request }, { JSDOM }) {
  const exports = scrape

  /**
   * @param {String} url
   * @returns {Jsdom}
   * @throws {Error}
   */
  async function scrape(url) {
    try {
      const headers = new Headers()
      headers.append('user-agent', 'Mozilla/5.0 (Linux x86_64) Gecko Firefox')
      const request = new Request(url, { method: 'GET', headers })

      log('debug', `GET ${url}`)
      const response = await fetch(request)
      if (response.status !== 200) throw new Error('Response code ≠ 200')

      const body = await response.text()

      return new JSDOM(body)
    } catch (err) {
      process.stderr.write(err)
      return false
    }
  }

  return exports
}
