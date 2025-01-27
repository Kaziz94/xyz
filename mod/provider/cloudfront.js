const https = require('https')

const httpsAgent = new https.Agent({
	keepAlive: true,
  maxSockets: parseInt(process.env.CUSTOM_AGENT) || 1
})

const fetch = require('node-fetch')

const AWS = require("aws-sdk")

const { readFileSync } = require('fs')

const { join } = require('path')

const awsSigner = process.env.KEY_CLOUDFRONT && new AWS.CloudFront.Signer(
  process.env.KEY_CLOUDFRONT,
  String(readFileSync(join(__dirname, `../../${process.env.KEY_CLOUDFRONT}.pem`))))

module.exports = async ref => {

  try {

    const url = (ref.params?.url || ref).replace(/\{(.*?)\}/g,
      matched => process.env[`SRC_${matched.replace(/\{|\}/g, '')}`] || matched)
  
    const signedURL = awsSigner.getSignedUrl({
      url: `https://${url}`,
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    })
    
    // console.time(url)
  
    const response = await fetch(signedURL, {
      agent: process.env.CUSTOM_AGENT && httpsAgent
    })

    // console.timeEnd(url)
  
    if (response.status >= 300) return new Error(`${response.status} ${ref}`)

    if (url.match(/\.json$/i)) return await response.json()

    return await response.text()

  } catch(err) {
    console.error(err)
    return err
  }

}