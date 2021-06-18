import filter_text from "./filter_text.js";
import filter_numeric from "./filter_numeric.js";
import filter_in from "./filter_in.js";
import filter_date from "./filter_date.js";
import filter_boolean from "./filter_boolean.js";
export default (_xyz) => {
  const filter = {
    panel,
    block,
    reset,
    filter_text: filter_text(_xyz),
    filter_numeric: filter_numeric(_xyz),
    filter_in: filter_in(_xyz),
    filter_date: filter_date(_xyz),
    filter_boolean: filter_boolean(_xyz)
  };
  return filter;
  function block(layer, filter_entry) {
    const block2 = mapp.utils.html.node`
    <div class="drawer">
    <div class="header bold">
    <span>${filter_entry.title}</span>
    <button
      class="btn-header xyz-icon icon-close primary-colour-filter"
      onclick=${(e) => {
      layer.filter.current[filter_entry.field] = {};
      layer.reload();
      layer.show();
      block2.remove();
      if (!layer.filter.list.children.length)
        layer.filter.clear_all.style.display = "none";
    }}>`;
    layer.filter.list.appendChild(block2);
    return block2;
  }
  function reset(layer, filter_entry) {
    filter_entry.el.parentNode.removeChild(filter_entry.el);
    filter_entry.el = null;
    if (!layer.filter.list.children.length)
      layer.filter.clear_all.style.display = "none";
  }
  function panel(layer) {
    if (!layer.infoj)
      return;
    if (!layer.infoj.some((entry) => entry.filter))
      return;
    const infoj = layer.infoj.filter((entry) => entry.filter);
    infoj.unshift(mapp.dictionary.layer_filter_select);
    const panel2 = mapp.utils.html.node`
    <div class="drawer panel expandable">`;
    panel2.appendChild(mapp.utils.html.node`
    <div
      class="header primary-colour"
      onclick=${(e) => {
      e.stopPropagation();
      mapp.ui.toggleExpanderParent(e.target, true);
    }}><span>${mapp.dictionary.layer_filter_header}</span><button
      class="btn-header xyz-icon icon-expander primary-colour-filter">`);
    let filter_entries = {};
    Object.values(infoj).forEach((el) => {
      if (el.field)
        filter_entries[el.field] = el.title || el.field;
    });
    layer.filter.select = mapp.utils.html.node`
      <button class="btn-drop">
        <div
          class="head"
          onclick=${(e) => {
      e.preventDefault();
      e.target.parentElement.classList.toggle("active");
    }}>
          <span>${mapp.dictionary.layer_filter_select}</span>
          <div class="icon"></div>
        </div>
        <ul>${Object.entries(filter_entries).map((keyVal) => mapp.utils.html.node`
          <li onclick=${(e) => {
      const drop = e.target.closest(".btn-drop");
      drop.classList.toggle("active");
      const entry = infoj.find((entry2) => entry2.field === keyVal[0]);
      layer.filter.clear_all.style.display = "block";
      if (entry.filter == "date")
        return filter.filter_date(layer, entry);
      if (entry.filter === "numeric")
        return filter.filter_numeric(layer, entry);
      if (entry.filter === "like" || entry.filter === "match")
        return filter.filter_text(layer, entry);
      if (entry.filter.in)
        return filter.filter_in(layer, entry);
      if (entry.filter === "boolean")
        return filter.filter_boolean(layer, entry);
    }}>${keyVal[1]}`)}`;
    panel2.appendChild(layer.filter.select);
    layer.filter.clear_all = mapp.utils.html.node`
    <button
      class="primary-colour"
      style="display: none; margin-bottom: 5px;"
      onclick=${(e) => {
      e.target.style.display = "none";
      layer.filter.list.innerHTML = null;
      Object.keys(layer.filter.current).forEach((key) => layer.filter.current[key] = {});
      layer.reload();
      layer.show();
    }}>${mapp.dictionary.layer_filter_clear_all}`;
    panel2.appendChild(layer.filter.clear_all);
    layer.filter.list = mapp.utils.html.node`<div>`;
    panel2.appendChild(layer.filter.list);
    return panel2;
  }
};
