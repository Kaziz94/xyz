export default (_xyz) => {
  return {
    create,
    settings
  };
  function settings(entry) {
    if (entry.edit.defaults === void 0)
      entry.edit.defaults = Object.assign({}, entry.edit.isoline_here);
    if (entry.edit.isoline_here && !entry.edit.isoline_here.geometry && (entry.edit.isoline_here.minutes || entry.value))
      return;
    if (entry.edit.isoline_here && entry.edit.isoline_here.geometry && entry.edit.isoline_here.minutes && !entry.value)
      return;
    panel(entry);
    entry.container && entry.container.parentNode.insertBefore(entry.edit.panel, entry.container.nextSibling);
    return;
  }
  function create(entry) {
    if (entry.edit.defaults === void 0)
      entry.edit.defaults = Object.assign({}, entry.edit.isoline_here);
    const range = (entry.edit.isoline_here.minutes || entry.edit.isoline_here.range) * 60;
    const ll = ol.proj.toLonLat(entry.location.geometry.coordinates, `EPSG:${entry.location.layer.srid}`);
    const destination = entry.edit.isoline_here.destination || entry.edit.defaults.destination;
    const dateISO = entry.edit.isoline_here.dateISO ? new Date(entry.edit.isoline_here.dateISO).toISOString() : entry.edit.defaults.dateISO ? new Date(entry.edit.defaults.dateISO).toISOString() : null;
    const params = {
      transportMode: entry.edit.isoline_here.transportMode || "car",
      [destination ? "destination" : "origin"]: `${ll[1]},${ll[0]}`,
      "range[values]": range || 10 * 60,
      "range[type]": entry.edit.isoline_here.rangetype || "time",
      optimizeFor: entry.edit.isoline_here.optimizeFor || "balanced"
    };
    if (dateISO) {
      Object.assign(params, {
        [destination ? "arrivalTime" : "departureTime"]: dateISO
      });
    }
    _xyz.proxy(`https://isoline.router.hereapi.com/v8/isolines?${mapp.utils.paramString(params)}${entry.edit.isoline_here.maxPoints ? `&shape[${entry.edit.isoline_here.maxPoints}]` : ``}&{HERE}`).then((response) => {
      if (!response.isolines) {
        console.log(response);
        return alert(mapp.dictionary.here_error);
      }
      if (!response.isolines[0].polygons.length) {
        entry.location.view && entry.location.view.classList.remove("disabled");
        return;
      } else {
        const coordinates = mapp.utils.isolineHereDecode(response.isolines[0].polygons[0].outer);
        coordinates.polyline.map((p) => {
          return p.reverse();
        });
        coordinates.polyline.push(coordinates.polyline[0]);
        entry.newValue = {
          type: "Polygon",
          coordinates: [coordinates.polyline]
        };
        if (entry.edit.meta) {
          let date = new Date();
          entry.location.infoj.filter((_entry) => _entry.type === "json" && _entry.field === entry.edit.meta).forEach((meta) => meta.newValue = Object.assign({
            provider: "Here"
          }, params));
        }
        if (entry.edit.panel) {
          entry.edit.panel.remove();
          entry.edit.panel = null;
          panel(entry);
        }
        entry.location.update();
        if (!entry.edit.defaults.dateISO)
          entry.edit.isoline_here.dateISO = null;
        if (!entry.edit.defaults.destination)
          entry.edit.isoline_here.destination = null;
      }
      entry.location.view && entry.location.view.classList.add("disabled");
    });
  }
  function panel(entry) {
    if (entry.edit.panel)
      return;
    if (entry.edit.isoline_here.minutes)
      return;
    entry.edit.panel = mapp.utils.html.node`
        <div
        class="${`drawer group panel expandable ${entry.class || ""}`}"
        style="display: grid; grid-column: 1 / 3; border-bottom: solid 1px grey;">
        <div
        class="header primary-colour"
        style="text-align: left; grid-column: 1 / 3;"
        onclick=${(e) => {
      mapp.ui.toggleExpanderParent(e.target);
    }}
        ><span>${mapp.dictionary.here_isoline_settings}</span>
        <span class="xyz-icon btn-header icon-expander primary-colour-filter">`;
    createElements(entry);
  }
  function createElements(entry) {
    let date_picker_label = mapp.utils.html.node`<span>${mapp.dictionary.here_depart}`;
    entry.edit.panel.appendChild(mapp.utils.html.node`
            <div style="padding-top: 5px; grid-column: 1 / 3;">
            <label class="input-checkbox">
            <input type="checkbox" "checked"=false
            onchange=${(e) => {
      date_picker_label.textContent = e.target.checked ? `${mapp.dictionary.here_arrive}` : `${mapp.dictionary.here_depart}`;
      entry.edit.isoline_here.destination = e.target.checked;
    }}></input><div></div><span>${mapp.dictionary.here_use_as_destination}`);
    const transportModes = [
      {
        [mapp.dictionary.here_driving]: "car"
      },
      {
        [mapp.dictionary.here_walking]: "pedestrian"
      }
    ];
    if (entry.edit.defaults.transportMode === void 0) {
      entry.edit.panel.appendChild(makeDropdown({
        title: mapp.dictionary.here_transport_mode,
        options: transportModes,
        callback: (e, param) => {
          entry.edit.isoline_here.transportMode = param;
        }
      }));
    }
    const ranges = [
      {
        [mapp.dictionary.here_time]: "time"
      }
    ];
    const routingTypes = [
      {
        [mapp.dictionary.here_routing_type_fastest]: "fast"
      },
      {
        [mapp.dictionary.here_routing_type_shortest]: "short"
      }
    ];
    if (entry.edit.defaults.routingType === void 0) {
      entry.edit.panel.appendChild(makeDropdown({
        title: mapp.dictionary.here_routing_type,
        options: routingTypes,
        callback: (e, param) => {
          entry.edit.isoline_here.routingType = param;
        }
      }));
    }
    const optimizeFor = [
      {
        [mapp.dictionary.here_optimize_for_balanced]: "balanced"
      },
      {
        [mapp.dictionary.here_optimize_for_quality]: "quality"
      },
      {
        [mapp.dictionary.here_optimize_for_performance]: "performance"
      }
    ];
    if (entry.edit.defaults.optimizeFor === void 0) {
      entry.edit.panel.appendChild(makeDropdown({
        title: mapp.dictionary.here_optimize_for,
        options: optimizeFor,
        callback: (e, param) => {
          entry.edit.isoline_here.optimizeFor = param;
        }
      }));
    }
    if (entry.edit.defaults.departureTime === void 0 && entry.edit.defaults.arrivalTime === void 0) {
      let dateSelect = mapp.utils.html.node`<input type="text" placeholder=${mapp.dictionary.layer_filter_pick} style="text-align: end;">`;
      entry.edit.panel.appendChild(mapp.utils.html.node`
                <div style="margin-top: 12px; grid-column: 1 / 3; margin-bottom: 8px;">
                <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
                <div style="grid-column: 1;">${date_picker_label}</div>
                <div style="grid-column: 2;">${dateSelect}</div>`);
      mapp.ui.flatpickr({
        locale: mapp.hooks.current.language || null,
        element: dateSelect,
        enableTime: true,
        callback: (dateStr) => {
          if (!dateStr)
            return;
          dateSelect.value = dateStr;
          entry.edit.isoline_here.dateISO = new Date(dateStr).toISOString();
        }
      });
    }
    if (entry.edit.defaults.range === void 0) {
      entry.edit.panel.appendChild(makeSlider({
        title: mapp.dictionary.here_travel_time,
        max: entry.edit.isoline_here.maxMinutes,
        range: 10,
        callback: (e) => {
          entry.edit.isoline_here.range = parseInt(e.target.value);
        }
      }));
    }
  }
  function makeDropdown(params) {
    return mapp.utils.html.node`<div style="margin-top: 8px; grid-column: 1 / 3; align-items: center;">
            <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
            <div style="grid-column: 1;">${params.title}</div>
            <div style="grid-column: 2;">
            <button class="btn-drop">
            <div
                class="head"
                onclick=${(e) => {
      e.preventDefault();
      e.target.parentElement.classList.toggle("active");
    }}>
                <span>${Object.keys(params.options[0])}</span>
                <div class="icon"></div>
            </div>
            <ul>
                ${params.options.map((keyVal) => mapp.utils.html.node`
                <li onclick=${(e) => {
      const drop = e.target.closest(".btn-drop");
      drop.classList.toggle("active");
      drop.querySelector(":first-child").textContent = Object.keys(keyVal)[0];
      if (params.callback)
        params.callback(e, Object.values(keyVal)[0]);
    }}>${Object.keys(keyVal)[0]}`)}`;
  }
  function makeSlider(params) {
    return mapp.utils.html.node`
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
          oninput=${(e) => {
      e.target.parentNode.previousElementSibling.textContent = parseInt(e.target.value);
      if (params.callback)
        params.callback(e);
    }}>`;
  }
};
