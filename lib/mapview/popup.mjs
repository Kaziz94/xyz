const popup = {}

export default function(params) {

  const mapview = this

  popup.node && popup.node.remove()

  popup.node = mapp.utils.html.node `<div class="popup">`

  //this.node.addEventListener('mousemove', e => e.stopPropagation())

  popup.node.appendChild(params.content)

  popup.overlay && _xyz.map.removeOverlay(this.overlay)

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