'use strict'

module.exports = factory

function factory(fetch, { JSDOM }) {
  const exports = scrape

  /**
   * @param {String} url
   * @returns {Jsdom}
   * @throws {Error}
   */
  async function scrape(url) {
    try {
      const response = await fetch(url)
      const body = await response.text()
      return new JSDOM(body)
    } catch (err) {
      process.stderr.write(err)
      return false
    }
  }

  return exports
}
