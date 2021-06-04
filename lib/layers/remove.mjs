export default function () {

  const layer = this

  layer.display = false

  layer.view && layer.view.dispatchEvent(new CustomEvent('display-off'))

  layer.L && layer.mapview.Map.removeLayer(layer.L)

  if (layer.style && layer.style.label && layer.label) {
    layer.mapview.Map.removeLayer(layer.label)
  }

  layer.mapview.attribution.check()

  // Filter the layer from the layers hook array.
  if (mapp.hooks) mapp.hooks.filter('layers', layer.key)

  // Remove layer tabs.
  layer.tabs.forEach(tab => tab.remove())

}