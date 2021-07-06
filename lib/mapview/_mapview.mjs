import locate from './locate.mjs';

import geoJSON from './geoJSON.mjs';

import popup from './popup.mjs';

import getBounds from './getBounds.mjs';

import infotip from './infotip.mjs';

import drawInteraction from './interactions/draw.mjs'

import highlightInteraction from './interactions/highlight.mjs'

import zoomInteraction from './interactions/zoom.mjs'

export default (params = {}) => {

  if (!params.target) return

  if (!params.locale) return

  const locale = params.locale

  const mapview = {
    host: params.host || '',
    node: params.target,
    hooks: params.hooks,
    srid: locale.srid || '3857',
    locale: params.locale,
    getZoom: getZoom,
    getBounds: getBounds,
    geoJSON: geoJSON,
    flyToBounds: flyToBounds,
  }

  popup(mapview)

  infotip(mapview)

  mapview.locations = {
    list: {},
    get: mapp.location.get.bind(mapview),
    select: mapp.location.select.bind(mapview),
    nnearest: mapp.location.nnearest.bind(mapview)
  }

  mapview.layers = {
    list: {},
    add: mapp.layer.add.bind(mapview),
    get: mapp.layer.get.bind(mapview),
    decorate: mapp.layer.decorate.bind(mapview),
  }

  mapview.interactions = {
    highlight: highlightInteraction.bind(mapview),
    draw: drawInteraction.bind(mapview),
    zoom: zoomInteraction.bind(mapview),
  }

  const z = mapp.hooks?.current?.z || locale.view?.z || locale.minZoom || 0

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

  Map.on('pointermove', e => {
    mapview.position = e.coordinate
    mapview.pointerLocation = {
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY
    }
  })

  mapview.node.addEventListener('mouseout', ()=>{
    mapview.position = null
    mapview.pointerLocation = {
      x: null,
      y: null
    }
  })

  // // Set interaction break when map move starts.
  // Map.on('movestart', () => mapview.interaction.break = true)

  mapview.node.addEventListener('changeEnd', () => {

    if (mapview.hooks) {

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

  // Add zoomControl.
  locale.zoomControl && Map.addControl(new ol.control.Zoom())

  if (params.attribution?.target) {

    mapview.attribution = {
      target: params.attribution.target,
      links: mapp.utils.html.node`<div>`,
      check: () => {

        const o = Object.assign({}, params.attribution.links || {})

        Object.values(mapview.layers).forEach(layer => {
          layer.display && layer.attribution && Object.assign(
            o,
            layer.attribution)
        })
    
        mapp.utils.render(mapview.attribution.links, mapp.utils.html`
        ${Object.entries(o).map(entry => mapp.utils.html`
          <a target="_blank" href="${entry[1]}">${entry[0]}`)}`
        )

      }
    }

    mapview.attribution.target.appendChild(mapview.attribution.links)

    mapview.attribution.check()
  }


  // Add scalebar.
  locale.showScaleBar && Map.addControl(new ol.control.ScaleLine({
    target: 'ol-scale',
    units: locale.showScaleBar.units ? locale.showScaleBar.units : 'metric'
  }))

  if(locale.maskBounds) {

    const world = [
      [180, 90],
      [180, -90],
      [-180, -90],
      [-180, 90],
      [180, 90],
    ]

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
    clearTimeout(timer)

    timer = setTimeout(()=>{
      mapview.node.dispatchEvent(new CustomEvent('changeEnd'))
    }, 500)
  }
  
  return mapview
}

function flyToBounds (extent, params = {}) {
  this.Map.getView().fit(
    extent,
    Object.assign(
      {
        padding: [50, 50, 50, 50],
        duration: 1000
      },
      params)
  )
}

function getZoom() {
  return this.Map.getView().getZoom()
}