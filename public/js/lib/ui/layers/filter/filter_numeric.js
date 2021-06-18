export default (_xyz) => (layer, filter_entry) => {
  if (filter_entry.el && filter_entry.el.parentNode)
    return _xyz.layers.view.filter.reset(layer, filter_entry);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", _xyz.host + "/api/query?" + mapp.utils.paramString({
    template: "field_stats",
    locale: _xyz.locale.key,
    layer: layer.key,
    table: layer.tableCurrent(),
    field: filter_entry.field,
    filter: layer.filter && layer.filter.current
  }));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = "json";
  xhr.onload = (e) => {
    const field_range = e.target.response;
    const block = _xyz.layers.view.filter.block(layer, filter_entry);
    block.dataset.field = filter_entry.field;
    filter_entry.el = block;
    const step = filter_entry.type === "integer" ? 1 : 0.01;
    var range = mapp.utils.html.node`
    <div class="input-flex">
      <span>${mapp.dictionary.layer_filter_greater}`;
    const input_min = mapp.utils.html.node`
    <input
      type="number"
      min=${field_range.min}
      value=${field_range.min}
      max=${field_range.max}
      step=${step}
      onkeyup=${(e2) => {
      slider_min.value = e2.target.value;
      applyFilter();
    }}>`;
    range.appendChild(input_min);
    block.appendChild(range);
    const div_min = mapp.utils.html.node`<div class="input-range">`;
    block.appendChild(div_min);
    const slider_min = mapp.utils.html.node`
    <input
      type="range"
      class="secondary-colour-bg"
      min=${field_range.min}
      value=${field_range.min}
      max=${field_range.max}
      step=${step}
      oninput=${(e2) => {
      input_min.value = e2.target.value;
      applyFilter();
    }}>`;
    div_min.appendChild(slider_min);
    var range = mapp.utils.html.node`
    <div class="input-flex">
      <span>${mapp.dictionary.layer_filter_smaller}`;
    const input_max = mapp.utils.html.node`
    <input
      type="number"
      min=${field_range.min}
      value=${field_range.max}
      max=${field_range.max}
      step=${step}
      onkeyup=${(e2) => {
      slider_max.value = e2.target.value;
      applyFilter();
    }}>`;
    range.appendChild(input_max);
    block.appendChild(range);
    var div_max = mapp.utils.html.node`<div class="input-range">`;
    block.appendChild(div_max);
    const slider_max = mapp.utils.html.node`
    <input
      type="range"
      class="secondary-colour-bg"
      min=${field_range.min}
      value=${field_range.max}
      max=${field_range.max}
      step=${step}
      oninput=${(e2) => {
      input_max.value = e2.target.value;
      applyFilter();
    }}>`;
    div_max.appendChild(slider_max);
    let timeout;
    function applyFilter() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        layer.filter.current[filter_entry.field] = {};
        layer.filter.current[filter_entry.field].gte = parseFloat(input_min.value);
        layer.filter.current[filter_entry.field].lte = parseFloat(input_max.value);
        layer.reload();
        layer.show();
        layer.count((n) => {
          if (filter_entry.filterZoom && n > 1)
            layer.zoomToExtent();
        });
      }, 500);
    }
  };
  xhr.send();
};
