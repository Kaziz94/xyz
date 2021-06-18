export default (_xyz) => (layer) => {
  if (typeof layer.edit.isoline_mapbox !== "object")
    layer.edit.isoline_mapbox = {};
  const container = mapp.utils.html.node`<div>`;
  const group = mapp.utils.html.node`
    <div
      class="drawer group panel expandable">
      <div
        class="header primary-colour"
        style="text-align: left;"
        onclick=${(e) => {
    mapp.ui.toggleExpanderParent(e.target);
  }}>
        <span>${mapp.dictionary.mapbox_isoline_settings}</span>
        <span class="xyz-icon btn-header icon-expander primary-colour-filter">`;
  layer.edit.isoline_mapbox.profile = layer.edit.isoline_mapbox.profile || "driving";
  layer.edit.isoline_mapbox.minutes = layer.edit.isoline_mapbox.minutes || 10;
  const modes = [
    {[mapp.dictionary.mapbox_driving]: "driving"},
    {[mapp.dictionary.mapbox_walking]: "walking"},
    {[mapp.dictionary.mapbox_cycling]: "cycling"}
  ];
  layer.edit.isoline_mapbox.profile = "driving";
  group.appendChild(mapp.utils.html.node`
    <div
      class="display-grid"
      style="margin-top: 8px; grid-template-columns: 50px 1fr; align-items: center;">
      <span style="grid-column: 1;">${mapp.dictionary.mapbox_mode}</span>
      <div style="grid-column: 2;">
        <button class="btn-drop">
          <div class="head"
            onclick=${(e) => {
    e.preventDefault();
    e.target.parentElement.classList.toggle("active");
  }}>
            <span>${mapp.dictionary.mapbox_driving}</span>
            <div class="icon"></div>
          </div>
          <ul>${modes.map((keyVal) => mapp.utils.html.node`
            <li onclick=${(e) => {
    const drop = e.target.closest(".btn-drop");
    drop.classList.toggle("active");
    drop.querySelector(":first-child").textContent = Object.keys(keyVal)[0];
    layer.edit.isoline_mapbox.profile = Object.values(keyVal)[0];
  }}>${Object.keys(keyVal)[0]}`)}`);
  group.appendChild(mapp.utils.html.node`
    <div style="margin-top: 12px;">
      <span>${mapp.dictionary.mapbox_travel_time}</span>
      <span class="bold">${layer.edit.isoline_mapbox.minutes}</span>
      <div class="input-range">
        <input
          class="secondary-colour-bg"
          type="range" min=5 max=${layer.edit.isoline_mapbox.maxMinutes || 30} step=1
          value=${layer.edit.isoline_mapbox.minutes}
          oninput=${(e) => {
    layer.edit.isoline_mapbox.minutes = parseInt(e.target.value);
    e.target.parentNode.previousElementSibling.textContent = layer.edit.isoline_mapbox.minutes;
  }}>`);
  container.appendChild(group);
  container.appendChild(mapp.utils.html.node`
    <button
      class="btn-wide primary-colour"
      onclick=${draw}>${mapp.dictionary.layer_draw_isoline_mapbox}`);
  return container;
  function draw(e) {
    e.stopPropagation();
    const btn = e.target;
    if (btn.classList.contains("active"))
      return _xyz.mapview.interaction.draw.cancel();
    btn.classList.add("active");
    layer.show();
    layer.view.querySelector(".header").classList.add("edited", "secondary-colour-bg");
    _xyz.mapview.interaction.draw.begin({
      layer,
      type: "Point",
      geometryFunction: function(coordinates, geometry) {
        geometry = new ol.geom.Circle(coordinates, layer.edit.isoline_mapbox.minutes * 1e3);
        const origin = ol.proj.transform(coordinates, `EPSG:${_xyz.mapview.srid}`, "EPSG:4326");
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.mapbox.com/isochrone/v1/mapbox/${layer.edit.isoline_mapbox.profile || "driving"}/${origin.join(",")}?` + mapp.utils.paramString({
          contours_minutes: layer.edit.isoline_mapbox.minutes,
          generalize: layer.edit.isoline_mapbox.minutes,
          polygons: true,
          access_token: layer.edit.isoline_mapbox.access_token
        }));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "json";
        xhr.onload = (e2) => {
          if (e2.target.status !== 200 || !e2.target.response.features)
            return alert("No route found. Try a longer travel time or alternative setup.");
          _xyz.mapview.interaction.draw.feature({
            geometry: e2.target.response.features[0].geometry,
            dataProjection: "EPSG:4326"
          });
        };
        xhr.send();
        return geometry;
      },
      callback: () => {
        layer.view.querySelector(".header").classList.remove("edited", "secondary-colour-bg");
        btn.classList.remove("active");
      }
    });
  }
};
