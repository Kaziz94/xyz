const fetch = require('node-fetch')

module.exports = {

  github: async params => await github(params),

  here: async params => await here(params),

  mapbox: async params => await mapbox(params),

  opencage: async params => await opencage(params),

  google: async params => await google(params),

}

async function github(url) {

  const response = await fetch(`https://${url.replace(/https:/,'').replace(/\/\//,'')}`, {headers: new fetch.Headers({Authorization:`token ${process.env.KEY_GITHUB}`})})

  const b64 = await response.json()

  const buff = await Buffer.from(b64.content, 'base64')

  return await buff.toString('utf8')
}

async function here(url) {

  const response = await fetch(`https://${url}&${process.env.KEY_HERE}`)

  return await response.json()
}

async function mapbox(url) {

  const response = await fetch(`https://${url}&${process.env.KEY_MAPBOX}`.replace(/\&provider=mapbox/,''))

  return await response.json()
}

async function opencage(url) {

  const response = await fetch(`https://${url}&key=${process.env.KEY_OPENCAGE}`)

  return await response.json()
}

async function google(url) {

  const response = await fetch(`https://${url}&${process.env.KEY_GOOGLE}`)

  return await response.json()
}