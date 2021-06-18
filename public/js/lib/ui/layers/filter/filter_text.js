export default (_xyz) => (layer, filter_entry) => {
  if (filter_entry.el && filter_entry.el.parentNode)
    return _xyz.layers.view.filter.reset(layer, filter_entry);
  const block = _xyz.layers.view.filter.block(layer, filter_entry);
  block.dataset.field = filter_entry.field;
  filter_entry.el = block;
  block.appendChild(mapp.utils.html.node`
  <input type="text" placeholder=${mapp.dictionary.layer_filter_text} onkeyup=${(e) => {
    layer.filter.current[filter_entry.field] = {};
    layer.filter.current[filter_entry.field][filter_entry.filter] = encodeURIComponent(e.target.value);
    layer.reload();
    layer.show();
    layer.count((n) => {
      if (filter_entry.filterZoom && n > 1)
        layer.zoomToExtent();
    });
  }}>`);
};
