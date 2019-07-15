'use strict'

module.exports = factory

// eslint-disable-next-line
const URL_LIST = `https://www.malt-whisky-madness.com/maltmadness/whisky/index.html`

function factory() {
  const exports = { getDistilleries }

  async function getDistilleries() {
    throw new Error('Not implemented')
  }

  return exports
}
