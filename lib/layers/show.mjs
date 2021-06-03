export default function () {

  const layer = this

  layer.display = true

  layer.view && layer.view.dispatchEvent(new CustomEvent('display-on'))

  layer.L && layer.Map.removeLayer(layer.L)

  layer.Map.addLayer(layer.L)

  if (layer.style && layer.style.label) {

    layer.Map.removeLayer(layer.label)

    // layer.Map.getLayers().forEach(l => {
    //   l === layer.label && layer.Map.removeLayer(layer.label)
    // })

    layer.style.label.display && layer.Map.addLayer(layer.label)
  }

  layer.mapview.attribution.check()

  // Push the layer into the layers hook array.
  mapp.hooks && mapp.hooks.push('layers', layer.key)

  // Show tabs with display truthful.
  layer.tabs.forEach(tab => {
    tab.display && tab.show()
  })

}