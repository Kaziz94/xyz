import tableCurrent from './tableCurrent.mjs'

import tableMin from './tableMin.mjs'

import tableMax from './tableMax.mjs'

import zoomToExtent from './zoomToExtent.mjs'

import show from './show.mjs'

import remove from './remove.mjs'

import count from './count.mjs'

import bringToFront from './bringToFront.mjs'

import mbtiles from './format/mbtiles.mjs'

const format = {
  mbtiles: mbtiles
}

export default layer => {

  format[layer.format] && format[layer.format](layer)

  Object.assign(
    layer, {
      show: show,
      remove: remove,
    })

  return layer;


  function decorate(params) {

    const layer = Object.assign(
      {

        tableCurrent: tableCurrent(_xyz),

        tableMin: tableMin(_xyz),

        tableMax: tableMax(_xyz),

        zoomToExtent: zoomToExtent(_xyz),

        show: show,

        remove: remove,

        count: count(_xyz),

        bringToFront: bringToFront(_xyz),

        tabs: new Set(),

        filter: {},

      },
      params
    )

    layer.filter.current = layer.filter.current || {}

    // Set the first theme from themes array as layer.style.theme
    if (layer.style && layer.style.themes) {
      layer.style.theme = layer.style.theme || layer.style.themes[Object.keys(layer.style.themes)[0]];
    }

    // Initialise Openlayers source and layer.
    layer.format && _xyz.mapview.layer[layer.format] && _xyz.mapview.layer[layer.format](layer);

    return layer;
  }

}