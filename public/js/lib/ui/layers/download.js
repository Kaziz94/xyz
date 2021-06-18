export default (_xyz) => {
  const download = {
    panel
  };
  return download;
  function panel(layer) {
    if (!layer.download)
      return;
    const panel2 = mapp.utils.html.node`<div class="drawer panel expandable">`;
    panel2.appendChild(mapp.utils.html.node`
      <div
        class="header primary-colour"
        onclick=${(e) => {
      mapp.ui.toggleExpanderParent(e.target, true);
    }}>
        <span>${mapp.dictionary.layer_data}</span>
        <button class="btn-header xyz-icon icon-expander primary-colour-filter">`);
    panel2.appendChild(mapp.utils.html.node`
      <label class="input-checkbox">
        <input type="checkbox"
          onchange=${(e) => {
      layer.download.viewport = e.target.checked;
    }}>
        </input>
        <div></div>
        <span>${mapp.dictionary.layer_data_viewport_only}`);
    panel2.appendChild(mapp.utils.html.node`
      <button
        class="btn-wide primary-colour"
        onclick=${(e) => {
      downloadLink(layer);
    }}>${mapp.dictionary.layer_download}`);
    return panel2;
  }
  function downloadLink(layer) {
    layer.download.layer = layer;
    _xyz.query(layer.download).then((response) => {
      const blob = layer.download.format === "json" && blobJson(response) || blobCSV(response);
      const link = mapp.utils.html.node`<a
        href=${URL.createObjectURL(blob)}
        download=${`${layer.key}.${layer.download.format || "csv"}`}>`;
      link.click();
    });
  }
  function blobJson(response) {
    const rows = response.map((record) => {
      const feature = {
        type: "Feature",
        properties: record
      };
      feature.geometry = JSON.parse(record.geometry);
      delete feature.properties.geometry;
      return feature;
    });
    const json = JSON.stringify({
      type: "FeatureCollection",
      features: rows
    });
    return new Blob([json], {type: "application/json"});
  }
  function blobCSV(response) {
    const rows = response.map((record) => {
      return Object.values(record).map((record2) => {
        return isNaN(record2) && `"${record2}"` || record2;
      }).join(",");
    });
    const csv = rows.join("\r\n");
    return new Blob([csv], {type: "text/csv;charset=utf-8;"});
  }
};
