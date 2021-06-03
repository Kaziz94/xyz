export default _xyz => layer => {

    if (typeof(layer.edit.isoline_here) !== 'object') layer.edit.isoline_here = {}

    layer.edit.defaults = {}

    const container = mapp.utils.html.node `<div>`

    const group = mapp.utils.html.node `
    <div
      class="drawer group panel expandable">
      <div
        class="header primary-colour"
        style="text-align: left;"
        onclick=${e => {
          mapp.ui.toggleExpanderParent(e.target)
        }}>
        <span>${mapp.dictionary.here_isoline_settings}</span>
        <span class="xyz-icon btn-header icon-expander primary-colour-filter">`

    createElements(group)

    container.appendChild(group)

    container.appendChild(mapp.utils.html.node `
    <button
      class="btn-wide primary-colour"
      onclick=${draw}>${mapp.dictionary.layer_draw_isoline_here}`)

    return container

    function draw(e) {

        e.stopPropagation();
        const btn = e.target;

        if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.cancel()

        btn.classList.add('active')
        layer.show()
        layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg')

        _xyz.mapview.interaction.draw.begin({
            layer: layer,
            type: 'Point',
            geometryFunction: function(coordinates, geometry) {

                geometry = new ol.geom.Circle(coordinates, layer.edit.isoline_here.minutes * 1000)

                const origin = ol.proj.transform(coordinates, `EPSG:${_xyz.mapview.srid}`, 'EPSG:4326')

                // Set range default.
                const range = layer.edit.isoline_here.range * 60

                const geo = `${origin[1]},${origin[0]}`

                const destination = layer.edit.isoline_here.destination || layer.edit.defaults.destination

                const dateISO = layer.edit.isoline_here.dateISO ? new Date(layer.edit.isoline_here.dateISO).toISOString() : layer.edit.defaults.dateISO ? new Date(layer.edit.defaults.dateISO).toISOString() : null

                const params = {
                    transportMode: layer.edit.isoline_here.transportMode || 'car',
                    [destination ? 'destination' : 'origin']: geo,
                    "range[values]": range || 10 * 60,
                    "range[type]": layer.edit.isoline_here.rangetype || 'time',
                    optimizeFor: layer.edit.isoline_here.optimizeFor || 'balanced'
                }

                if (dateISO) {
                    Object.assign(params, {
                        [destination ? 'arrivalTime' : 'departureTime']: dateISO })
                }

                _xyz
                  .proxy(`https://isoline.router.hereapi.com/v8/isolines?${mapp.utils.paramString(params)}${
                    layer.edit.isoline_here.maxPoints ? `&shape[${layer.edit.isoline_here.maxPoints}]` : ``
                  }&{HERE}`)
                  .then(response => {

                      if (!response.isolines) {
                        console.log(response)
                        return alert(mapp.dictionary.here_error)
                      }

                      const coordinates = mapp.utils.isolineHereDecode(response.isolines[0].polygons[0].outer)

                      coordinates.polyline.map(p => { return p.reverse() })

                      coordinates.polyline.push(coordinates.polyline[0])

                      _xyz.mapview.interaction.draw.feature({
                          geometry: {
                              'type': 'Polygon',
                              'coordinates': [coordinates.polyline]
                          }
                      })
                  })

                return geometry
            },
            callback: () => {
                layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg')
                btn.classList.remove('active')
            }
        })

    }

    function createElements(group) {

        let date_picker_label = mapp.utils.html.node `<span>${mapp.dictionary.here_depart}`

        group.appendChild(mapp.utils.html.node `
            <div style="padding-top: 5px; grid-column: 1 / 3;">
            <label class="input-checkbox">
            <input type="checkbox" "checked"=false
            onchange=${e => {
                date_picker_label.textContent = e.target.checked ? `${mapp.dictionary.here_arrive}` : `${mapp.dictionary.here_depart}`
                layer.edit.isoline_here.destination = e.target.checked
            }}></input><div></div><span>${mapp.dictionary.here_use_as_destination}`)

        const transportModes = [{
                [mapp.dictionary.here_driving]: 'car'
            },
            {
                [mapp.dictionary.here_walking]: 'pedestrian'
            }/*,
            {
                [mapp.dictionary.here_cargo]: 'truck'
            }*/
        ]


        group.appendChild(makeDropdown({
            title: mapp.dictionary.here_transport_mode,
            options: transportModes,
            callback: (e, param) => {
                layer.edit.isoline_here.transportMode = param
            }
        }))

        const ranges = [
            {
                [mapp.dictionary.here_time]: "time" } //,
            //{[mapp.dictionary.here_distance]: "distance" } // supporting time range only atm
        ]

        const routingTypes = [
            {
                [mapp.dictionary.here_routing_type_fastest]: 'fast' },
            {
                [mapp.dictionary.here_routing_type_shortest]: 'short' }
        ]


        group.appendChild(makeDropdown({
            title: mapp.dictionary.here_routing_type,
            options: routingTypes,
            callback: (e, param) => {
                layer.edit.isoline_here.routingType = param
            }
        }))

        const optimizeFor = [
            {
                [mapp.dictionary.here_optimize_for_balanced]: 'balanced' },
            {
                [mapp.dictionary.here_optimize_for_quality]: 'quality' },
            {
                [mapp.dictionary.here_optimize_for_performance]: 'performance' }
        ]

        group.appendChild(makeDropdown({
            title: mapp.dictionary.here_optimize_for,
            options: optimizeFor,
            callback: (e, param) => {
                layer.edit.isoline_here.optimizeFor = param
            }
        }))

        let dateSelect = mapp.utils.html.node `<input type="text" placeholder=${mapp.dictionary.layer_filter_pick} style="text-align: end;">`;

        group.appendChild(mapp.utils.html.node `
                <div style="margin-top: 12px; grid-column: 1 / 3; margin-bottom: 8px;">
                <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
                <div style="grid-column: 1;">${date_picker_label}</div>
                <div style="grid-column: 2;">${dateSelect}</div>`)

        mapp.ui.flatpickr({
            locale: mapp.hooks.current.language || null,
            element: dateSelect,
            enableTime: true,
            callback: dateStr => {

                if(!dateStr) return
                
                dateSelect.value = dateStr

                layer.edit.isoline_here.dateISO = new Date(dateStr).toISOString()

            }
        });

        group.appendChild(makeSlider({
            title: mapp.dictionary.here_travel_time,
            max: layer.edit.isoline_here.maxMinutes,
            range: 10,
            callback: e => {
                layer.edit.isoline_here.range = parseInt(e.target.value)
            }
        }))
    }

    function makeDropdown(params) {

        return mapp.utils.html.node `<div style="margin-top: 8px; grid-column: 1 / 3; align-items: center;">
            <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
            <div style="grid-column: 1;">${params.title}</div>
            <div style="grid-column: 2;">
            <button class="btn-drop">
            <div
                class="head"
                onclick=${e => {
                    e.preventDefault();
                    e.target.parentElement.classList.toggle('active');
                }}>
                <span>${Object.keys(params.options[0])}</span>
                <div class="icon"></div>
            </div>
            <ul>
                ${params.options.map(
                keyVal => mapp.utils.html.node`
                <li onclick=${e=>{
                    const drop = e.target.closest('.btn-drop');
                    drop.classList.toggle('active');
                    drop.querySelector(':first-child').textContent = Object.keys(keyVal)[0];
                    if(params.callback) params.callback(e, Object.values(keyVal)[0]);
                
                }}>${Object.keys(keyVal)[0]}`)}`;
    }

    function makeSlider(params) {
        return mapp.utils.html.node `
        <div style="margin-top: 12px; grid-column: 1 / 3;">
        <span>${params.title}</span>
        <span class="bold">${params.range}</span>
        <div class="input-range">
        <input
          class="secondary-colour-bg"
          type="range"
          min=5
          value=${params.range}
          max=${params.max || 30}
          step=1
          oninput=${e=>{
            e.target.parentNode.previousElementSibling.textContent = parseInt(e.target.value)
            if(params.callback) params.callback(e)
          }}>`
    }

}