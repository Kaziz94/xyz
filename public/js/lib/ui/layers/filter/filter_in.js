export default (_xyz) => (layer, filter_entry) => {
  if (filter_entry.el && filter_entry.el.parentNode)
    return _xyz.layers.view.filter.reset(layer, filter_entry);
  const block = _xyz.layers.view.filter.block(layer, filter_entry);
  block.dataset.field = filter_entry.field;
  filter_entry.el = block;
  if (!layer.filter.current[layer.style.theme && layer.style.theme.field || filter_entry.field]) {
    layer.filter.current[layer.style.theme && layer.style.theme.field || filter_entry.field] = {};
  }
  filter_entry.filter.in.forEach((val) => {
    block.appendChild(mapp.utils.html.node`
    <label class="input-checkbox">
    <input
      type="checkbox"
      onchange=${(e) => {
      if (e.target.checked) {
        if (!layer.filter.current[filter_entry.field])
          layer.filter.current[filter_entry.field] = {};
        if (!layer.filter.current[filter_entry.field].in) {
          layer.filter.current[filter_entry.field].in = [];
        }
        layer.filter.current[filter_entry.field].in.push(encodeURIComponent(e.target.parentNode.innerText));
      } else {
        let idx = layer.filter.current[filter_entry.field]["in"].indexOf(encodeURIComponent(e.target.parentNode.innerText));
        layer.filter.current[filter_entry.field].in.splice(idx, 1);
        if (!layer.filter.current[filter_entry.field].in.length) {
          delete layer.filter.current[filter_entry.field].in;
        }
      }
      layer.reload();
      layer.show();
      layer.count((n) => {
        if (filter_entry.filterZoom && n > 1)
          layer.zoomToExtent();
      });
    }}>
    </input>
    <div></div><span>${val}`);
  });
};
