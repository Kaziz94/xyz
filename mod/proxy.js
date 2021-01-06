const https = require('https')

module.exports = (req, res) => {

  let url = req.url.match(/\?.*/)

  if (!url[0]) return

  url = decodeURIComponent(url[0].substring(1))

  // Find variables to be substituted.
  url = url.replace(/\{(.*?)\}/g,

    // Substitute matched variable with key value from process environment.
    matched => process.env[`KEY_${matched.replace(/\{|\}/g, '')}`] || matched)

  const proxy = https.request(url, _res => {
    res.writeHead(_res.statusCode, _res.headers)
    _res.pipe(res, {
      end: true
    })
  })

  req.pipe(proxy, {
    end: true
  })
  
}