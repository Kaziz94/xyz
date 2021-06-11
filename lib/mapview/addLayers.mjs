export default function(layers) {

  if (!Array.isArray(layers)) return;

  const mapview = this

  layers.forEach((layer, i) => {
    layer.mapview = mapview
    mapp.layer(layer)
    mapview.layers.list[layer.key] = layer
  })

  return layers

}