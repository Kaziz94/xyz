import style from './style/_styles.mjs'

import draw from './draw/_draw.mjs'

export default function (layer) {

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