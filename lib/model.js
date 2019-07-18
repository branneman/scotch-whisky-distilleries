'use strict'

module.exports = factory

const PROPS = ['name', 'active', 'owner', 'founded', 'region1', 'region2']

const REGIONS = {
  Islands: 'Highlands',
  Highlands: 'Highlands',
  Lowlands: 'Lowlands',
  Islay: 'Islay',
  Speyside: 'Speyside',
  Campbeltown: 'Campbeltown'
}

function factory(log, require, stringify, slugify, { isUndef, isStr, isObj }) {
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
      if (!isObj(entry.id)) entry.id = { id: slugify(distillery.name) }
      if (isObj(distillery.id)) Object.assign(entry.id, distillery.id)

      this.mergeDistilleryFields(entry, distillery)
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

    mergeDistilleryFields(target, data) {
      // Invalid values
      if (isStr(data.owner) && data.owner === 'Independent') delete data.owner

      // Company legal entity postfixes
      if (isStr(data.owner)) {
        data.owner = data.owner
          .replace(/ Inc\.?$/, '')
          .replace(/ Ltd\.?$/, '')
          .replace(/ PLC$/i, '')
          .replace(/ Co\.?$/, '')
          .replace(/ Company$/, '')
          .replace(/ Co\.? Ltd\.?$/, '')
          .replace(/ Company Limited$/, '')

        // 'Owned by'
        data.owner = data.owner
          .replace('John Dewar & Sons', 'Bacardi')
          .replace('Pernod-Ricard', 'Pernod Ricard')
          .replace('Diagio', 'Diageo')
          .replace('Whyte and Mackay', 'Whyte & Mackay')
          .replace('J. & G. Grant', 'J&G Grant')

        data.owner = data.owner.trim()
      }

      // Update values
      for (const prop of PROPS) {
        // Exists in neither: skip
        if (isUndef(target[prop]) && isUndef(data[prop])) continue

        // Exists only in target: skip
        if (!isUndef(target[prop]) && isUndef(data[prop])) continue

        // Exists only in data: write
        if (isUndef(target[prop]) && !isUndef(data[prop]))
          target[prop] = data[prop]

        // Exists in both: overwrite
        if (!isUndef(target[prop]) && !isUndef(data[prop])) {
          if (target[prop] !== data[prop])
            log(
              'notice',
              `Duplicate property '${prop}' with different values: '${target[prop]}' ≠ '${data[prop]}'`
            )
          target[prop] = data[prop]
        }
      }

      // Generate region1 if region2 was provided
      if (isStr(target.region2)) target.region1 = REGIONS[target.region2]
      if (target.region1 === target.region2) delete target.region2
    }

    /**
     * Export with meta+stats as JSON
     * Locale `gd-GB`: Scottish Gaelic (United Kingdom)
     * @returns {String}
     */
    toJSON() {
      const sortPredicate = (a, b) =>
        a.name.localeCompare(b.name, 'gd-GB', { sensitivity: 'base' })
      const data = this._data.sort(sortPredicate)

      const _meta = {
        lastUpdated: new Date().toISOString(),
        stats: { totalDistilleries: this._data.length }
      }

      return stringify({ _meta, data }, { space: 2 })
    }
  }

  return exports
}
