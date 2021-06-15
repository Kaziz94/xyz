window.onload = async () => {

  if ('scrollRestoration' in history) history.scrollRestoration = 'auto'

  // Set Openlayers node in order to move map object.
  const OL = document.getElementById('OL')

  // Move map up on document scroll
  document.addEventListener('scroll', () => {
    OL.style['marginTop'] = `-${parseInt(window.pageYOffset / 2)}px`
  })

  // Set vertDivider fo vertical resize of body grid.
  const vertDivider = document.getElementById('spacer')

  vertDivider.addEventListener('mousedown', e => {
    e.preventDefault()
    document.body.style.cursor = 'grabbing'
    window.addEventListener('mousemove', resize_x)
    window.addEventListener('mouseup', stopResize_x)
  })
  
  vertDivider.addEventListener('touchstart', e => {
    e.preventDefault()
    window.addEventListener('touchmove', resize_x)
    window.addEventListener('touchend', stopResize_x)
  }, {
    passive: true
  })
  
  // Vertical resize event
  function resize_x(e) {
    let pageX = (e.touches && e.touches[0].pageX) || e.pageX

    if (pageX < 333) return

    // Half width snap.
    if (pageX > (window.innerWidth / 2)) pageX = window.innerWidth / 2

    document.body.style.gridTemplateColumns = `${pageX}px 10px 50px auto`
  }
  
  // Remove vertical resize events.
  function stopResize_x() {
    document.body.style.cursor = 'auto'
    window.removeEventListener('mousemove', resize_x)
    window.removeEventListener('touchmove', resize_x)
    window.removeEventListener('mouseup', stopResize_x)
    window.removeEventListener('touchend', stopResize_x)
  }

  // Set hoxDivider for horizontal resize of body grid.
  const hozDivider = document.getElementById('hozDivider')

  // Resize tabview while holding mousedown on hozDivider.
  hozDivider.addEventListener('mousedown', () => {
    document.body.style.cursor = 'grabbing'
    window.addEventListener('mousemove', resize_y)
    window.addEventListener('mouseup', stopResize_y)
  }, true)

  // Resize dataview while touching hozDivider.
  hozDivider.addEventListener('touchstart', e => {
    e.preventDefault()
    window.addEventListener('touchmove', resize_y)
    window.addEventListener('touchend', stopResize_y)
  }, {
    passive: true
  })

  // Resize the dataview container.
  function resize_y(e) {
    e.preventDefault()

    let pageY = (e.touches && e.touches[0].pageY) || e.pageY

    if (pageY < 0) return

    let height = window.innerHeight - pageY

    // Min height snap.
    if (height < 65) height = 50

    // Full height snap.
    if (height > (window.innerHeight - 10)) height = window.innerHeight

    document.body.style.gridTemplateRows = `auto 10px ${height}px`

    OL.style.marginTop = `-${(height/2)}px`
  }

  // Remove horizontal resize events.
  function stopResize_y() {
    document.body.style.cursor = 'auto';
    window.removeEventListener('mousemove', resize_y);
    window.removeEventListener('touchmove', resize_y);
    window.removeEventListener('mouseup', stopResize_y);
    window.removeEventListener('touchend', stopResize_y);
  }

  // Tab event for mobile view.
  const tabs = document.querySelectorAll('.tab')
  const locationsTab = document.getElementById('locations')
  const layersTab = document.getElementById('layers')

  tabs.forEach(tab => {

    tab.querySelector('.listview').addEventListener('scroll', e => {
      if (e.target.scrollTop > 0) return e.target.classList.add('shadow')
      e.target.classList.remove('shadow')
    })

    tab.onclick = e => {
      if (!e.target.classList.contains('tab')) return
      e.preventDefault()
      tabs.forEach(el => el.classList.remove('active'))
      e.target.classList.add('active')
    }

  })

  const btnColumn = document.getElementById('mapButton')

  document.getElementById('layers_header').textContent = mapp.dictionary.layers_header
  document.getElementById('locations_header').textContent = mapp.dictionary.locations_header

  const host = document.head.dataset.dir || new String('')

  const locales = await mapp.utils.xhr(`${host}/api/workspace/get/locales`)

  if (!locales.length) return alert('No accessible locales')

  const locale = await mapp.utils.xhr(`${host}/api/workspace/get/locale?locale=${mapp.hooks.current.locale || locales[0].key}`)

  locales.length > 1 && layersTab.appendChild(mapp.utils.html.node`
  <div>${mapp.dictionary.show_layers_for_locale}</div>
  <button class="btn-drop">
    <div class="head"
      onclick=${e => {
        e.preventDefault()
        e.target.parentElement.classList.toggle('active')
      }}>
      <span>${locale.name}</span>
      <div class="icon"></div>
    </div>
    <ul>${locales.map(locale => mapp.utils.html.node`
        <li>
          <a href="${host + '?locale=' + locale.key + 
            `${mapp.hooks.current.language && '&language=' + mapp.hooks.current.language || ''}`}">
            ${locale.name}`)}`)

  const mapview = mapp.mapview({
    host: host,
    target: OL,
    locale: Object.assign(locale, {
      scrollWheelZoom: true
    }),
    hooks: true,
    attribution: {
      target: document.querySelector('#Attribution > .attribution'),
      links: {
        [`XYZ v${mapp.version}`]: 'https://geolytix.github.io/xyz',
        Openlayers: 'https://openlayers.org'
      }
    },
  })

  mapp.interactions.highlight(mapview)

  // const layers = await mapview.getLayers(locale.layers)

  const layers = await mapp.utils.promiseAll(locale.layers.map(layer => mapp.utils.xhr(`${host}/api/workspace/get/layer?locale=${locale.key}&layer=${layer}`)))

  await mapview.layers.add(layers)

  // Set layer display according to the url hook if defined.
  mapp.hooks.current.layers.length && layers.forEach(layer => layer.display = !!~mapp.hooks.current.layers.indexOf(layer.key))
  
  layers.forEach(layer => layer.display && layer.show())

  mapp.ui.layer.listview({
    target: layersTab,
    list: layers
  })

  mapview.locations.listview = mapp.ui.location.listview({
    target: locationsTab
  })

  mapview.tabview = mapp.ui.tabview({
    target: document.getElementById('tabview')
  })



  // Add zoomIn button.
  const btnZoomIn = btnColumn.appendChild(mapp.utils.html.node `
    <button
      id="btnZoomIn"
      .disabled=${mapview.getZoom() >= mapview.locale.maxZoom}
      title=${mapp.dictionary.toolbar_zoom_in}
      onclick=${e => {
        const z = parseInt(mapview.getZoom() + 1)
        mapview.Map.getView().setZoom(z)
        e.target.disabled = (z >= mapview.locale.maxZoom)
      }}><div class="xyz-icon icon-add">`)

  // Add zoomOut button.
  const btnZoomOut = btnColumn.appendChild(mapp.utils.html.node`
    <button
      id="btnZoomOut"
      .disabled=${mapview.getZoom() <= mapview.locale.minZoom}
      title=${mapp.dictionary.toolbar_zoom_out}
      onclick=${e => {
        const z = parseInt(mapview.getZoom() - 1)
        mapview.Map.getView().setZoom(z)
        e.target.disabled = (z <= mapview.locale.minZoom)
      }}><div class="xyz-icon icon-remove">`)

  // changeEnd event listener for zoom button.
  OL.addEventListener('changeEnd', () => {
    const z = mapview.getZoom()
    btnZoomIn.disabled = z >= mapview.locale.maxZoom
    btnZoomOut.disabled = z <= mapview.locale.minZoom
  })


  // Add zoom to area button.
  // btnColumn.appendChild(mapp.utils.html.node`
  //   <button
  //     class="mobile-display-none"
  //     title=${mapp.dictionary.toolbar_zoom_to_area}
  //     onclick=${e => {
  //       e.stopPropagation()
  //       e.target.classList.toggle('enabled')

  //       if (e.target.classList.contains('enabled')) {

  //         return xyz.mapview.interaction.zoom.begin({
  //           callback: () => {
  //             e.target.classList.remove('enabled')
  //           }
  //         })
  //       }

  //       xyz.mapview.interaction.zoom.cancel()

  //     }}>
  //     <div class="xyz-icon icon-pageview">`)

  // Add locator button.
  // btnColumn.appendChild(mapp.utils.html.node`
  //   <button
  //     title=${mapp.dictionary.toolbar_current_location}
  //     onclick=${e => {
  //       xyz.mapview.locate.toggle();
  //       e.target.classList.toggle('enabled');
  //     }}>
  //     <div class="xyz-icon icon-gps-not-fixed">`)

  // Add fullscreen button.
  // btnColumn.appendChild(mapp.utils.html.node`
  //   <button
  //     class="mobile-display-none"
  //     title=${mapp.dictionary.toolbar_fullscreen}
  //     onclick=${e => {
  //       e.target.classList.toggle('enabled')
  //       document.body.classList.toggle('fullscreen')
  //       xyz.map.updateSize()
  //       Object.values(xyz.layers.list).forEach(layer => {
  //         layer.mbMap?.resize()
  //       })
  //     }}>
  //     <div class="xyz-icon icon-map">`)

    // Add gazetteer control.
    // if (xyz.locale.gazetteer) {

    //   const gazetteer = document.getElementById('gazetteer')
        
    //   const btnGazetteer = btnColumn.insertBefore(mapp.utils.html.node`
    //     <button id="btnGazetteer"
    //       onclick=${e => {
    //         e.preventDefault()
    //         btnGazetteer.classList.toggle('enabled')
    //         btnGazetteer.classList.toggle('mobile-hidden')
    //         gazetteer.classList.toggle('display-none')
    //         gazetteer.querySelector('input').focus()
    //       }}><div class="xyz-icon icon-search">`, btnColumn.firstChild)
        
    //   document.getElementById('closeGazetteer').onclick = e => {
    //     e.preventDefault()
    //     btnGazetteer.classList.toggle('enabled')
    //     btnGazetteer.classList.toggle('mobile-hidden')
    //     gazetteer.classList.toggle('display-none')
    //   }
          
    //   xyz.gazetteer.init({
    //     group: gazetteer.querySelector('.input-drop')
    //   })
          
    // }




    // Add clear all location button.
    // locationsTab.appendChild(mapp.utils.html.node`
    //   <button 
    //     class="tab-display bold primary-colour"
    //     onclick=${e => {
    //       e.preventDefault()
    //       xyz.locations.list
    //         .filter(record => !!record.location)
    //         .forEach(record => record.location.remove())
    //     }}>
    //     ${mapp.dictionary.clear_all_locations}`)

    // Select locations from hooks.
    // mapp.hooks.current.locations.forEach(_hook => {

    //   const hook = _hook.split('!');

    //   xyz.locations.select({
    //     locale: xyz.locale.key,
    //     layer: xyz.layers.list[decodeURIComponent(hook[0])],
    //     table: hook[1],
    //     id: hook[2]
    //   })
    // })

  mapp.user = document.head.dataset.user && JSON.parse(decodeURI(document.head.dataset.user))

  mapp.user && mapp.ui.idle({
    host: mapview.host,
    idle: mapview.locale.idle ?? 600
  })

  // Append user admin button.
  mapp.user && mapp.user.admin && btnColumn.appendChild(mapp.utils.html.node`
    <a
      title=${mapp.dictionary.toolbar_admin}
      class="mobile-display-none"
      href="${mapp.host + '/api/user/admin'}">
      <div class="xyz-icon icon-supervisor-account">`)

  // Append logout button.
  document.head.dataset.login && btnColumn.appendChild(mapp.utils.html.node`
    <a
      title="${mapp.user && `${mapp.dictionary.toolbar_logout} ${mapp.user.email}` || 'Login'}"
      href="${mapp.user && '?logout=true' || '?login=true'}">
      <div
        class="${`xyz-icon ${mapp.user && 'icon-logout red-filter' || 'icon-lock-open primary-colour-filter'}`}">`)


  // Append spacer for tableview
  btnColumn.appendChild(mapp.utils.html.node`
    <div style="height: 60px;">`)

}