import tableCurrent from './tableCurrent.mjs'

import tableMin from './tableMin.mjs'

import tableMax from './tableMax.mjs'

import zoomToExtent from './zoomToExtent.mjs'

import show from './show.mjs'

import remove from './remove.mjs'

import count from './count.mjs'

import bringToFront from './bringToFront.mjs'

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

export default layer => {
  
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