document.dispatchEvent(new CustomEvent('bring_layer_to_front', {
  detail: _xyz => {

    _xyz.layers.plugins.bring_layer_to_front = layer => {

      layer.view.appendChild(mapp.utils.html.node`
      <div style="padding-right: 5px">
      <button 
        title=${mapp.dictionary.layer_style_bring_to_front}
        style="margin-top: 5px;"
        class="btn-wide primary-colour"
        onclick=${()=>layer.bringToFront()}>${mapp.dictionary.layer_style_bring_to_front}`)

    }

  }
}))