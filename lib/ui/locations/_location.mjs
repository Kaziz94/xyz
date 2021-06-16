import infoj from './infoj.mjs'

import streetview from './streetview.mjs'

import images from './images.mjs'

import documents from './documents.mjs'

import report from './report.mjs'

import boolean from './boolean.mjs'

import geometry from './geometry/_geometry.mjs'

import edit from './edit/_edit.mjs'

import dataview from './dataview.mjs'

import json from './json.mjs'

export default {

  view: view,

  listview: listview,

  infoj: infoj,

  // streetview: streetview(_xyz),

  // images: images(_xyz),

  // documents: documents(_xyz),

  geometry: geometry,

  // edit: edit(_xyz),

  // boolean: boolean(_xyz),

  // report: report(_xyz),

  dataview: dataview,

  // json: json(_xyz)

}

function view(location) {

  if (location.view) location.view.remove()

  // Create location view DOM element.
  location.view = mapp.utils.html.node `<div class="drawer location-view expandable expanded">`

  // Create the header element to contain the control elements.
  const header = location.view.appendChild(mapp.utils.html.node `
    <div
      class = "header"
      style = "${'border-bottom: 2px solid ' + location.style?.strokeColor || 'black'}"
      onclick = ${e => {
          e.preventDefault()
          mapp.ui.toggleExpanderParent(e.target, true)
      }}>
      <div>${String.fromCharCode(65 + 0)}`) //_xyz.locations.list.indexOf(location.record))}`)


  const colorFilter = `filter: invert(19%) sepia(57%) saturate(4245%) hue-rotate(247deg) brightness(76%) contrast(101%); -webkit-filter: invert(19%) sepia(57%) saturate(4245%) hue-rotate(247deg) brightness(76%) contrast(101%);`

  // Expander icon.
  //location.infoj && 
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${colorFilter}"
      title = ${mapp.dictionary.location_drawer_toggle}
        class = "btn-header xyz-icon icon-expander "
        onclick = ${e => {
          e.stopPropagation()
          mapp.ui.toggleExpanderParent(e.target)
        }}>`)


  // Zoom to location bounds.
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${colorFilter}"
      title = ${mapp.dictionary.location_zoom}
      class = "btn-header xyz-icon icon-search"
      onclick = ${e => {
        e.stopPropagation()
        location.flyTo()
      }}>`)


    // Update icon.
  const upload = header.appendChild(mapp.utils.html.node `
    <button
      style = "${colorFilter}"
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
      style = "${colorFilter}"
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
      style = "${colorFilter}"
      title = ${mapp.dictionary.location_delete}
      class = "btn-header xyz-icon icon-trash"
      onclick = ${e => {
        e.stopPropagation()
        location.trash()
      }}>`)


  // Toggle marker.
  header.appendChild(mapp.utils.html.node `
    <button
      style = "${colorFilter}"
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
      style = "${colorFilter}"
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

function listview(params) {

  const listview = {
    node: params.target,
    add: add
  }

  listview.node.addEventListener('passover', () => {

    setTimeout(() => {

      //Lambs blood painted door, I shall pass
      if (listview.node.children.length > 1) return

      const tab = listview.node.closest('.tab')
      tab.style.display = 'none'
      tab.previousElementSibling.click()

    }, 300)
  })

  return listview;

  function add(location) {

    // location.view = mapp.utils.html.node `<div>${location.hook}`

    // Object.values(listview.node.children).forEach(el => el.classList.remove('expanded'))
  
    // listview.node.insertBefore(location.view, listview.node.firstChild)
    
    listview.node.appendChild(location.view)
    listview.node.closest('.tab').style.display = 'block'
    listview.node.closest('.tab').click()
  }

}

  // mapview.locations.list = [
  //   ['#4227b0', 'invert(19%) sepia(57%) saturate(4245%) hue-rotate(247deg) brightness(76%) contrast(101%)'],
  //   ['#2196f3', 'invert(60%) sepia(94%) saturate(3876%) hue-rotate(184deg) brightness(98%) contrast(94%)'],
  //   ['#009688', 'invert(37%) sepia(46%) saturate(1993%) hue-rotate(144deg) brightness(96%) contrast(101%)'],
  //   ['#cddc39', 'invert(84%) sepia(82%) saturate(420%) hue-rotate(6deg) brightness(88%) contrast(94%)'],
  //   ['#ff9800', 'invert(59%) sepia(90%) saturate(1526%) hue-rotate(358deg) brightness(99%) contrast(106%)'],
  //   ['#673ab7', 'invert(23%) sepia(26%) saturate(6371%) hue-rotate(251deg) brightness(87%) contrast(87%)'],
  //   ['#03a9f4', 'invert(65%) sepia(61%) saturate(5963%) hue-rotate(168deg) brightness(101%) contrast(103%)'],
  //   ['#4caf50', 'invert(65%) sepia(8%) saturate(3683%) hue-rotate(73deg) brightness(92%) contrast(69%)'],
  //   ['#ffeb3b', 'invert(75%) sepia(76%) saturate(391%) hue-rotate(2deg) brightness(104%) contrast(109%)'],
  //   ['#ff5722', 'invert(47%) sepia(96%) saturate(3254%) hue-rotate(346deg) brightness(100%) contrast(102%)'],
  //   ['#0d47a1', 'invert(15%) sepia(99%) saturate(2827%) hue-rotate(213deg) brightness(87%) contrast(90%)'],
  //   ['#00bcd4', 'invert(60%) sepia(39%) saturate(2788%) hue-rotate(144deg) brightness(93%) contrast(102%)'],
  //   ['#8bc34a', 'invert(87%) sepia(8%) saturate(3064%) hue-rotate(35deg) brightness(85%) contrast(85%)'],
  //   ['#ffc107', 'invert(79%) sepia(86%) saturate(3969%) hue-rotate(346deg) brightness(98%) contrast(111%)'],
  //   ['#d32f2f', 'invert(28%) sepia(94%) saturate(3492%) hue-rotate(345deg) brightness(85%) contrast(92%)']
  // ].map(colorFilter => ({
  //   style: {
  //     strokeColor: colorFilter[0]
  //   },
  //   colorFilter: colorFilter[1]
  // }))