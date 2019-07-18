'use strict'

module.exports = factory

/**
 * Note: critical, alert, emergency are not exposed!
 *  They seem to not serve a use case in this context,
 *  such errors should be exposed as typical exceptions.
 * @param {Function(String)} write - A write function, like `console.log` or `process.stdout.write`
 * @param {String} minLevel
 */
function factory(write, minLevel = 'info') {
  const exports = log

  const LEVELS = {
    debug: 0,
    info: 1,
    notice: 2,
    warning: 3,
    error: 4
  }

  /**
   * @param {String} level
   * @param {String} str
   */
  function log(level, str) {
    if (LEVELS[minLevel] > LEVELS[level]) return

    const now = new Date().toISOString()
    write(`[${now}] ${level.toUpperCase()} ${str}\n`)
  }

  return exports
}
