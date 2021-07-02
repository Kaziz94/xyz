export default layer => mapp.utils.html.node`
<button
  class="btn-wide primary-colour"
  onclick=${e => {

    e.stopPropagation()

    const btn = e.target

    if (btn.classList.contains('active')) return layer.mapview.interaction.cancel()

    btn.classList.add('active')
    layer.show()

    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg')

    layer.mapview.interactions.draw({
      layer: layer,
      type: 'Polygon',
      checkKinks: true,
      //tooltip: layer.edit.polygon.tooltip,
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg')
        btn.classList.remove('active')
      }
    })

    // layer.mapview.interaction.draw.begin({
    //   layer: layer,
    //   type: 'Polygon',
    //   geometryFunction: _xyz.mapview.interaction.draw.polygonKinks,
    //   tooltip: layer.edit.polygon.tooltip,
    //   callback: () => {
    //     layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg')
    //     btn.classList.remove('active')
    //   }
    // })

  }}>${mapp.dictionary.layer_draw_polygon}`