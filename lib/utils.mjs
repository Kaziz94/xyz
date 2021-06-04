import paramString from './utils/paramString.mjs'

import {dataURLtoBlob} from './utils/dataURLtoBlob.mjs'

import pointOnFeature from '@turf/point-on-feature'

import kinks from '@turf/kinks'

import flatten from '@turf/flatten'

import circle from '@turf/circle'

import {render, html, svg} from 'uhtml'

import {default as chroma} from 'chroma-js'

import {nanoid} from 'nanoid'

import {default as merge} from 'lodash/merge.js'

import {default as cloneDeep} from 'lodash/cloneDeep.js'

import {getCircularReplacer} from './utils/getCircularReplacer.mjs'

import {decode as isolineHereDecode} from './utils/here_flexible_polyline.mjs'

const utils = {
  paramString: paramString,
  dataURLtoBlob: dataURLtoBlob,
  turf: {
    pointOnFeature: pointOnFeature,
    kinks: kinks,
    flatten: flatten,
    circle: circle,
  },
  lodash: {
    merge: merge,
    cloneDeep: cloneDeep,
  },
  getCircularReplacer: getCircularReplacer,
  isolineHereDecode: isolineHereDecode,
  chroma: chroma,
  nanoid: nanoid,
  render: render,
  html: html,
  svg: svg,
}

export default utils