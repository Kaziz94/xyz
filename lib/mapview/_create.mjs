export default (params = {}) => {

  if (!params.target) return

  if (!params.locale) return

  const locale = params.locale

  const mapview = {
    node: params.target,
    srid: locale.srid || '3857'
  }

  const z = mapp.hooks && mapp.hooks?.current?.z || locale.view?.z || locale.minZoom || 0

  const center = ol.proj.fromLonLat([
    parseFloat(mapp.hooks?.current?.lng || locale.view?.lng || 0),
    parseFloat(mapp.hooks?.current?.lat || locale.view?.lat || 0),
  ])

  const extent = locale.bounds && ol.proj.transformExtent(
    [
      parseFloat(locale.bounds.west || -180),
      parseFloat(locale.bounds.south || -90),
      parseFloat(locale.bounds.east || 180),
      parseFloat(locale.bounds.north || 90),
    ],
    `EPSG:4326`,
    `EPSG:${mapview.srid}`)

  const Map = new ol.Map({
    target: mapview.node,
    interactions: ol.interaction.defaults({ 
      mouseWheelZoom: locale.scrollWheelZoom || false,
      PinchRotate: {
        threshold: 3
      }
    }),
    controls: [],
    view: new ol.View({ 
      projection: `EPSG:${mapview.srid}`,
      zoom: z,
      minZoom: locale.minZoom,
      maxZoom: locale.maxZoom,
      center: center,
      extent: extent
    })
  })

  mapview.Map = Map

  // Set current mouse position/
  Map.on('pointermove', e => {
    mapview.position = e.coordinate
  })

  // // Set interaction break when map move starts.
  // Map.on('movestart', () => mapview.interaction.break = true)

  mapview.node.addEventListener('changeEnd', () => {

    // Object.values(_xyz.layers.list).forEach(layer => {

    //   // Check whether layer views should be disabled.
    //   if (layer.view && layer.tables) {
    //     layer.tableCurrent() === null ? layer.view.classList.add('disabled') : layer.view.classList.remove('disabled');
    //   }
    // })

    if (mapp.hooks) {

      // Set viewport hooks
      const center = ol.proj.transform(
        Map.getView().getCenter(),
        `EPSG:${mapview.srid}`,
        `EPSG:4326`)

      mapp.hooks.set({
        lat: center[1],
        lng: center[0],
        z: Map.getView().getZoom()
      })
    }

    // setTimeout(()=>delete mapview.interaction.break, 500)
  })
   
  //mapview.interaction.highlight.begin()

  // Add zoomControl.
  locale.zoomControl && Map.addControl(new ol.control.Zoom())

  // Create attribution in map DOM.
  //locale.attribution && _xyz.mapview.attribution.create()

  // Add scalebar.
  locale.showScaleBar && Map.addControl(new ol.control.ScaleLine({
    target: 'ol-scale',
    units: locale.showScaleBar.units ? locale.showScaleBar.units : 'metric'
  }))

  if(locale.maskBounds) {

    const world = [[180, 90], [180, -90], [-180, -90], [-180, 90], [180, 90]]

    const bounds = [
      [locale.bounds.east, locale.bounds.north],
      [locale.bounds.east, locale.bounds.south],
      [locale.bounds.west, locale.bounds.south],
      [locale.bounds.west, locale.bounds.north],
      [locale.bounds.east, locale.bounds.north],
    ]

    const maskFeature = new ol.Feature({
      geometry: new ol.geom
        .Polygon([world, bounds])
        .transform(`EPSG:4326`, `EPSG:${mapview.srid}`)
    })
  
    const maskLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [maskFeature]
      }),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: mapp.utils.chroma('#000').alpha(0.2).rgba()
        })
      }),
      zIndex: 999
    })


    Map.addLayer(maskLayer)
  }

  Map.on('moveend', viewChangeEndTimer)
  
  // Use timeout to prevent the viewChangeEvent to be executed multiple times.
  let timer
  function viewChangeEndTimer() {
    // clearTimeout(timer)

    // timer = setTimeout(()=>{
    //   mapview.node.dispatchEvent(mapview.changeEndEvent)
    // }, 500)
  }
  
  // Show visible layers.
  //Object.values(_xyz.layers.list).forEach(layer => layer.display && layer.show())


  return mapview

}