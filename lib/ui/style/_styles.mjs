import categorized from './categorized.mjs'

import graduated from './graduated.mjs'

import grid from './grid.mjs'

import bivariate from './bivariate.mjs'

import dynamic from './dynamic.mjs'

import basic from './basic.mjs'

import {html} from 'uhtml'

const themes = {
  categorized: categorized,
  graduated: graduated,
  grid: grid,
  // bivariate: bivariate,
  // dynamic: dynamic,
  // basic: basic,
}

export default layer => {

    if (!layer.style) return

    if (layer.style.hidden) return

    if (!layer.style.theme && !layer.style.label) return

    // Create style panel
    const panel = layer.view.appendChild(html.node`
      <div class="drawer panel expandable">`)
  
    // Append panel header
    panel.appendChild(html.node`
    <div
      class="header primary-colour"
      onclick=${e => {
        e.stopPropagation()
        mapp.ui.toggleExpanderParent(e.target, true)
      }}>
      <span>${mapp_dictionary.layer_style_header}</span>
      <button class="btn-header xyz-icon icon-expander primary-colour-filter">`)
  
    // Add toggle for label layer.
    // if (layer.style.label) {

    //   const z = _xyz.map.getView().getZoom();

    //   const label_input = panel.appendChild(html.node`
    //     <label
    //       class="${`input-checkbox ${z <= layer.style.label.minZoom && 'disabled' || ''} ${z >= layer.style.label.maxZoom && 'disabled' || ''}`}"
    //       style="margin-bottom: 10px;">
    //       <input type="checkbox"
    //         .checked=${!!layer.style.label.display}
    //         onchange=${e => {
    //           layer.style.label.display = e.target.checked
    //           layer.show()
    //         }}>
    //       </input>
    //       <div></div>
    //       <span>${layer.style.label.title || mapp_dictionary.layer_style_display_labels}`);

    //   (layer.style.label.minZoom || layer.style.label.maxZoom) &&
    //   _xyz.mapview.node.addEventListener('changeEnd', () => {

    //     const z = _xyz.map.getView().getZoom();

    //     if (z <= layer.style.label.minZoom) return label_input.classList.add('disabled')

    //     if (z >= layer.style.label.maxZoom) return label_input.classList.add('disabled')
        
    //     label_input.classList.remove('disabled')
    //   })
    // }

    // Add theme control
    layer.style.themes && panel.appendChild(html.node`
      <div>${mapp_dictionary.layer_style_select_theme}</div>
      <button class="btn-drop">
      <div
        class="head"
        onclick=${e => {
          e.preventDefault();
          e.target.parentElement.classList.toggle('active');
        }}>
        <span>${Object.keys(layer.style.themes)[0]}</span>
        <div class="icon"></div>
      </div>
      <ul>
        ${Object.entries(layer.style.themes).map(
          theme => html.node`
          <li onclick=${e=>{
            const drop = e.target.closest('.btn-drop');
            drop.querySelector('span').textContent = theme[0];
            drop.classList.toggle('active');
            layer.style.theme = theme[1];
            applyTheme(layer);
            layer.reload();
          }}>${theme[0]}`)}`);

    layer.style.bringToFront = html.node`
      <button 
        title=${mapp_dictionary.layer_style_bring_to_front}
        style="margin-top: 5px;"
        class="btn-wide primary-colour"
        onclick=${()=>layer.bringToFront()}>${mapp_dictionary.layer_style_bring_to_front}`

    if (!layer.style.theme && layer.style.label) panel.appendChild(layer.style.bringToFront)

    if(layer.style.theme) applyTheme(layer)
  
    return panel
  
    function applyTheme(layer) {
      
      // Empty legend.
      layer.style.legend && layer.style.legend.remove()

      layer.style.bringToFront.remove()

      if (layer.style.theme && !layer.style.theme.type) return

      layer.style.legend = legend(layer)
      
      panel.appendChild(layer.style.legend)

      panel.appendChild(layer.style.bringToFront)

    }

  function legend(layer) {

    layer.style.legend = html.node`<div class="legend">`

    layer.filter = layer.filter || {}

    return themes[layer.style.theme.type](layer)

  }

}