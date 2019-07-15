'use strict'

module.exports = factory

function factory({ isStr }) {
  const exports = slugify

  function slugify(input) {
    if (!isStr(input)) {
      throw new Error('slugify() must receive a string')
    }

    let output = input
    output = output.toLowerCase()
    output = output.replace(/[^a-z]+/g, '-')

    return output
  }

  return exports
}
