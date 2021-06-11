export default {
  get: get,
  select: select,
}

async function get(location) {

  if (!location.mapview || !location.layer || !location.id) return;

  const response = await mapp.xhr(location.mapview.host + '/api/location/get?' + mapp.utils.paramString({
    locale: location.mapview.locale.key,
    layer: location.layer.key,
    table: location.table,
    id: location.id
  }))

  Object.assign(location, response)

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

  location.mapview.locations.listview?.add(location)

  return location
}