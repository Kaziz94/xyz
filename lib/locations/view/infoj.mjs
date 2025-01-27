export default _xyz => location => {

  if (!location.infoj || location.infoj.length < 1) return

  location.geometries = location.geometries.filter(geom => {
    _xyz.map.removeLayer(geom)
  })
    
  location.geometryCollection = location.geometryCollection.filter(geom => {
    _xyz.map.removeLayer(geom)
  })

  location.tabs.forEach(tab => tab.remove && tab.remove())

  const listview = _xyz.utils.html.node`<div class="location-view-grid">`

  // Create object to hold view groups.
  const groups = {}

  // Iterate through info fields and add to info table.
  for (const entry of location.infoj) {

    // The location view entries should not be processed if the view is disabled.
    if (location.view && location.view.classList.contains('disabled')) break

    // Location view elements will appended to the entry.listview element.
    entry.listview = listview

    // Assign the location object to the entry.
    entry.location = location

    // The default entry type is text.
    entry.type = entry.type || 'text'

    // Set inline for integer and numeric.
    entry.inline = entry.inline || entry.type === 'integer' || entry.type === 'numeric'

    // The default entry class should be an empty string.
    entry.class = `${entry.class || ''} ${entry.type} ${entry.inline && 'inline' || ''}`

    // Create a layer key element
    if(entry.type === 'key') {

      entry.listview.appendChild(_xyz.utils.html.node`
        <div
          class="${entry.class}">
          <span
            title=${_xyz.language.location_source_layer}
            style="${`background-color: ${_xyz.utils.Chroma(location.style.strokeColor || '#090').alpha(0.3)}`}"
            >${location.layer.name || location.layer.key}`);
    
      continue
    }


    // Assign displayValue from formatted value.
    entry.displayValue =
      entry.type === 'numeric' ? parseFloat(entry.value).toLocaleString('en-GB', { maximumFractionDigits: 2 }) :
        entry.type === 'integer' ? parseInt(entry.value).toLocaleString('en-GB', { maximumFractionDigits: 0 }) :
          entry.type === 'date' ? _xyz.utils.formatDate(entry.value) :
            entry.type === 'datetime' ? _xyz.utils.formatDateTime(entry.value) :
              entry.value

    // Add prefix or suffix to displayValue.
    entry.displayValue = `${entry.prefix || ''}${entry.displayValue}${entry.suffix || ''}`

    // Groups must be checked first since it should be possible to next any type of location view element in a group.
    if (entry.group) {

      // Create new group
      if (!groups[entry.group]) {

        groups[entry.group] = _xyz.utils.html.node`
        <div
          class="${`drawer group panel expandable ${entry.class || ''}`}"
          style="${entry.group_css || ''}">
          <div
            class="header primary-colour"
            onclick=${e => {
              _xyz.utils.toggleExpanderParent(e.target)
            }}>
            <span>${entry.group}</span>
            <span class="xyz-icon btn-header icon-expander primary-colour-filter">`

        entry.listview.appendChild(groups[entry.group])
      }

      // The expanded flag will define whether a group is expanded.
      entry.expanded && groups[entry.group].classList.add('expanded')

      // The group will replace the entry listview to which elements will be appended.
      entry.listview = groups[entry.group]
    }

    // Location plugins should be supersede any other element but groups.
    if (entry.plugin) {

      _xyz.locations.plugins[entry.plugin]
        && _xyz.locations.plugins[entry.plugin](entry)
      
      continue
    }


    // Continue if the entry is not editable and value is null.
    if (typeof entry.value !== 'undefined' && entry.value === null && !entry.edit) continue


    // Do not create title elements for entries which have query as the title is used otherwise here.
    if (entry.title && !entry.query && !entry.dataviews) {

      // Do not create the title element if the entry is not editable and has a falsy value.
      if (!entry.edit && typeof entry.value === 'undefined' && entry.type !== 'title') continue

      entry.listview.appendChild(_xyz.utils.html.node`
        <div
          class="${`label ${entry.class}`}"
          style="${`${entry.css_title || ''}`}"
          title="${entry.tooltip || null}">${entry.title}`)

      if (entry.type === 'title') continue
    }

    if (entry.type === 'dataview') {

      const dataview = _xyz.locations.view.dataview(entry);
      
      dataview && entry.listview.appendChild(dataview);
      
      continue
    }

    if (_xyz.locations.view[entry.type]) {
      _xyz.locations.view[entry.type](entry);
      continue
    }

    // Do not create val field if not editable and empty.
    if (!entry.query && !entry.edit && typeof entry.value === 'undefined') {
      continue
    }
    
    // Create new row and append to table.
    entry.val = entry.listview.appendChild(_xyz.utils.html.node`
      <div
        class="${`val ${entry.class}`}"
        style="${`${entry.css_val || ''}`}">`)

    if (entry.query) {

      entry.layer = entry.layer || entry.location.layer

      _xyz.query(entry).then(response => {
        if(!response) return
        entry.val.textContent = Object.values(response)[0]
      })
      
      continue
    }

    // Create controls for editable fields.
    if (entry.edit && !entry.fieldfx) {
      _xyz.locations.view.edit.input(entry)
      continue
    }

    // Html type values must be assigned with innerHtml instead of textContent.
    if (entry.type === 'html') {
      entry.val.innerHTML = entry.value
      continue
    }

    // Continue if displayValue is null.
    if (entry.displayValue == 'null') {
      entry.val.remove()
      continue
    }

    // Assign display value as textContent.
    entry.val.textContent = entry.displayValue

  }

  return listview

}