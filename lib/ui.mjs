import layerlistview from './ui/layer/listview.mjs'

import layerview from './ui/layer/_view.mjs'

import locationlistview from './ui/location/listview.mjs'

import locationview from './ui/location/view/_view.mjs'

import {toggleExpanderParent} from './ui/toggleExpanderParent.mjs'

import tabview from './ui/tabview.mjs'

import dataview from './ui/dataview.mjs'

import {default as aColorPicker} from 'a-color-picker'

import {idle} from './ui/idle.mjs'

import {flatpickr, formatDate, formatDateTime, meltDateStr} from './ui/datePicker.mjs'

const ui = {
  layer: {
    view: layerview,
    listview: layerlistview,
  },
  location: {
    view: locationview,
    listview: locationlistview,
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