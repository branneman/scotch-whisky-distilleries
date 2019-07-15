'use strict'

module.exports = factory

// eslint-disable-next-line
const URL_DATA = 'http://www.scotchwhisky.net/distilleries/{name}.htm'

function factory() {
  const exports = { getDistilleries }

  async function getDistilleries() {
    throw new Error('Not implemented')
  }

  return exports
}
