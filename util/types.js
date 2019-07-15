'use strict'

module.exports = factory

function factory() {
  const exports = {
    isUndef,
    isNull,
    isBool,
    isNum,
    isInt,
    isStr,
    isArr,
    isObj,
    isFunc,
    isSymbol
  }

  /**
   * Does not match: `null`
   */
  function isUndef(val) {
    return typeof val === 'undefined'
  }

  /**
   * Does not match: `undefined`
   */
  function isNull(val) {
    return val === null
  }

  /**
   */
  function isBool(val) {
    return typeof val === 'boolean'
  }

  /**
   * Does not match: `NaN`, `Infinity`, `-Infinity`
   */
  function isNum(val) {
    return typeof val === 'number' && isFinite(val)
  }

  /**
   * Does not match: `NaN`, `Infinity`, `-Infinity`
   */
  function isInt(val) {
    return typeof val === 'number' && isFinite(val) && Math.floor(val) === val
  }

  /**
   */
  function isStr(val) {
    return typeof val === 'string'
  }

  /**
   */
  function isArr(val) {
    return Array.isArray(val)
  }

  /**
   * Does not match: arrays, functions, symbols
   */
  function isObj(val) {
    return val === Object(val) && !isArr(val) && !isFunc(val) && !isSymbol(val)
  }

  /**
   */
  function isFunc(val) {
    return typeof val === 'function'
  }

  /**
   */
  function isSymbol(val) {
    return typeof val === 'symbol'
  }

  return exports
}
