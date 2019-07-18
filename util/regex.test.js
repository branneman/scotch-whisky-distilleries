'use strict'

// Integration test: depend on actual types implementation
const types = require('./types')()
const regex = require('./regex')(types)

describe('matchAll()', () => {
  const { matchAll } = regex

  it('throws on incorrect regexp', () => {
    const re = {}
    const str = '123'
    expect(() => matchAll(re, str)).toThrowError(/incorrect types/)
  })

  it('throws on incorrect string', () => {
    const re = /[a-z]/
    const str = 123
    expect(() => matchAll(re, str)).toThrowError(/incorrect types/)
  })

  it('returns multiple matches', () => {
    const re = /#{1,6} .+/g
    const str = `asd
      # one
      body 1
      ## two
      body 2
      body 2 more
      ### three
      body 3`

    const result = matchAll(re, str)

    expect(result).toEqual([['# one'], ['## two'], ['### three']])
  })

  it('returns multiple capuring groups', () => {
    const re = /(#{1,6}) (.+)/g
    const str = `asd
      # one
      body 1
      ## two
      body 2
      body 2 more
      ### three
      body 3`

    const result = matchAll(re, str)

    expect(result).toEqual([
      ['# one', '#', 'one'],
      ['## two', '##', 'two'],
      ['### three', '###', 'three']
    ])
  })
})
