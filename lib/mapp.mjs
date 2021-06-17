import utils from './utils/_utils.mjs'

import hooks from './hooks.mjs'

import dictionaries from './dictionaries/_dictionaries.mjs'

import mapview from './mapview/_mapview.mjs'

import layer from './layer/_layer.mjs'

import location from './locations/_locations.mjs'

import gazetteer from './gazetteer.mjs'

hooks.parse()

const _mapp = {
  version: '4.0.0',
  utils: utils,
  hooks: hooks,
  mapview: mapview,
  layer: layer,
  location: location,
  plugins: {},
  dictionaries: dictionaries,
  dictionary: dictionaries.en,
}

window.mapp = window.mapp || {}

Object.assign(window.mapp, _mapp)

export default _mapp