export default (_xyz) => (entry) => {
  if (!entry.report.template)
    return;
  const href = `${_xyz.host}/view?${mapp.utils.paramString(Object.assign(entry.report, {
    locale: _xyz.locale.key,
    layer: entry.location.layer.key,
    table: entry.location.table,
    id: entry.location.id,
    host: _xyz.host
  }))}`;
  entry.listview.appendChild(mapp.utils.html.node`
    <div
      class="${`label ${entry.class}`}">
      <a
        class="primary-colour"
        target="_blank"
        href="${href}">
          ${entry.report.title || entry.report.name || "Location Report"}`);
};
