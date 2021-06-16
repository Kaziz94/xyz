import layers from './ui/layers/_layer.mjs'

import locations from './ui/locations/_location.mjs'

import tabview from './ui/tabview.mjs'

import dataview from './ui/dataview.mjs'

import {toggleExpanderParent} from './ui/toggleExpanderParent.mjs'

import {default as aColorPicker} from 'a-color-picker'

import {idle} from './ui/idle.mjs'

import {flatpickr, formatDate, formatDateTime, meltDateStr} from './ui/datePicker.mjs'

const ui = {
  layers: layers,
  locations: locations,
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