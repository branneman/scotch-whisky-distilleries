'use strict'

module.exports = factory

function factory({ isNull, isStr, isRegExp }) {
  const exports = { matchAll }

  /**
   * RegExp: Get all matches and capturing groups
   * @param {RegExp} re
   * @param {String} str
   * @returns {Array<Array<String>>}
   */
  function matchAll(re, str) {
    if (!isRegExp(re) || !isStr(str))
      throw new Error('matchAll(RegExp, String): received incorrect types')

    const matches = []

    let groups
    while (!isNull((groups = re.exec(str)))) {
      matches.push(Array.from(groups))
    }

    return matches
  }

  return exports
}
