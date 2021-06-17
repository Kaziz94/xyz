import tableCurrent from './tableCurrent.mjs';

import tableMin from './tableMin.mjs';

import tableMax from './tableMax.mjs';

import zoomToExtent from './zoomToExtent.mjs';

import show from './show.mjs';

import remove from './remove.mjs';

import count from './count.mjs';

import bringToFront from './bringToFront.mjs';

import mbtiles from './format/mbtiles.mjs'

import tiles from './format/tiles.mjs'

import mvt from './format/mvt.mjs'

import cluster from './format/cluster.mjs'

import geojson from './format/geojson.mjs'

const format = {
  mbtiles: mbtiles,
  tiles: tiles,
  mvt: mvt,
  cluster: cluster,
  geojson: geojson,
}

export default {
  add: add,
  get: get,
  decorate: decorate,
}

function decorate(layer) {

  layer.mapview = layer.mapview || this
  
  format[layer.format] && format[layer.format](layer)
  
  Object.assign(
    layer, {
      show: show,
      remove: remove,
      tableCurrent: tableCurrent,
      tableMin: tableMin,
      tableMax: tableMax,
      zoomToExtent: zoomToExtent,
      count: count,
      bringToFront: bringToFront,
      tabs: new Set(),
    })

  //layer.filter.current = layer.filter.current || {}
  layer.filter = {
    current: {}
  }

  // Set the first theme from themes array as layer.style.theme
  if (layer.style && layer.style.themes) {
    layer.style.theme = layer.style.theme || layer.style.themes[Object.keys(layer.style.themes)[0]];
  }

  return layer

}

function add(layers, _mapview){

  const mapview = _mapview || this

  if (!Array.isArray(layers)) return;

  layers.forEach((_layer, i) => {
    const layer = mapp.utils.lodash.cloneDeep(_layer);
    layer.mapview = mapview
    decorate(layer)
    mapview.layers.list[layer.key] = layer
  })

  return layers

}

function get(layers, _mapview) {

  const mapview = _mapview || this

  if (!Array.isArray(layers)) return;
 
  return new Promise((resolveAll, rejectAll) => {

    const promises = layers
      .map(layer => mapp.utils.xhr(`${mapview.host}/api/workspace/get/layer?locale=${mapview.locale.key}&layer=${layer}`))

    Promise
      .all(promises)
      .then(resolveAll)
      .catch(error => {
        console.error(error)
        rejectAll(error)
      })

  })
}