export {default as svg_symbols} from './svg_symbols.mjs'

export {default as paramString} from './paramString.mjs'

export {toggleExpanderParent} from './toggleExpanderParent.mjs'

export {copyToClipboard} from './copyToClipboard.mjs'

export {dataURLtoBlob} from './dataURLtoBlob.mjs'

export {idle} from './idle.mjs'

export {getCircularReplacer} from './getCircularReplacer.mjs'

export {flatpickr, formatDate, formatDateTime, meltDateStr} from './datePicker.mjs'

export {render, html, svg} from 'uhtml'

export {default as Chroma} from 'chroma-js'

export {decode as isoline_here_decode} from './here_flexible_polyline.mjs'

export {default as acolorpicker} from 'a-color-picker'

// export const chart = async (canvas, params) => {

//   if (Chart.then) {
//     const _chart = await Chart()
//     return new _chart(canvas, params)
//   }

//   return new Chart(canvas, params)
// }

import pointOnFeature from '@turf/point-on-feature'

import kinks from '@turf/kinks'

import flatten from '@turf/flatten'

import circle from '@turf/circle'

export const turf = {
  pointOnFeature: pointOnFeature,
  kinks: kinks,
  flatten: flatten,
  circle: circle
}

export {default as cloneDeep} from 'lodash/cloneDeep.js'

export {default as merge} from 'lodash/merge.js'

export { nanoid } from 'nanoid'