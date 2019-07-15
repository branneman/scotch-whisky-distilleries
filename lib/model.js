'use strict'

module.exports = factory

const REGIONS = {
  Islands: 'Highlands',
  Highlands: 'Highlands',
  Lowlands: 'Lowlands',
  Islay: 'Islay',
  Speyside: 'Speyside',
  Campbeltown: 'Campbeltown'
}

function factory(require, stringify, slugify, { isStr, isObj }) {
  /**
   * Scotch Whisky data: domain model
   */
  const exports = class Model {
    /**
     * Ignores `meta` and `stats` properties
     * @param {Object<{ data: Object }>} data
     */
    constructor({ data }) {
      this._data = data
    }

    /**
     * Model factory function
     * @param {String} path
     * @returns {Model}
     */
    static fromFile(path) {
      return new Model(require(path))
    }

    /**
     * @returns {Array<Object>}
     */
    getDistilleries() {
      return this._data
    }

    /**
     * Add/update distilleries
     * @param {Array<Object>} distilleries
     * @returns {undefined}
     */
    updateDistilleries(distilleries) {
      distilleries.forEach(d => this.updateDistillery(d))
    }

    /**
     * Add/update a single distillery
     * @param {Object} distillery
     * @returns {undefined}
     */
    updateDistillery(distillery) {
      const matches = this._data.filter(this.matchDistillery(distillery))

      let entry = {}

      // Add new distillery
      if (matches.length === 0) {
        this._data.push(entry)
      }

      // Update existing distillery
      else if (matches.length === 1) {
        entry = matches[0]
      }

      // Conflict: multiple matches
      else if (matches.length > 1) {
        throw new Error(`Multiple matches for: ${distillery}`)
      }

      // Generate ID's
      if (!isObj(entry.id)) {
        entry.id = { id: slugify(distillery.name) }
      }

      // Update values
      const props = ['name', 'active', 'owner', 'founded', 'region1']
      props.forEach(name => (entry[name] = distillery[name]))

      if (isStr(entry.region2)) entry.region1 = REGIONS[entry.region2]
    }

    /**
     * Generates a comparison predicate function
     * @param {Object} d1
     * @param {Object} d2
     * @returns {function(a): function(b): Boolean}
     */
    matchDistillery(d1) {
      return d2 => {
        // Match on name
        if (d1.name === d2.name) return true
        if (d1.name.toLowerCase() === d2.name.toLowerCase()) return true

        // Match on `id`
        if (
          isObj(d1.id) &&
          isStr(d1.id.id) &&
          isObj(d2.id) &&
          isStr(d2.id.id) &&
          d1.id.id === d2.id.id
        )
          return true

        return false
      }
    }

    /**
     * Export with meta+stats as JSON
     * Locale `gd-GB` is: Scottish Gaelic (United Kingdom)
     * @returns {String}
     */
    toJSON() {
      const sortPredicate = (a, b) =>
        a.name.localeCompare(b.name, 'gd-GB', { sensitivity: 'base' })
      const data = this._data.sort(sortPredicate)

      const meta = { lastUpdated: +new Date() }
      const stats = { totalDistilleries: this._data.length }

      return stringify({ meta, stats, data }, { space: 2 })
    }
  }

  return exports
}
