export default layer => mapp.utils.html.node`
<button
  class="btn-wide primary-colour"
  onclick=${e => {

    e.stopPropagation()

    const btn = e.target

    if (btn.classList.contains('active')) return layer.mapview.interactions.highlight()

    btn.classList.add('active')
    layer.show()

    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg')

    layer.mapview.interactions.draw({
      layer: layer,
      type: 'Polygon',
      checkKinks: true,
      //tooltip: layer.edit.polygon.tooltip,
      callback: async feature => {
        if (feature) {
          const table = layer.tableCurrent()

          const id = await mapp.utils.xhr({
            method: 'POST',
            url: `${layer.mapview.host}/api/location/new?${mapp.utils.paramString({
              locale: layer.mapview.locale.key,
              layer: layer.key,
              table: table
            })}`,
            body: JSON.stringify({
              geometry: feature.geometry
            })
          })
    
          layer.reload()
                                  
          layer.mapview.locations.select({
            layer: layer,
            table: table,
            id: id
          })
        }
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg')
        btn.classList.remove('active')
        layer.mapview.interactions.highlight()
      }
    })

  }}>${mapp.dictionary.layer_draw_polygon}`