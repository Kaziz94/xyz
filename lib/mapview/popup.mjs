export default mapview => {

  const popup = {
    set: set,
    remove: remove
  }

  mapview.popup = popup

  function set(params){

    remove()

    popup.node = mapp.utils.html.node `<div class="popup">`
  
    popup.node.addEventListener('mousemove', e => e.stopPropagation())
  
    popup.node.appendChild(params.content)
  
    popup.overlay && mapview.Map.removeOverlay(popup.overlay)
  
    popup.overlay = new ol.Overlay({
      element: popup.node,
      position: params.coords || mapview.position,
      positioning: 'bottom-center',
      autoPan: params.autoPan,
      insertFirst: true,
      autoPanAnimation: {
        duration: 250
      }
    })
  
    mapview.Map.addOverlay(popup.overlay)

  }

  function remove() {

    popup.node && popup.node.remove()

  }

}