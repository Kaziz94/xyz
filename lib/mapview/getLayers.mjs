export default function(layers) {

  if (!Array.isArray(layers)) return;

  const mapview = this

  return new Promise((resolveAll, rejectAll) => {

    const promises = layers
      .map(layer => mapp.xhr(`${mapview.host}/api/workspace/get/layer?locale=${mapview.locale.key}&layer=${layer}`))

    Promise
      .all(promises)
      .then(resolveAll)
      .catch(error => {
        console.error(error)
        rejectAll(error)
      })

  })
}
