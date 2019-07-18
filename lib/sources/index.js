'use strict'

module.exports = factory

function factory(scrape, { matchAll }, types) {
  return [
    // require('./malt-whisky-madness-com')(scrape),
    // require('./scotchwhisky-net')(scrape),
    require('./uiscebeatha-co-uk')(scrape),
    require('./whiskybase-com')(scrape, matchAll, types)
  ]
}
