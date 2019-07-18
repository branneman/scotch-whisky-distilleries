'use strict'

module.exports = factory

const URL_LIST = `https://uiscebeatha.co.uk/active-scotch-distilleries/`

function factory(scrape) {
  const exports = {
    id: 'uiscebeatha-co-uk',
    getDistilleries
  }

  async function getDistilleries() {
    const dom = await scrape(URL_LIST)
    const doc = dom.window.document

    const rows = doc.querySelectorAll('#post-122 .rwd-table tr')
    const prop = (tr, id) => tr.querySelector(`td[data-th="${id}"]`)

    const list = []

    for (const tr of rows) {
      const name = prop(tr, 'Distillery')
      if (!name || !name.textContent) continue

      const region1 = prop(tr, 'Region').textContent

      list.push({
        name: name.textContent.replace(/ Distillery$/, ''),
        active: true, // uiscebeatha.co.uk lists only active
        owner: prop(tr, 'Owned By').textContent,
        region1,
        founded: Number(prop(tr, 'Founded').textContent)
      })
    }

    return list
  }

  return exports
}
