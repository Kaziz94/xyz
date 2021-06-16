export default {
  get: get,
  select: select,
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