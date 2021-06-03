export default params => new Promise((resolve, reject) => {

  if (!params) return reject()

  params = typeof params === 'string' ? { url: params } : params

  const xhr = new XMLHttpRequest()

  xhr.open(params.method || 'GET', params.url)

  xhr.setRequestHeader('Content-Type', params.content_type || 'application/json')

  xhr.responseType = params.responseType || 'json'

  xhr.onload = e => {

    if (e.target.status >= 300) return reject({ err: e.target.status })

    resolve(e.target.response)

  }

  xhr.send(params.body)

})