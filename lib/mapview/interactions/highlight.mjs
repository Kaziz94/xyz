export default function(){

  const mapview = this

  const interaction = {
    featureSet: new Set()
  }

  mapview.Map.on('pointermove', pointerMove)

  mapview.node.addEventListener('mouseout', mouseOut)

  mapview.Map.on('singleclick', singleClick)

  mapview.node.style.cursor = 'auto'

  function pointerMove(e) {

    mapview.pointerLocation = {
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY
    }

    clearTimeout(interaction.timeout)

    interaction.timeout = setTimeout(()=>{

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

        if (!candidate) {
          interaction.layer?.highlight && clear()
          return 
        }
  
        if (interaction.layer === candidate.featureLayer.get('layer')
          && interaction.layer.highlight === candidate.feature.get('id')) return;
  
        if (interaction.layer !==  candidate.featureLayer.get('layer')) clear()
   
        interaction.feature = candidate.feature
        interaction.layer = candidate.featureLayer.get('layer')
        interaction.layer.highlight = candidate.feature.get('id')
  
        // Redraw layer to style highlight.
        e.originalEvent.pointerType !== 'touch' && interaction.layer.L.changed()

    },100)

  }

  function mouseOut() {
    mapview.pointerLocation = {
      x: null,
      y: null
    }
    clear()
  }

  function clear() {

    // if (_xyz.mapview.infotip.node) _xyz.mapview.infotip.node.remove()

    if (!interaction.layer) return

    delete interaction.feature
    delete interaction.layer.highlight

    mapview.node.style.cursor = 'auto'

    interaction.layer.L.changed()
  }

  async function singleClick(e) {

    // if (highlight.longClick) {
    //   delete highlight.longClick
    //   _xyz.mapview.node.style.cursor = 'auto'
    //   return drillDown(e)
    // }
    // clearTimeout(highlight.timeout)

    if (e.originalEvent.pointerType === 'touch') pointerMove(e)

    // if (mapview.popup.overlay) mapview.Map.removeOverlay(mapview.popup.overlay)

    if (!interaction.feature) return

    const pixel = e.pixel

    const properties = interaction.feature.get('properties')

    if (properties?.count) return mapview.locations.nnearest({
      layer: interaction.layer,
      table: interaction.layer.table || interaction.layer.tableCurrent(),
      feature: interaction.feature
    })

    mapview.locations.select({
      layer: interaction.layer,
      table: interaction.layer.table || interaction.layer.tableCurrent(),
      id: interaction.layer.highlight
    })
  }

}