'use strict'

const { writeFileSync } = require('fs')
const jsdom = require('jsdom')
const stringify = require('json-stable-stringify')
const fetch = require('node-fetch')

const logWriter = process.stdout.write.bind(process.stdout)
const logLevel = require('process').env.LOG_LEVEL || 'info'
const log = require('./lib/log')(logWriter, logLevel)
const types = require('./util/types')()
const slugify = require('./util/slugify')(types)
const Model = require('./lib/model')(log, require, stringify, slugify, types)
const scrape = require('./lib/scrape')(log, fetch, jsdom)
const regex = require('./util/regex')(types)
const sources = require('./lib/sources')(scrape, regex, types)

const DATA_FILE = `${__dirname}/data.json`

// App
loadData()
  .then(updateData)
  .then(saveData)
  .catch(err => {
    const error = err.stack ? err.stack : err
    if (err.stack) log('error', error)
    process.exit(1)
  })

/**
 * Load data from disk and construct model
 * @returns {Model}
 */
async function loadData() {
  log('info', `Loading data file: ${DATA_FILE}`)
  try {
    return Promise.resolve(Model.fromFile(DATA_FILE))
  } catch (err) {
    return Promise.resolve(new Model({ data: [] }))
  }
}

/**
 * Serialise data and save to disk
 * @param {Model} model
 */
async function saveData(model) {
  const updatedDataJSON = model.toJSON()
  log('info', `Saving data file: ${DATA_FILE}`)
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
    log('info', `Fetching data from source: ${source.id}`)
    model.updateDistilleries(await source.getDistilleries())
  }
  return model
}
