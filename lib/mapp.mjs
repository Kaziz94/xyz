import utils from './utils/_utils.mjs'

import hooks from './hooks.mjs'

import dictionaries from './dictionaries/_dictionaries.mjs'

import icon from './icon.mjs'

import mapview from './mapview/_mapview.mjs'

import highlight from './mapview/interactions/highlight.mjs'

import tabview from './ui/tabview.mjs'

import layers from './layers/_layers.mjs'

import layer from './layers/layer.mjs'

import location from './locations/_location.mjs'

import query from './query.mjs'

import xhr from './xhr.mjs'

import proxy from './proxy.mjs'

import plugins from './plugins.mjs'

import dataviews from './dataviews.mjs'

import gazetteer from './gazetteer.mjs'

hooks.parse()

const _mapp = {
  version: '4.0.0',
  utils: utils,
  hooks: hooks,
  xhr: xhr,
  mapview: mapview,
  interactions: {
    highlight: highlight
  },
  layer: layer,
  location: location,
  plugins: {},
  icon: icon,
  dictionaries: dictionaries,
  dictionary: Object.assign(
    {},
    dictionaries.en,
    hooks.current.language && dictionaries[hooks.current.language] || {})
}

window.mapp = window.mapp || {}

Object.assign(window.mapp, _mapp)

export default _mapp