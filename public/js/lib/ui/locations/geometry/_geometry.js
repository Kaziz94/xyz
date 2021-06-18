import isoline_here from "./isoline_here.js";
import isoline_mapbox from "./isoline_mapbox.js";
import isoline_tomtom from "./isoline_tomtom.js";
import geometryCollection from "./geometryCollection.js";
import draw from "./draw.js";
export default (entry) => {
  if (entry.query && entry.display) {
    return mapp.query(Object.assign({
      layer: entry.location.layer,
      id: entry.location.id
    }, entry)).then((response) => {
      if (!response)
        return;
      entry.value = response[entry.field];
      if (!entry.value)
        return;
      createContainers(entry);
      drawGeom(entry);
    });
  }
  createContainers(entry);
  entry.edit && entry.edit.isoline_mapbox && isoline_mapbox.settings(entry);
  entry.edit && entry.edit.isoline_here && isoline_here.settings(entry);
  entry.edit && entry.edit.isoline_tomtom && isoline_tomtom.settings(entry);
  entry.edit && entry.edit.polygon && entry.container.parentNode.appendChild(draw.polygon(entry));
  entry.edit && entry.edit.rectangle && entry.container.parentNode.appendChild(draw.rectangle(entry));
  entry.edit && entry.edit.circle && entry.container.parentNode.appendChild(draw.circle(entry));
  entry.edit && entry.edit.line && entry.container.parentNode.appendChild(draw.line(entry));
  entry.edit && entry.edit.freehand && entry.container.parentNode.appendChild(draw.freehand(entry));
  if (entry.value && (entry.display || entry.edit))
    return drawGeom(entry);
  if (!entry.value && entry.display)
    createGeom(entry);
  function createContainers(entry2) {
    entry2.style = Object.assign({}, entry2.location?.style, entry2.style);
    entry2.container = entry2.listview.appendChild(mapp.utils.html.node`
      <div class="${`${entry2.type} ${entry2.class}`}">`);
    entry2.container.appendChild(mapp.utils.html.node`
      <label class="input-checkbox">
        <input type="checkbox"
          .checked=${entry2.edit && entry2.value || !!entry2.display}
          onchange=${(e) => {
      entry2.display = e.target.checked;
      if (entry2.display && entry2.query) {
        return mapp.query(Object.assign({
          layer: entry2.location.layer,
          id: entry2.location.id
        }, entry2)).then((response) => {
          entry2.value = typeof response[entry2.field] === "string" ? JSON.parse(response[entry2.field]) : response[entry2.field];
          if (!entry2.value) {
            alert(mapp.dictionary.location_no_geometry);
            e.target.checked = false;
            return;
          }
          drawGeom(entry2);
        });
      }
      if (entry2.display && entry2.edit)
        return createGeom(entry2, e);
      if (entry2.display && !entry2.edit)
        return drawGeom(entry2);
      if (!entry2.display && entry2.edit) {
        if (entry2.value && !entry2.edit.skipConfirm && !confirm(mapp.dictionary.location_geometry_delete_msg))
          return e.target.checked = true;
        entry2.newValue = null;
        if (entry2.edit.edit) {
          entry2.edit.edit.remove();
          entry2.edit.edit = null;
        }
        if (entry2.edit && entry2.edit.meta) {
          entry2.location.infoj.filter((_entry) => _entry.type === "json" && _entry.field === entry2.edit.meta).forEach((meta) => meta.newValue = null);
        }
        entry2.location.update();
        return;
      }
      ;
      if (!entry2.display && !entry2.edit)
        return hideGeom(entry2);
    }}>
          </input>
          <div></div>
          <span>${entry2.name || "Geometry"}<span>`);
    !entry2.style.theme && entry2.container.appendChild(mapp.utils.html.node`
      <div
        class="sample-circle"
        style="${`
          background-color: ${mapp.utils.chroma(entry2.style.fillColor || entry2.style.strokeColor).alpha(entry2.style.fillOpacity === void 0 ? 1 : parseFloat(entry2.style.fillOpacity) || 0)};
          border-color: ${mapp.utils.chroma(entry2.style.color || entry2.style.strokeColor).alpha(1)};
          border-style: solid;
          border-width: ${entry2.style.strokeWidth || 1}px;
          margin-left: auto;`}">`);
  }
  function drawGeom(entry2) {
    if (entry2.value && entry2.value.type === "FeatureCollection") {
      geometryCollection(entry2);
    } else {
      entry2.geometry = entry2.value && _xyz.mapview.geoJSON({
        geometry: typeof entry2.value === "object" && entry2.value || JSON.parse(entry2.value),
        dataProjection: "4326",
        zIndex: entry2.style.zIndex || entry2.location?.layer.L.getZIndex() - 1,
        style: new ol.style.Style({
          stroke: entry2.style.strokeColor && new ol.style.Stroke({
            color: mapp.utils.chroma(entry2.style.color || entry2.style.strokeColor).alpha(1),
            width: entry2.style.strokeWidth || 1,
            lineDash: entry2.style.lineDash
          }),
          fill: new ol.style.Fill({
            color: mapp.utils.chroma(entry2.style.fillColor || entry2.style.strokeColor).alpha(entry2.style.fillOpacity === void 0 ? 1 : parseFloat(entry2.style.fillOpacity) || 0).rgba()
          })
        })
      });
      entry2.geometry && entry2.location.geometries.push(entry2.geometry);
      entry2.display = true;
    }
  }
  function hideGeom(entry2) {
    entry2.display = false;
    if (entry2.legend)
      entry2.legend.remove();
    entry2.value.type === "FeatureCollection" ? entry2.location.geometries.splice(entry2.location.geometries.indexOf(entry2.geometryCollection), 1) && entry2.location.geometryCollection.map((f) => _xyz.map.removeLayer(f)) : entry2.geometry && entry2.location.geometries.splice(entry2.location.geometries.indexOf(entry2.geometry), 1) && _xyz.map.removeLayer(entry2.geometry);
  }
  function createGeom(entry2, e) {
    if (!entry2.edit)
      return;
    if (entry2.edit.isoline_mapbox)
      return isoline_mapbox.create(entry2);
    if (entry2.edit.isoline_here)
      return isoline_here.create(entry2);
    if (entry2.edit.isoline_tomtom)
      return isoline_tomtom.create(entry2);
    if (e) {
      e.target.checked = false;
      entry2.display = e.target.checked;
      return alert("This geometry doesn't exist. Create it first.");
    }
  }
};
