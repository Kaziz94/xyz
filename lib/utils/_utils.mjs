import paramString from './paramString.mjs'

import promiseAll from './promiseAll.mjs'

import xhr from './xhr.mjs'

import icon from './icon.mjs'

import loadPlugins from './loadPlugins.mjs'

import {dataURLtoBlob} from './dataURLtoBlob.mjs'

import {getCircularReplacer} from './getCircularReplacer.mjs'

import {decode as isolineHereDecode} from './here_flexible_polyline.mjs'

import {render, html, svg} from 'uhtml'

import {default as chroma} from 'chroma-js'

import {nanoid} from 'nanoid'

import pointOnFeature from '@turf/point-on-feature'

import kinks from '@turf/kinks'

import flatten from '@turf/flatten'

import circle from '@turf/circle'

import {default as merge} from 'lodash/merge.js'

import {default as cloneDeep} from 'lodash/cloneDeep.js'

const utils = {
  paramString: paramString,
  promiseAll: promiseAll,
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
  xhr: xhr,
  icon: icon,
  loadPlugins: loadPlugins,
  getCircularReplacer: getCircularReplacer,
  isolineHereDecode: isolineHereDecode,
  chroma: chroma,
  nanoid: nanoid,
  render: render,
  html: html,
  svg: svg,
}

export default utils