export default layer => mapp.utils.html.node`
  <button
    class="btn-wide primary-colour"
    onclick=${e => {
      
      e.stopPropagation()
      const btn = e.target
      
      if (btn.classList.contains('active')) return layer.mapview.interaction.draw.cancel()
      
      btn.classList.add('active')
      layer.show()
      
      layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg')
      
      layer.mapview.interaction.draw.begin({
        layer: layer,
        type: 'Point',
        callback: () => {
          layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg')
          btn.classList.remove('active');
        }})
    
    }}>${mapp.dictionary.layer_draw_point}`