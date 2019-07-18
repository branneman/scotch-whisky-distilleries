'use strict'

module.exports = factory

const URL_LIST = `https://www.whiskybase.com/explore/distillery?country_id=191&sort=name&direction=asc`
const URL_DATA = `https://www.whiskybase.com/whiskies/distillery/{id}/about`

const SELECTOR_ROWS = `#compositor-material .compositor-grid .compositor-gridrow .info`
const SELECTOR_LINKS = `a[href^="https://www.whiskybase.com/whiskies/distillery/"]`
const SELECTOR_DETAILS = `.company-details li div.title`
const SELECTOR_ADDRESS = `.company-address`

const INACTIVE_STATES = ['Closed', 'Mothballed', 'Silent']

function factory(scrape, matchAll, { isNull }) {
  const exports = {
    id: 'whiskybase-com',
    getDistilleries,
    getDistillery
  }

  async function getDistilleries() {
    const dom = await scrape(URL_LIST)
    const doc = dom.window.document
    const rows = doc.querySelectorAll(`${SELECTOR_ROWS} ${SELECTOR_LINKS}`)

    const list = []

    for (const row of rows) {
      const id = Number(
        row.getAttribute('href').match(/\/whiskies\/distillery\/(\d+)\//)[1]
      )

      const distillery = {
        id: { [exports.id]: id },
        name: row.textContent.replace(/ Distillery$/, ''),
        ...(await getDistillery(id))
      }

      list.push(distillery)
    }

    return list
  }

  async function getDistillery(id) {
    if (Number.isNaN(id)) throw new Error('Could not extract whisky id')

    const url = URL_DATA.replace('{id}', id)
    const dom = await scrape(url)
    const doc = dom.window.document

    const distillery = {}

    // Grab props & values from details column
    const elements = doc.querySelectorAll(SELECTOR_DETAILS)
    for (const elem of elements) {
      const prop = _mapProp(elem.textContent)
      if (isNull(prop)) continue

      const value = _mapValue(prop, elem.nextElementSibling.textContent)
      if (isNull(value)) continue

      distillery[prop] = value
    }

    // Grab region
    const element = doc.querySelector(SELECTOR_ADDRESS)
    const region2 = _mapAddressToRegion2(element.textContent)
    if (!isNull(region2)) distillery['region2'] = region2

    return distillery
  }

  function _mapProp(prop) {
    return (
      {
        Status: 'active',
        Founded: 'founded',
        Owner: 'owner'
      }[prop] || null
    )
  }

  function _mapValue(prop, value) {
    if (prop === 'active') {
      if (value === 'Active') return true
      if (INACTIVE_STATES.includes(value)) return false
      if (value === 'Unknown') return null
      throw new Error(`${prop} incorrect status: ${value}`)
    }

    if (prop === 'founded') {
      const matches = value.match(/^\d{2}\.\d{2}\.(\d{4})$/)
      if (!matches || !matches[1])
        throw new Error(`Could not extract year from: ${value}`)
      return Number(value.substr(-4))
    }

    if (prop === 'owner') {
      return value
    }

    throw new Error(`Unsupported prop: ${prop}`)
  }

  function _mapAddressToRegion2(address) {
    const matches = matchAll(/^.+Scotland\s+([a-z]+).+$/gis, address)
    if (!matches || !matches[0] || !matches[0][1]) return null
    return matches[0][1]
  }

  return exports
}
