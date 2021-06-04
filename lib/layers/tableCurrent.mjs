export default function () {

  const layer = this

  if (!layer.tables) return layer.table

  let
    table,
    zoom = parseInt(layer.mapview.Map.getView.getZoom()),
    zoomKeys = Object.keys(layer.tables),
    minZoomKey = parseInt(zoomKeys[0]),
    maxZoomKey = parseInt(zoomKeys[zoomKeys.length - 1])
            
  table = layer.tables[zoom]

  table = zoom < minZoomKey ? layer.tables[minZoomKey] : table

  table = zoom > maxZoomKey ? layer.tables[maxZoomKey] : table

  return table

}