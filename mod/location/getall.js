const dbs = require('../dbs')()

module.exports = async (req, res) => {

  const layer = req.params.layer

  const fields = layer.infoj
    .filter(entry => !req.params.fields || (req.params.fields && req.params.fields.split(',').includes(entry.field)))
    .filter(entry => !entry.query)
    .filter(entry => entry.type !== 'key')
    .filter(entry => entry.field)
    .map(entry => `(${entry.fieldfx || entry.field}) AS ${entry.field}`)

  !req.params.fields && fields.push(`ST_asGeoJson(${layer.geom}, 4) AS geomj`)

  var q = `
  SELECT
    ${fields.join()}
  FROM ${req.params.table}`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  if (req.params.fields) return res.send(rows)

  const location = {
  }

  for (let i = 0; i<rows.length; i++){
    delete rows[i].geomj
  }
  

  location.properties = rows

  // Send the infoj object with values back to the client.
  //res.send(location)
  res.send(location)

}