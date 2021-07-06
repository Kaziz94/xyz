export default function(){

  const mapview = this

  mapview.interaction?.finish()

  mapview.interaction = {
    finish: finish
  }

  function finish() {
    mapview.Map.un('pointermove', pointerMove)
    mapview.Map.un('singleclick', singleClick)
    mapview.node.removeEventListener('mouseout', clear)
  }

  const interaction = {
    featureSet: new Set()
  }

  mapview.Map.on('pointermove', pointerMove)

  mapview.node.addEventListener('mouseout', clear)

  mapview.Map.on('singleclick', singleClick)

  mapview.node.style.cursor = 'auto'

  function pointerMove(e) {

    clearTimeout(interaction.timeout)

    // Iterate through all features (with layer) at pixel
    const candidate = mapview.Map.forEachFeatureAtPixel(e.pixel,
      (feature, featureLayer) => ({
        feature: feature,
        featureLayer: featureLayer
      }),
      {
        layerFilter: featureLayer => {
  
          // Filter for layers which have a highlight style.
          return Object.values(mapview.layers.list).some(layer => {
            return layer.display && layer.qID && layer.style?.highlight && layer.L === featureLayer
          })
        },
        hitTolerance: 5,
      })

    if (!candidate) return clear()

    if (!mapview.position) return;
  
    if (interaction.layer === candidate.featureLayer.get('layer')
      && interaction.layer.highlight === candidate.feature.get('id')) return;
  
    if (interaction.layer !==  candidate.featureLayer.get('layer')) clear()

    interaction.timeout = setTimeout(()=>{
   
      interaction.feature = candidate.feature
      interaction.layer = candidate.featureLayer.get('layer')
      interaction.layer.highlight = candidate.feature.get('id')

      interaction.layer.hover && interaction.layer.hover()
  
      // Redraw layer to style highlight.
      e.originalEvent.pointerType !== 'touch' && interaction.layer.L.changed()

    },100)

  }

  function clear() {

    mapview.infotip.remove()

    if (!interaction.layer) return

    delete interaction.feature
    delete interaction.layer.highlight

    mapview.node.style.cursor = 'auto'

    interaction.layer.L.changed()

    delete interaction.layer
  }

  async function singleClick(e) {

    if (e.originalEvent.pointerType === 'touch') pointerMove(e)

    mapview.popup.node && mapview.popup.remove()

    if (!interaction.feature) return

    const properties = interaction.feature.get('properties')

    if (properties?.count) return mapview.locations.nnearest({
      layer: interaction.layer,
      table: interaction.layer.table || interaction.layer.tableCurrent(),
      feature: interaction.feature
    })

    mapview.locations.select({
      marker: mapview.Map.getCoordinateFromPixel(e.pixel),
      layer: interaction.layer,
      table: interaction.layer.table || interaction.layer.tableCurrent(),
      id: interaction.layer.highlight
    })
  }

}