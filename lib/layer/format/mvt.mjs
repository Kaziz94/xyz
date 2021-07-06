export default layer => {

  layer.reload = () => {

    //source.clear()
    source.refresh()
  }

  let
    logging = false,
    lastPerformance = performance.now()

  // console.time(layer.key)

  function Log(msg) {
    if(!logging) return
    const perf = performance.now()
    console.log(`${perf - lastPerformance} | ${msg}`)
    lastPerformance = perf

    // console.timeLog(layer.key)
    // console.log(msg)
  }

  
  // Define source for mvt layer.
  const source = new ol.source.VectorTile({
    format: new ol.format.MVT({
      //featureClass: ol.Feature
    }),
    transition: 0,
    cacheSize: 0,
    tileUrlFunction: tileCoord => {

      Log(`tileUrlFunction - ${layer.key}:${tileCoord[0]}/${tileCoord[1]}/${tileCoord[2]}`)

      const tableZ = layer.tableCurrent()

      if (!tableZ) return source.clear()

      const url = `${layer.mapview.host}/api/layer/mvt/${tileCoord[0]}/${tileCoord[1]}/${tileCoord[2]}?` + mapp.utils.paramString({
        locale: layer.mapview.locale.key,
        layer: layer.key,
        srid: layer.mapview.srid,
        table: tableZ,
        filter: layer.filter && layer.filter.current
      })

      return url
      
    }
  })

  layer.L = new ol.layer.VectorTile({
    source: source,
    renderBuffer: 200,
    //declutter: false,
    //renderMode: 'vector',
    zIndex: layer.style.zIndex || 1,
    //style: null
  })

  layer.L.set('layer', layer, true)

  layer.mapview.Map.on('movestart', e => {
    if (!layer.display) return

    Log('movestart')

    layer.mapview.Map.removeLayer(layer.L)
    source.clear()
  })


  let timeout

  layer.mapview.Map.on('moveend', e => {

    if (!layer.display) return

    if (!layer.tableCurrent()) return

    Log("moveend")

    layer.L.setStyle(null)
    layer.mapview.Map.addLayer(layer.L)

    timeout = setTimeout(()=>{

      layer.L.setStyle(styleFn)

    },400)
  })

  const myTileSet = new Set()

  source.on('tileloaderror', e => {

    console.log(e)

  })

  source.on('tileloadstart', e => {

    timeout && clearTimeout(timeout)

    const tileCoord = e.tile.tileCoord.join('-')

    Log(tileCoord)

    myTileSet.add(tileCoord)
  })

  // layer.features = []

  source.on('tileloadend', e => {

    // const features = e.tile.getFeatures()

    // layer.features = layer.features.concat(features)

    const tileCoord = e.tile.tileCoord.join('-')

    Log(`tileloadend - ${tileCoord}`)

    myTileSet.delete(tileCoord)

    if (myTileSet.size === 0) tilesloaded()
  })

  function tilesloaded() {

    Log('tilesloaded')

    if (layer.style.theme && layer.style.theme.dynamic) {

      const view = layer.mapview.Map.getView()
      const extent = view.calculateExtent()
      const features = source.getFeaturesInExtent(extent)

      Log(`${features.length || 0} Features loaded`)

      if (!features.length) return

      setSeries(layer.style.theme)

      function setSeries(theme) {

        const field = features.map(f => f.get(theme.field))

        const series = new geostats(field)
  
        const quantiles = series.getQuantile(theme.cat_arr.length)
  
        theme.cat_arr.forEach((c, i) => {
  
          c.value = quantiles[i]
  
        })

        theme.theme && setSeries(theme.theme)

      }

    }

    layer.L.setStyle(styleFn)
  
  }


  const memoizedStyles = new Map()

  const featureMap = new Map()

  function styleFn(feature) {

    const fid = feature.get('id')

    //Log(feature)

    // if (layer.highlight && layer.highlight !== fid) return

    if (layer.highlight !== fid && featureMap.has(fid)) return featureMap.get(feature)


    const style = Object.assign(
      {},
      layer.style.default,
    )


    layer.style.theme && layer.style.theme.type && themeStyle(layer.style.theme)

    function themeStyle(theme) {

      // Categorized theme.
      if (theme && theme.type === 'categorized') {

        const field = feature.get(theme.field);

        field && mapp.utils.lodash.merge(
          style,
          (theme.cat[field] && theme.cat[field].style) || theme.cat[field])
        
      }

      // Graduated theme.
      if (theme && theme.type === 'graduated') {
  
        const value = parseFloat(feature.get(theme.field));

        if (value || value === 0) {

          // Iterate through cat array.
          for (let i = 0; i < theme.cat_arr.length; i++) {

          // Break iteration is cat value is below current cat array value.
            if (value < theme.cat_arr[i].value) break;

            // Set cat_style to current cat style after value check.
            var cat_style = theme.cat_arr[i].style || theme.cat_arr[i];
          }

          // Assign style from base & cat_style.
          mapp.utils.lodash.merge(style, cat_style)
        }
    
      }

      theme.theme && themeStyle(theme.theme)

    }

    // Assign highlight style.
    Object.assign(
      style,
      layer.highlight === fid ? layer.style.highlight : {},
      layer.highlight === fid ? {zIndex : 30} : {zIndex : 10},
    )

    // delete layer.highlight

    // Check whether style is memoized.
    const styleStr = JSON.stringify(style)

    if (memoizedStyles.has(styleStr)) return memoizedStyles.get(styleStr)

    const olStyle = new ol.style.Style({
      zIndex: layer.zIndex || style.zIndex,
      stroke: style.strokeColor && new ol.style.Stroke({
        color: mapp.utils.chroma(style.strokeColor).alpha(style.strokeOpacity === undefined ? 1 : parseFloat(style.strokeOpacity) || 0).rgba(),
        width: parseFloat(style.strokeWidth) || 1
      }),
      fill: style.fillColor && new ol.style.Fill({
        color: mapp.utils.chroma(style.fillColor).alpha(style.fillOpacity === undefined ? 1 : parseFloat(style.fillOpacity) || 0).rgba()
      }),
      image: style.marker && mapp.utils.icon(style.marker)
    })

    memoizedStyles.set(styleStr, olStyle)

    layer.highlight !== fid && featureMap.set(fid, olStyle)

    return olStyle
  }

  // layer.label = _xyz.mapview.layer.mvtLabel(layer)

}

// style = [...array].reverse().find(element => test > element.value) || array[0]