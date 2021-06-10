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


    //if (feature.getGeometry(intersectsCoordinate))

    const _featureSet = new Set()


    // const featureLayers = Object.values(mapview.layers).filter(
    //   layer => layer.display && layer.qID && layer.style?.highlight && layer.L
    // )

    // console.log(featureLayers)

    // const test = featureLayers.map(l => l.L.getFeatures(e.pixel))

    // console.log(test)



    // Iterate through all features (with layer) at pixel
    mapview.Map.forEachFeatureAtPixel(e.pixel,
      (feature, featureLayer) => {

        // Add feature to current set.
        _featureSet.add({
          feature: feature,
          featureLayer: featureLayer
        })

        // if (interaction.featureSet.has(feature)) return

        // interaction.feature = feature
        // interaction.layer = featureLayer.get('layer')
        // interaction.layer.highlight = feature.get('id')

        // // Redraw layer to style highlight.
        // if (e.originalEvent.pointerType !== 'touch') {

        //   interaction.layer.L.setStyle(
        //     interaction.layer.L.getStyle()
        //   )

        // }

      },
      {
        layerFilter: featureLayer => {

          // Filter for layers which have a highlight style.
          return Object.values(mapview.layers).some(layer => {
            return layer.display && layer.qID && layer.style?.highlight && layer.L === featureLayer
          })
        },
        hitTolerance: 5,
      })

      if (!_featureSet.size) return clear()

      if (interaction.feature && _featureSet.has(interaction.feature)) return;

      const features = _featureSet.values()

      console.log(features)

      const feature = features.next().value

      interaction.feature = feature
      interaction.layer = feature.featureLayer.get('layer')
      interaction.layer.highlight = feature.feature.get('id')

        // Redraw layer to style highlight.
        if (e.originalEvent.pointerType !== 'touch') {

          interaction.layer.L.setStyle(
            interaction.layer.L.getStyle()
          )
        }







      // Clear if current set is empty or highlighted feature is not in current set.
      // if (!_featureSet.size || !_featureSet.has(interaction.feature)) clear()

      // console.log(_featureSet)

      // interaction.featureSet = _featureSet



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

    interaction.featureSet.clear()

    //interaction.layer.highlight = true
    delete interaction.layer.highlight

    mapview.node.style.cursor = 'auto'

    interaction.layer.L.setStyle(interaction.layer.L.getStyle())

    //delete interaction.layer.clearHighlight
    delete interaction.layer
    delete interaction.feature
    
  }

  function singleClick(e) {

    // if (highlight.longClick) {
    //   delete highlight.longClick
    //   _xyz.mapview.node.style.cursor = 'auto'
    //   return drillDown(e)
    // }
    // clearTimeout(highlight.timeout)

    if (e.originalEvent.pointerType === 'touch') pointerMove(e)

    // if (mapview.popup.overlay) mapview.Map.removeOverlay(mapview.popup.overlay)

    if (!interaction.layer) return

    if (!interaction.feature) return  

    const pixel = e.pixel

    interaction.layer.select(interaction.feature, pixel)
  }

}