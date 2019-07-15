'use strict'

const factory = require('./types')

const types = [
  undefined,
  void 42,

  null,

  // Booleans
  false,
  true,
  Boolean(),

  // Numbers
  0,
  1,
  1.01,
  0.30000000000000004, // 0.1 + 0.2
  0xbada55, // base 16: hex
  0o2471, // base 8: octal
  Number.MAX_SAFE_INTEGER,
  NaN,
  Infinity,
  -Infinity,

  // Strings
  '',
  String(),
  'latin',
  '日本語',

  // Arrays
  [],
  [1, 'two'],
  Array(3), // [ <3 empty items> ]
  [null, undefined],
  new (class A extends Array {})(), // []

  // Objects
  {},
  { length: 0 }, // not an array
  { length: 2, '0': 42 }, // not an array
  { answer: 42 },
  new (class A {})(),
  Object(),
  Object.prototype,
  Object.create(null),

  // Symbols
  Symbol(),
  Symbol('label'),

  // Functions
  //  the last 5 items should be functions, see: isFunc()
  () => 0,
  function named() {},
  Function(),
  parseInt,
  Symbol // function
]

describe('validations', () => {
  it('isUndef()', () => {
    const fn = factory().isUndef
    const valid = [undefined, undefined]
    expect(types.filter(fn)).toStrictEqual(valid)
  })

  it('isNull()', () => {
    const fn = factory().isNull
    const valid = [null]
    expect(types.filter(fn)).toStrictEqual(valid)
  })

  it('isBool()', () => {
    const fn = factory().isBool
    const valid = [false, true, false]
    expect(types.filter(fn)).toStrictEqual(valid)
  })

  it('isNum()', () => {
    const fn = factory().isNum
    const valid = [
      0,
      1,
      1.01,
      0.30000000000000004,
      12245589,
      1337,
      Number.MAX_SAFE_INTEGER
    ]
    expect(types.filter(fn)).toStrictEqual(valid)
  })

  it('isInt()', () => {
    const fn = factory().isInt
    const valid = [0, 1, 12245589, 1337, Number.MAX_SAFE_INTEGER]
    expect(types.filter(fn)).toStrictEqual(valid)
  })

  it('isStr()', () => {
    const fn = factory().isStr
    const valid = ['', '', 'latin', '日本語']
    expect(types.filter(fn)).toStrictEqual(valid)
  })

  it('isArr()', () => {
    const fn = factory().isArr
    const valid = [[], [1, 'two'], Array(3), [null, undefined], []]
    expect(types.filter(fn)).toEqual(valid)
  })

  it('isObj()', () => {
    const fn = factory().isObj
    const valid = [
      {},
      { length: 0 },
      { length: 2, '0': 42 },
      { answer: 42 },
      {},
      {},
      {},
      {}
    ]
    expect(types.filter(fn)).toEqual(valid)
  })

  it('isFunc()', () => {
    const fn = factory().isFunc
    const valid = types.slice(-5)
    expect(types.filter(fn)).toStrictEqual(valid)
  })
})
