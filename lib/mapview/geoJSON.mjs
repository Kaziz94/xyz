export default function (params){

  const mapview = params.mapview || this

  const geoJSON = new ol.format.GeoJSON();

  const feature = geoJSON.readFeature({
    type: 'Feature',
    geometry: params.geometry
  },{ 
    dataProjection: 'EPSG:' + (params.dataProjection || params.layer?.srid || mapview.srid),
    featureProjection:'EPSG:' + (params.featureProjection || mapview.srid)
  });

  const sourceVector = new ol.source.Vector({
    features: [feature]
  })
  
  const layerVector = new ol.layer.Vector({
    source: sourceVector,
    zIndex: params.zIndex || params.layer?.zIndex + 1,
    style: params.Style
  })
  
  mapview.Map.addLayer(layerVector)
  
  return layerVector

}