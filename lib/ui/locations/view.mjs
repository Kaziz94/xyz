export default location => {

  // if (location.view) location.view.remove()

  // Create location view DOM element.
  location.view = mapp.utils.html.node `<div class="drawer location-view expandable expanded">`

  // Create the header element to contain the control elements.
  const header = location.view.appendChild(mapp.utils.html.node `
    <div
      class = "header"
      style = "${'border-bottom: 2px solid ' + location.record.colour}"
      onclick = ${e => {
          e.preventDefault()
          mapp.ui.toggleExpanderParent(e.target, true)
      }}>
      <div>${location.record.symbol}`)

  // Expander icon.
  //location.infoj && 
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_drawer_toggle}
        class = "btn-header xyz-icon icon-expander "
        onclick = ${e => {
          e.stopPropagation()
          mapp.ui.toggleExpanderParent(e.target)
        }}>`)


  // Zoom to location bounds.
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_zoom}
      class = "btn-header xyz-icon icon-search"
      onclick = ${e => {
        e.stopPropagation()
        location.flyTo()
      }}>`)


    // Update icon.
  const upload = header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_save}
      class = "btn-header xyz-icon icon-cloud-upload"
      onclick = ${e => {
        e.stopPropagation()
        location.update()
      }}>`)


  // Edit geometry icon.
  //location.layer.edit && location.layer.edit.geometry && 
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_edit_geometry}
      class = "btn-header xyz-icon icon-build"
      onclick = ${e => {

        e.stopPropagation()

        if (header.classList.contains('edited')) return _xyz.mapview.interaction.edit.finish()

        header.classList.add('edited', 'secondary-colour-bg')

        _xyz.mapview.interaction.edit.begin({
          location: location,
          type: 'LineString',
          callback: () => {
            header.classList.remove('edited', 'secondary-colour-bg')
            }
        })

      }}>`)


  // Trash icon.
  //location.layer.edit && location.layer.edit.delete && 
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_delete}
      class = "btn-header xyz-icon icon-trash"
      onclick = ${e => {
        e.stopPropagation()
        location.trash()
      }}>`)


  // Toggle marker.
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_hide_marker}
      class = "btn-header xyz-icon icon-location-tick" 
      onclick = ${e => {
        e.stopPropagation()

        e.target.classList.toggle('icon-location')
        e.target.classList.toggle('icon-location-tick')
        e.target.classList.contains('icon-location') ?
          _xyz.map.removeLayer(location.Marker) :
          _xyz.map.addLayer(location.Marker)

      }}>`)


  // Clear selection.
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${'filter:'+location.record.filter}"
      title = ${mapp.dictionary.location_remove}
      class = "btn-header xyz-icon icon-close"
      onclick = ${e => {
        e.stopPropagation()
        location.remove()
        location.layer.mapview.Map.updateSize()
      }}>`)


  // Add listener for custom valChange event.
  location.view.addEventListener('valChange', e => {

    // Get value from newValue or input value.
    const newValue = typeof e.detail.newValue === 'undefined' && e.detail.input.value || e.detail.newValue
      
    if (e.detail.entry.value != newValue) {

      // New value is different from current value.
      e.detail.entry.newValue = newValue
      e.detail.input.classList.add('primary-colour')
    
    } else {

      // New value is the same as current value.
      delete e.detail.entry.newValue
      e.detail.input.classList.remove('primary-colour')
    }

    // Hide upload button if no other field in the infoj has a newValue.
    upload.style.display = e.detail.entry.location.infoj
      .some(field => typeof field.newValue !== 'undefined') && 'inline-block' || 'none'

  })

  if (!location.infoj) return

  let infoj

  location.view.addEventListener('updateInfo', updateInfo)

  updateInfo()

  function updateInfo(){

    infoj && infoj.remove()

    location.view.classList.remove('disabled')

    infoj = mapp.ui.locations.infoj(location)

    location.view.appendChild(infoj)

  }

}