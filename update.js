'use strict'

const { writeFileSync } = require('fs')
const stringify = require('json-stable-stringify')
const types = require('./util/types')()
const slugify = require('./util/slugify')(types)
const Model = require('./lib/model')(require, stringify, slugify, types)
const fetch = require('node-fetch')
const jsdom = require('jsdom')
const scrape = require('./lib/scrape')(fetch, jsdom)
const sources = require('./lib/sources')(scrape)

const DATA_FILE = `${__dirname}/data.json`

// App
loadData()
  .then(updateData)
  .then(saveData)
  .catch(err => {
    process.stderr.write(err)
    process.exit(1)
  })

/**
 * Load data from disk and construct model
 * @returns {Model}
 */
async function loadData() {
  const model = Model.fromFile(DATA_FILE)
  return Promise.resolve(model)
}

/**
 * Serialise data and save to disk
 * @param {Model} model
 */
async function saveData(model) {
  const updatedDataJSON = model.toJSON()
  writeFileSync(DATA_FILE, updatedDataJSON)
  return Promise.resolve()
}

/**
 * Update list of distilleries and their data
 * @param {Model} model
 * @returns {Model}
 */
async function updateData(model) {
  for (const source of sources) {
    if (!source.getDistilleries) continue
    model.updateDistilleries(await source.getDistilleries())
  }
  return model
}
