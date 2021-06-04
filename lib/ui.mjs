import listview from './ui/listview.mjs'

import layerview from './ui/layerview.mjs'

import {toggleExpanderParent} from './ui/toggleExpanderParent.mjs'

import {default as aColorPicker} from 'a-color-picker'

import {idle} from './ui/idle.mjs'

import {flatpickr, formatDate, formatDateTime, meltDateStr} from './utils/datePicker.mjs'

const ui = {
  listview: listview,
  layerview: layerview,
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