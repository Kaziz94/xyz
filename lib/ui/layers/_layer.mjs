import style from './style/_styles.mjs'

import draw from './draw/_draw.mjs'
import { add } from 'lodash'

export default {
  view: view,
  listview: listview,
}


function view(layer) {

  layer.view = mapp.utils.html.node`<div class="drawer layer-view">`

  layer.mapview && layer.mapview.node.addEventListener('changeEnd', checkLayerZoom)

  function checkLayerZoom(){
    if (!layer.tables) return;
    if (layer.tableCurrent() === null) return layer.view.classList.add("disabled")
    layer.view.classList.remove("disabled")
  }

  const header = layer.view.appendChild(mapp.utils.html.node`
    <div class="header enabled"><span>${layer.name || layer.key}`)

  header.appendChild(mapp.utils.html.node`
    <button
      title=${mapp.dictionary.layer_zoom_to_extent}
      class="btn-header xyz-icon icon-fullscreen"
      onclick=${e=>{
        e.stopPropagation()
        layer.zoomToExtent()
      }}>`)
 
  const toggleDisplay = header.appendChild(mapp.utils.html.node`
    <button
      title=${mapp.dictionary.layer_visibility}
      class="${`btn-header xyz-icon icon-toggle ${layer.display && 'on' || 'off'}`}"
      onclick=${e=>{
        e.stopPropagation()
        layer.display ? layer.remove() : layer.show()
      }}>`)

  layer.view.addEventListener('display-on', () => {
    toggleDisplay.classList.add('on')
  })

  layer.view.addEventListener('display-off', () => {
    toggleDisplay.classList.remove('on')
  })

  // Append meta to layer view panel.
  if (layer.meta) {
    const meta = layer.view.appendChild(mapp.utils.html.node`<p class="meta">`)
    meta.innerHTML = layer.meta 
  }

  style(layer)

  draw(layer)

  // // Create & add Filter panel.
  // const filter_panel = view.filter.panel(layer)
  // filter_panel && layer.view.appendChild(filter_panel)

  // // Create & add Dataviews panel.
  // const data_panel = view.data.panel(layer)
  // data_panel && layer.view.appendChild(data_panel)
      
  // // Create & add Reports panel.
  // const report_panel = view.report.panel(layer)
  // report_panel && layer.view.appendChild(report_panel)

  // const download_panel = view.download.panel(layer);
  // download_panel && layer.view.appendChild(download_panel)

  // if (layer.plugins) {

  //   layer.plugins.forEach(plugin => _xyz.layers.plugins[plugin]
  //     && _xyz.layers.plugins[plugin](layer))
  // }

  if (layer.view.children.length <= 1) return

  // Make the layer view panel expandable if it contains children.
  layer.view.classList.add('expandable')

  // Expander control for layer drawer.
  header.onclick = e => {
    e.stopPropagation()
    mapp.ui.toggleExpanderParent(e.target, true)
  }

  // Add the expander toggle to the layer view header.
  header.appendChild(mapp.utils.html.node`
  <button
    title=${mapp.dictionary.layer_toggle_dashboard}
    class="btn-header xyz-icon icon-expander"
    onclick=${e=>{
      e.stopPropagation()
      mapp.ui.toggleExpanderParent(e.target)
    }}>`)

}

function listview(params){

  if (!params.mapview) return

  if (!params.target) return

  const listview = {
    node: params.target,
    groups: {}
  }

  params.mapview.layers.list = new Proxy(params.mapview.layers.list, {
    set: (target, key, location) => {
      view(location)
      add(location)
      return location
    }
  })


  // Loop through the layers and add to layers list.
  Object.values(params.mapview.layers.list).forEach(layer => add(layer))

  // Loop through the layers and add to layers list.
  function add(layer){

    if (layer.hidden) return

    // Create the layer view.
    view(layer)

    if (!layer.group) {
      listview.node.appendChild(layer.view)
      return
    }

    // Create new layer group if group does not exist yet.
    if (!listview.groups[layer.group]) createGroup(layer)

    // Add layer to group.
    listview.groups[layer.group].addLayer(layer)

  }

  function createGroup(layer) {

    // Create group object.
    const group = {
      list: []
    }
  
    // Assign layer group to listview object.
    listview.groups[layer.group] = group
  
    // Create layer group node and append to listview node.
    const drawer = listview.node.appendChild(mapp.utils.html.node `
      <div class="drawer layer-group expandable">`)
  
    // Create layer group header.
    const header = drawer.appendChild(mapp.utils.html.node `
      <div
        class="header enabled"
        onclick=${e=>{
          e.stopPropagation()
          mapp.ui.toggleExpanderParent(e.target, true)
        }}>
        <span>${layer.group}`)
  
    // Create layer group meta element.
    const meta = drawer.appendChild(mapp.utils.html.node `<div class="meta">`)
  
    // Check whether some layers group are visible and toggle visible button display accordingly.
    group.chkVisibleLayer = () => {
  
      group.list.some(layer => layer.display) ?
        hideLayers.classList.add('on') :
        hideLayers.classList.remove('on')
    }
  
    group.addLayer = layer => {
  
      if (layer.groupmeta) {
        const metaContent = meta.appendChild(mapp.utils.html.node `<div>`)
        metaContent.innerHTML = layer.groupmeta
      }
  
      group.list.push(layer)
  
      drawer.appendChild(layer.view)
  
      group.chkVisibleLayer()

      layer.view.addEventListener('display-on', group.chkVisibleLayer)
    
      layer.view.addEventListener('display-off', group.chkVisibleLayer)
    }
  
    // Create hide all group layers button.
    const hideLayers = header.appendChild(mapp.utils.html.node `
      <button
        class="btn-header xyz-icon icon-toggle"
        title=${mapp.dictionary.layer_group_hide_layers}
        onclick=${e=>{
          e.stopPropagation()
          e.target.classList.toggle('on')
          
          if (e.target.classList.contains('on')) {
            group.list
              .filter(layer => !layer.display)
              .forEach(layer => layer.show())
            return
          }
          
          group.list
            .filter(layer => layer.display)
            .forEach(layer => layer.remove())
  
        }}>`)
  
    // Create group expander button.
    header.appendChild(mapp.utils.html.node `
      <button
        class="xyz-icon btn-header icon-expander"
        title=${mapp.dictionary.layer_group_toggle}
        onclick=${ e => {
          e.stopPropagation()
          mapp.ui.toggleExpanderParent(e.target)
        }}>`)
  
  }

}