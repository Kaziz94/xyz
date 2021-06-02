export default _xyz => {

  const attribution = {

    create: create,

    check: check,

    links: mapp.utils.html.node`<div>`,

  }

  return attribution

  function create() {

    if (!_xyz.locale.attribution.target) return

    attribution.node = _xyz.locale.attribution.target

    _xyz.locale.attribution.target.appendChild(attribution.links)
  }

  function check() {

    const o = Object.assign({}, _xyz.locale.attribution && _xyz.locale.attribution.links || {})

    Object.values(_xyz.layers.list).forEach(layer => {
      layer.display && layer.attribution && Object.assign(
        o,
        layer.attribution)
    })

    mapp.utils.render(attribution.links, mapp.utils.html`
    ${Object.entries(o).map(entry => mapp.utils.html`
      <a target="_blank" href="${entry[1]}">${entry[0]}`)}`
    )

  }

}