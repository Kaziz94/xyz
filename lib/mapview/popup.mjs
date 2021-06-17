export default function(params) {

  const mapview = this

  mapview._popup = {}

  mapview._popup.node && mapview._popup.node.remove()

  mapview._popup.node = mapp.utils.html.node `<div class="popup">`

  //this.node.addEventListener('mousemove', e => e.stopPropagation())

  mapview._popup.node.appendChild(params.content)

  mapview._popup.overlay && mapview.Map.removeOverlay(mapview._popup.overlay)

  mapview._popup.overlay = new ol.Overlay({
    element: mapview._popup.node,
    position: params.coords || mapview.position,
    positioning: 'bottom-center',
    autoPan: params.autoPan,
    insertFirst: true,
    autoPanAnimation: {
      duration: 250
    }
  })

  mapview.Map.addOverlay(mapview._popup.overlay)
}