export default function(params){

  const draw = {

    finish: finish,

    cancel: cancel,

    update: update,

    feature: feature,

    format: new ol.format.GeoJSON(),
 
    Layer: new ol.layer.Vector({
      source: new ol.source.Vector()
    })

  };

  const mapview = this

  mapview.interaction?.finish()

  mapview.interaction = draw
  
  delete draw.kinks;

  draw.finish = params.finish || finish;

  draw.callback = params.callback;

  draw.select_callback = params.select_callback

  draw.update = params.update || update;

  draw.layer = params.layer;

  draw.layer && !draw.layer.display && draw.layer.show();

  mapview.node.style.cursor = 'crosshair';
   
  draw.vertices = [];
  
  mapview.Map.addLayer(draw.Layer);

  params.style = params.style || {}

  const stroke = new ol.style.Stroke({
    color: params.style.strokeColor || '#3399CC',
    width: params.style.strokeWidth || 1.25
  })

  const fill = new ol.style.Fill({
    color: params.style.fillColor || 'rgba(255,255,255,0.4)'
  })

  const drawStyle = new ol.style.Style({
    image: params.style.image && mapp.utils.icon(params.style.image) ||
      new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: 5
      }),
    stroke: stroke,
    fill: fill,
  })
  
  draw.interaction = new ol.interaction.Draw({
    source: draw.Layer.getSource(),
    geometryFunction: params.geometryFunction || params.checkKinks && polygonKinks,
    freehand: params.freehand,
    type: params.type,
    style: () => drawStyle,
    condition: e => {

      // A vertice may not be set if kinks were detected on the geometry.
      if (draw.kinks) return false;

      if (e.originalEvent.buttons === 1) {
        draw.vertices.push(e.coordinate);
        mapview.popup.remove();
        return true;
      }
    }
  });

  draw.interaction.on('drawstart', e => {

    params.tooltip && metricFunction(e.feature.getGeometry(), params.tooltip)

    e.feature.setStyle(drawStyle)

    draw.Layer.getSource().clear();
    mapview.popup.remove();
  });
  
  draw.interaction.on('drawend', e => {
    params.freehand && draw.vertices.push(e.target.sketchCoords_.pop());
    if (params.drawend) return params.drawend(e);
    draw.layer && setTimeout(contextmenu, 400);
  });
  
  mapview.Map.addInteraction(draw.interaction);

  draw.layer && mapview.node.addEventListener('contextmenu', contextmenu);

  function metricFunction(geometry, metric) {

    const metrics = {
      distance: () => ol.sphere.getLength(new ol.geom
          .LineString([geometry.getInteriorPoint().getCoordinates(), _xyz.mapview.position])),
      area: () => ol.sphere.getArea(geometry),
      length: () => ol.sphere.getLength(geometry),
    }

    if (!metrics[metric]) return

    geometry.on('change', () => {
      mapview.popup.set({
        content: mapp.utils.html.node`
          <div style="padding: 5px">${parseInt(metrics[metric]()).toLocaleString('en-GB') + (metric === 'area' ? 'sqm' : 'm')}`
      });
    })
  }

  function polygonKinks(coordinates, geometry) {

    // if (!geometry) return new ol.geom[draw.interaction.type_](coordinates);

    if (!geometry) {
      geometry = new ol.geom[draw.interaction.type_](coordinates);
    } 

    const kinks = mapp.utils.turf.kinks({
      "type": draw.interaction.type_,
      "coordinates": geometry.getCoordinates()
    }).features;

    if (draw.interaction.type_ === 'Polygon' && coordinates[0].length) {   

      // Add a closing coordinate for polygon geometry.
      geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
    }

    draw.kinks = kinks.length > 0 && kinks[0].geometry.coordinates.join() !== coordinates[0][0].join()

    mapview.node.style.cursor = draw.kinks ? 'not-allowed' : 'crosshair';

    return geometry;
  }

  function cancel() {
    finish()
    mapview.interactions.highlight()
  }
  
  function finish() {

    if (draw.callback) {
      draw.callback()
      delete draw.callback
    }

    mapview.popup.remove()
  
    draw.layer && mapview.node.removeEventListener('contextmenu', contextmenu)

    mapview.Map.removeInteraction(draw.interaction)

    mapview.Map.removeLayer(draw.Layer)

    draw.Layer.getSource().clear()

    mapview.node.style.cursor = 'default'
  }

  function feature(f) {

    const feature = draw.format.readFeature({
        type: 'Feature',
        geometry: f.geometry
    },{ 
        dataProjection: f.dataProjection || 'EPSG:4326',
        featureProjection: 'EPSG:' + mapview.srid
    });

    draw.Layer.getSource().clear();

    draw.Layer.getSource().addFeature(feature);
  }

  function update() {

    const features = draw.Layer.getSource().getFeatures();
  
    const feature = JSON.parse(
      draw.format.writeFeature(
        features[0],
        { 
          dataProjection: 'EPSG:' + draw.layer.srid,
          featureProjection: 'EPSG:' + _xyz.mapview.srid
        })
    );
  
    const xhr = new XMLHttpRequest();
  
    xhr.open('POST', _xyz.host +
      '/api/location/new?' +
      mapp.utils.paramString({
        locale: _xyz.locale.key,
        layer: draw.layer.key,
        table: draw.layer.table
      }));
    
    xhr.setRequestHeader('Content-Type', 'application/json');
            
    xhr.onload = e => {
        
      if (e.target.status !== 200) return;
                      
      draw.layer.reload();
                      
      // Select polygon when post request returned 200.
      _xyz.locations.select({
        layer: draw.layer,
        table: draw.layer.table,
        id: e.target.response
      });

      if (draw.select_callback) {
        draw.select_callback(e.target.response)
      }

    };

    // Send path geometry to endpoint.
    xhr.send(JSON.stringify({
      geometry: feature.geometry
    }));
        
    cancel();
  }
 
  function contextmenu(e) {
  
    if (draw.vertices.length === 0) return;
  
    e && e.preventDefault();

    const features = draw.Layer.getSource().getFeatures();

    const menu = mapp.utils.html.node`<ul>`;

    if (features.length) menu.appendChild(mapp.utils.html.node`
      <li style="padding: 5px;" class="off-white-hover" onclick=${draw.update}>${mapp.dictionary.layer_draw_save}</li>`);

    if (!features.length) menu.appendChild(mapp.utils.html.node`
      <li style="padding: 5px;" class="off-white-hover" onclick=${e=>{
        e.preventDefault();
        draw.interaction.removeLastPoint();
        draw.vertices.pop();
        mapview.popup.remove()
      }}>${mapp.dictionary.layer_draw_last}</li>`);

    menu.appendChild(mapp.utils.html.node`
      <li style="padding: 5px;" class="off-white-hover" onclick=${finish}>${mapp.dictionary.layer_draw_cancel}</li>`);

    mapview.popup.set({
      coords: draw.vertices[draw.vertices.length - 1],
      content: menu,
      autoPan: true
    });
  }

}