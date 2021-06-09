export default mapview => {

  const interaction = {
    featureSet: new Set()
  }

  mapview.Map.on('pointermove', pointerMove)

  mapview.node.addEventListener('mouseout', mouseOut)

  mapview.node.style.cursor = 'auto'

  function pointerMove(e) {

    mapview.pointerLocation = {
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY
    }

    const _featureSet = new Set()

    // Iterate through all features (with layer) at pixel
    mapview.Map.forEachFeatureAtPixel(e.pixel,
      (feature, featureLayer) => {

        // Add feature to current set.
        _featureSet.add(feature)

        if (interaction.featureSet.has(feature)) return

        interaction.feature = feature
        interaction.layer = featureLayer.get('layer')
        interaction.layer.highlight = feature.get('id')

        // Redraw layer to style highlight.
        if (e.originalEvent.pointerType !== 'touch') {

          // interaction.layer.features
          //   .filter(f => f.get('id') === interaction.layer.highlight)
          //   .forEach(f => f.setStyle(new ol.style.Style({
          //     stroke: new ol.style.Stroke({
          //       color: '#ff00f7'
          //     })})))

          //console.log(found)

          interaction.layer.L.setStyle(
            interaction.layer.L.getStyle()
          )

        }

      },
      {
        layerFilter: featureLayer => {

          // Filter for layers which have a highlight style.
          return Object.values(mapview.layers).some(layer => {
            return layer.qID && layer.style?.highlight && layer.L === featureLayer
          })
        },
        hitTolerance: 5,
      })

      interaction.featureSet = _featureSet

          // Clear if current set is empty or highlighted feature is not in current set.
      if (!_featureSet.size || !_featureSet.has(interaction.feature)) clear()

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

    interaction.featureSet = new Set()

    interaction.layer.highlight = true

    mapview.node.style.cursor = 'auto'

    interaction.layer.L.setStyle(interaction.layer.L.getStyle())

    //delete interaction.layer.clearHighlight
    delete interaction.layer
    delete interaction.feature
    
  }

}