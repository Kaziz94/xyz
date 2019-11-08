export default _xyz => layer => {

  if (!layer.edit) return;

  if (layer.edit.properties && Object.keys(layer.edit).length === 1) return;

  if (layer.edit.properties && layer.edit.delete && Object.keys(layer.edit).length === 2) return;

  const panel = _xyz.utils.wire()`<div class="panel expandable">`;

  // Panel header
  panel.appendChild(_xyz.utils.wire()`
  <div
    class="btn_text cursor noselect primary-colour"
    onclick=${e => {
      e.stopPropagation();
      _xyz.utils.toggleExpanderParent({
        expandable: panel,
        accordeon: true,
      });
    }}>Add new Locations`);


  layer.edit.point && panel.appendChild(_xyz.utils.wire()`
  <div
  class="btn_state btn_wide cursor noselect primary-colour"
  onclick=${e => {

    e.stopPropagation();
    const btn = e.target;

    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');
   
    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'Point',
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });

  }}>Point`);
  

  layer.edit.polygon && panel.appendChild(_xyz.utils.wire()`
  <div
  class="btn_state btn_wide cursor noselect primary-colour"
  onclick=${e => {

    e.stopPropagation();
    const btn = e.target;

    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');

    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'Polygon',
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });

  }}>Polygon`);
  

  layer.edit.rectangle && panel.appendChild(_xyz.utils.wire()`
  <div
  class="btn_state btn_wide cursor noselect primary-colour"
  onclick=${e => {

    e.stopPropagation();
    const btn = e.target;

    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');

    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'Circle',
      geometryFunction: _xyz.mapview.lib.draw.createBox(),
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });

  }}>Rectangle`);
  

  layer.edit.circle && panel.appendChild(_xyz.utils.wire()`
  <div
  class="btn_state btn_wide cursor noselect primary-colour"
  onclick=${e => {

    e.stopPropagation();
    const btn = e.target;

    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');

    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'Circle',
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });

  }}>Circle`);


  layer.edit.line && panel.appendChild(_xyz.utils.wire()`
  <div
  class="btn_state btn_wide cursor noselect primary-colour"
  onclick=${e => {

    e.stopPropagation();
    const btn = e.target;

    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');

    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'LineString',
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });

  }}>Line`);


  layer.edit.freehand && panel.appendChild(_xyz.utils.wire()`
  <div
  class="btn_state btn_wide cursor noselect primary-colour"
  onclick=${e => {

    e.stopPropagation();
    const btn = e.target;

    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');

    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'LineString',
      freehand: true,
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });

  }}>Freehand`);  

 
  if(layer.edit.isoline_mapbox){

    if (typeof(layer.edit.isoline_mapbox) !== 'object') layer.edit.isoline_mapbox = {};   

    let _container = _xyz.utils.wire()`
    <div class="drawer expandable">
    <table><tr><td>
    <div style="padding: 4px;" class="table-section">`;

    _container.appendChild(_xyz.utils.wire()`
      <div
      class="btn_subtext cursor noselect primary-colour"
      style="text-align: left;"
      onclick=${
        e => {
          if (e) e.stopPropagation();
          _xyz.utils.toggleExpanderParent({
            expandable: _container,
            accordeon: true
          });
        }
      }
      >Mapbox Isoline settings`);

    panel.appendChild(_container);

    _xyz.ctrl.isoline_mapbox({
      entry: layer,
      container: _container
    });

    panel.appendChild(_xyz.utils.wire()`
    <div
    class="btn_state btn_wide cursor noselect primary-colour"
    onclick=${e => {
  
    e.stopPropagation();
    const btn = e.target;
  
    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');
  
    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'Point',
      geometryFunction: function(coordinates, geometry) {

        geometry = new _xyz.mapview.lib.geom.Circle(coordinates, layer.edit.isoline_mapbox.minutes * 1000);
        
        var feature = new _xyz.mapview.lib.Feature({
          geometry: geometry
        });

        const origin = _xyz.mapview.lib.proj.transform(coordinates, `EPSG:${_xyz.mapview.srid}`, 'EPSG:4326');

        const xhr = new XMLHttpRequest();
  
        xhr.open(
          'GET',
          _xyz.host +
          '/api/location/edit/isoline/mapbox?' +
          _xyz.utils.paramString({
            locale: _xyz.workspace.locale.key,
            coordinates: origin.join(','),
            minutes: layer.edit.isoline_mapbox.minutes,
            profile: layer.edit.isoline_mapbox.profile,
            token: _xyz.token
          }));

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
    
        xhr.onload = e => {
        
          if (e.target.status !== 200) return alert('No route found. Try a longer travel time or alternative setup.');

          const geoJSON = new _xyz.mapview.lib.format.GeoJSON();

          const feature = geoJSON.readFeature({
            type: 'Feature',
            geometry: e.target.response
          },{ 
            dataProjection: 'EPSG:4326',
            featureProjection:'EPSG:' + _xyz.mapview.srid
          });

          _xyz.mapview.interaction.draw.Source.clear();

          _xyz.mapview.interaction.draw.Source.addFeature(feature);
                                    
        };
    
        xhr.send();

        return geometry;
      },
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });
  
  }}>Isoline Mapbox`);

  }


  if(layer.edit.isoline_here){

    if (typeof(layer.edit.isoline_here) !== 'object') layer.edit.isoline_here = {};   

    let _container = _xyz.utils.wire()`
    <div class="drawer expandable">
    <table><tr><td>
    <div style="padding: 4px;" class="table-section">`;

    _container.appendChild(_xyz.utils.wire()`
      <div
        class="btn_subtext cursor noselect primary-colour"
        style="text-align: left;"
        onclick=${e => {
          e && e.stopPropagation();
          _xyz.utils.toggleExpanderParent({
            expandable: _container,
            accordeon: true
          });
        }}>Here Isoline settings`);

    panel.appendChild(_container);

    _xyz.ctrl.isoline_here({
      entry: layer,
      container: _container
    });

    panel.appendChild(_xyz.utils.wire()`
    <div
    class="btn_state btn_wide cursor noselect primary-colour"
    onclick=${e => {
  
    e.stopPropagation();
    const btn = e.target;
  
    if (btn.classList.contains('active')) return _xyz.mapview.interaction.draw.finish();

    btn.classList.add('active');
    layer.view.querySelector('.header').classList.add('edited', 'secondary-colour-bg');
  
    _xyz.mapview.interaction.draw.begin({
      layer: layer,
      type: 'Point',
      geometryFunction: function(coordinates, geometry) {

        geometry = new _xyz.mapview.lib.geom.Circle(coordinates, layer.edit.isoline_here.minutes * 1000);
        
        var feature = new _xyz.mapview.lib.Feature({
          geometry: geometry
        });

        const origin = _xyz.mapview.lib.proj.transform(coordinates, `EPSG:${_xyz.mapview.srid}`, 'EPSG:4326');

        const xhr = new XMLHttpRequest();
  
        xhr.open(
          'GET',
          _xyz.host +
          '/api/location/edit/isoline/here?' +
          _xyz.utils.paramString({
            locale: _xyz.workspace.locale.key,
            coordinates: origin.reverse().join(','),
            mode: layer.edit.isoline_here.mode,
            type: layer.edit.isoline_here.type,
            rangetype: layer.edit.isoline_here.rangetype,
            minutes: layer.edit.isoline_here.minutes,
            distance: layer.edit.isoline_here.distance,
            token: _xyz.token
          }));

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
    
        xhr.onload = e => {
        
          if (e.target.status !== 200) return alert('No route found. Try a longer travel time or alternative setup.');

          const geoJSON = new _xyz.mapview.lib.format.GeoJSON();

          const feature = geoJSON.readFeature({
            type: 'Feature',
            geometry: e.target.response
          },{ 
            dataProjection: 'EPSG:4326',
            featureProjection:'EPSG:' + _xyz.mapview.srid
          });

          _xyz.mapview.interaction.draw.Source.clear();

          _xyz.mapview.interaction.draw.Source.addFeature(feature);
                                    
        };
    
        xhr.send();

        return geometry;
      },
      callback: () => {
        layer.view.querySelector('.header').classList.remove('edited', 'secondary-colour-bg');
        btn.classList.remove('active');
      }
    });
  
  }}>Isoline Here`);

  }

  return panel;

};