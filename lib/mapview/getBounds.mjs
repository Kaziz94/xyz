export default function(srid){

  const mapview = this

  const extent = mapview.Map.getView().calculateExtent();

  if (!srid) return {
    south: extent[1],
    west: extent[0],
    north: extent[3],
    east: extent[2],
  };

  const extent_transformed = ol.proj.transformExtent(
    extent,
    'EPSG:' + mapview.srid,
    'EPSG:' + srid);

  return {
    south: extent_transformed[1],
    west: extent_transformed[0],
    north: extent_transformed[3],
    east: extent_transformed[2],
  }

}