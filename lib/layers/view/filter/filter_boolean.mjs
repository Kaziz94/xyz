export default _xyz => (layer, filter_entry) => {

  // Reset deselected filter
  if(filter_entry.el && filter_entry.el.parentNode) return _xyz.layers.view.filter.reset(layer, filter_entry);

  const block = _xyz.layers.view.filter.block(layer, filter_entry);

  // identify element with filter field
  block.dataset.field = filter_entry.field;

  // Bind element with filter entry
  filter_entry.el = block;

  if (!layer.filter.current[filter_entry.field.field]) {
    layer.filter.current[filter_entry.field] = {}
  }
	
  layer.filter.current[filter_entry.field]['boolean'] = true;

  block.appendChild(_xyz.utils.html.node`
  <label class="input-checkbox">
  <input type="checkbox"
    checked=true 
    onchange=${e=>{

      if (e.target.checked) {
        layer.filter.current[filter_entry.field]['boolean'] = true;
      } else {
        layer.filter.current[filter_entry.field]['boolean'] = false;
      }
  
      layer.reload();
  
      layer.count(n => {
      
        if (filter_entry.filterZoom && n > 1) layer.zoomToExtent();
    
      })
    }}>
  </input>
  <div></div><span>${filter_entry.name || _xyz.language.layer_filter_boolean}`);

  layer.reload();
  layer.show();

  layer.count(n => {

    if (filter_entry.filterZoom && n > 1) layer.zoomToExtent();

  })

};