export default function(layers) {

  if (!Array.isArray(layers)) return;

  const mapview = this

  return new Promise((resolveAll, rejectAll) => {

    const promises = layers
      .map(layer => mapp.xhr(`${mapview.host}/api/workspace/get/layer?locale=${mapview.locale.key}&layer=${layer}`))

    Promise
      .all(promises)
      .then(layers => {

        // if (mapp.hooks && mapp.hooks.current.layers.length) {
        //   layers.forEach(layer => {
        //     layer.display = !!~mapp.hooks.current.layers.indexOf(layer.key)
        //   })
        // }

        layers.forEach((layer, i) => {
          layer.mapview = mapview
          mapp.layer(layer)
          mapview.layers[layer.key] = layer
        })

        resolveAll(layers)
      })
      .catch(error => {
        console.error(error)
        rejectAll(error)
      })

  })

}