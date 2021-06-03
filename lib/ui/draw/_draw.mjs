import point from './point.mjs';

// import polygon from './polygon.mjs';

// import rectangle from './rectangle.mjs';

// import circle from './circle.mjs';

// import line from './line.mjs';

// import freehand from './freehand.mjs';

// import isoline_mapbox from './isoline_mapbox.mjs';

// import isoline_here from './isoline_here.mjs';

const draw = {
  point: point
}

export default layer => {

  if (!layer.edit || !Object.keys(layer.edit).some(key => !!draw[key])) return
   
  const panel = layer.view.appendChild(mapp.utils.html.node`
    <div class="drawer panel expandable draw-panel">`)
  
  // Panel header
  panel.appendChild(mapp.utils.html.node`
    <div
      class="header primary-colour"
      onclick=${e => {
        e.stopPropagation();
        mapp.ui.toggleExpanderParent(e.target, true)
      }}>
      <span>${mapp_dictionary.layer_add_new_location}</span>
      <button class="btn-header xyz-icon icon-expander primary-colour-filter">`)

  panel.append(...Object.keys(layer.edit)
    .map(key => draw[key] && draw[key](layer))
    .filter(node => !!node))
  
}