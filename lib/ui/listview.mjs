import layerview from './layerview'

export default params => {

  const listview = {
    node: params.target,
    groups: {}
  }

  // Loop through the layers and add to layers list.
  params.list.forEach(layer => {

    if (layer.hidden) return

    // Create the layer view.
    layerview(layer)

    if (!layer.group) {
      listview.node.appendChild(layer.view)
      return
    }

    // Create new layer group if group does not exist yet.
    if (!listview.groups[layer.group]) createGroup(layer)

    // Add layer to group.
    listview.groups[layer.group].addLayer(layer)

  })

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
        title=${mapp_dictionary.layer_group_hide_layers}
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
        title=${mapp_dictionary.layer_group_toggle}
        onclick=${ e => {
          e.stopPropagation()
          mapp.ui.toggleExpanderParent(e.target)
        }}>`)
  
  }

}