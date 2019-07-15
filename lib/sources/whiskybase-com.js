'use strict'

module.exports = factory

/* eslint-disable */
const URL_LIST = `https://www.whiskybase.com/explore/distillery?country_id=191&sort=name&direction=asc`
const URL_DATA = `https://www.whiskybase.com/whiskies/distillery/{id}`
/* eslint-enable */

function factory() {
  const exports = { getDistilleries }

  async function getDistilleries() {
    throw new Error('Not implemented')
  }

  return exports
}
