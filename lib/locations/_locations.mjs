export default {
  get: get,
  select: select,
  nnearest: nnearest,
}

async function get(location) {

  if (!location.mapview || !location.layer || !location.id) return;

  const response = await mapp.utils.xhr(location.mapview.host + '/api/location/get?' + mapp.utils.paramString({
    locale: location.mapview.locale.key,
    layer: location.layer.key,
    table: location.table,
    id: location.id
  }))


  const infoj = location.layer.infoj.map(_entry => {

    const entry = mapp.utils.lodash.cloneDeep(_entry)
    entry.title = response.properties[entry.field + '_label'] || entry.title
    entry.value = response.properties[entry.field]

    return entry
  })

  Object.assign(location, response, {infoj: infoj})

  location.remove = remove

  return location
}

function remove() {
  const location = this
  location.view?.remove()
}

async function select(location) {

  if (!location.mapview) return;

  // Create a location hook.
  location.hook = `${location.layer.key}!${location.table}!${location.id}`

  if (location.mapview.locations.list[location.hook]) {
    return location.mapview.locations.list[location.hook].remove()
  }

  location.mapview.locations.list[location.hook] = location

  await get(location)

  mapp.ui.locations.view(location)

  location.mapview.locations.listview?.add(location)

  return location
}

async function nnearest(params) {

  let
    count = params.feature.get('properties').count,
    geom = params.feature.getGeometry(),
    _coords = geom.getCoordinates(),
    coords = ol.proj.transform(
      _coords,
      'EPSG:' + params.mapview.srid,
      'EPSG:' + params.layer.srid)

  const response = await mapp.utils.xhr(params.mapview.host + '/api/query/get_nnearest?' + mapp.utils.paramString({
    locale: params.mapview.locale.key,
    layer: params.layer.key,
    geom: params.layer.geom,
    qID: params.layer.qID,
    cluster_label: params.layer.cluster_label || params.layer.qID,
    table: params.table,
    //filter: layer.filter && layer.filter.current,
    n: count > 99 ? 99 : count,
    x: coords[0],
    y: coords[1],
    coords: coords
  }))

  if (response.length > 1) {

    const list = mapp.utils.html.node`
      <div style="
        width: 400px;
        max-width: 75vw;
        max-height: 300px;
        overflow-x: hidden;">
      <ul>
      ${response.map(
        li => mapp.utils.html.node`
        <li
          style="padding: 5px 0 5px 10px; white-space: nowrap; line-height: 1.5;"
          class="secondary-colour-hover"
          onclick=${e => {
            e.preventDefault()
            select({
              mapview: params.mapview,
              layer: params.layer,
              table: params.table,
              id: li.id,
              marker: li.coords,
            })
          }}>${li.label || '"' + params.layer.cluster_label + '"'}`)}`;


    params.mapview.popup({
      coords: ol.proj.transform(
        coords,
        'EPSG:' + params.layer.srid,
        'EPSG:' + params.mapview.srid),
      content: list,
      autoPan: true
    })

    return;

  }

    // return _xyz.locations.select({
    //   locale: _xyz.locale.key,
    //   layer: layer,
    //   table: layer.tableCurrent(),
    //   id: cluster.id,
    // });

}