export default function (params){

  const mapview = this

  const geoJSON = new ol.format.GeoJSON();

  const feature = geoJSON.readFeature({
    type: 'Feature',
    geometry: params.geometry
  },{ 
    dataProjection: 'EPSG:' + (params.dataProjection || mapview.srid),
    featureProjection:'EPSG:' + (params.featureProjection || mapview.srid)
  });

  const sourceVector = new ol.source.Vector({
    features: [feature]
  })
  
  const layerVector = new ol.layer.Vector({
    source: sourceVector,
    zIndex: isNaN(params.zIndex) ? 2000 : params.zIndex,
    //style: params.style
  })
  
  mapview.Map.addLayer(layerVector)
  
  return layerVector

}