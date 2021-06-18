import layerView from './ui/layers/view.mjs'

import layerListview from './ui/layers/listview.mjs'

import locationView from './ui/locations/view.mjs'

import locationListview from './ui/locations/listview.mjs'

import infoj from './ui/locations/infoj.mjs'

import tabview from './ui/tabview.mjs'

import dataview from './ui/dataview.mjs'

import {toggleExpanderParent} from './ui/toggleExpanderParent.mjs'

import {default as aColorPicker} from 'a-color-picker'

import {idle} from './ui/idle.mjs'

import {flatpickr, formatDate, formatDateTime, meltDateStr} from './ui/datePicker.mjs'

const ui = {
  layers: {
    view: layerView,
    listview: layerListview,
  },
  locations: {
    view: locationView,
    listview: locationListview,
    infoj: infoj,
  },
  dataview: dataview,
  tabview: tabview,
  toggleExpanderParent: toggleExpanderParent,
  aColorPicker: aColorPicker,
  flatpickr: flatpickr,
  formatDate: formatDate,
  formatDateTime: formatDateTime,
  meltDateStr: meltDateStr,
  idle: idle,
}

window.mapp = window.mapp || {}

window.mapp.ui = ui

export default ui