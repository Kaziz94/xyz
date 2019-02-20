import location from './location.mjs';

import draw from './draw.mjs';

import drawGeoJSON from './drawGeoJSON.mjs';

export default _xyz => {

  return {

    select: select,

    draw: draw(_xyz),

    drawGeoJSON: drawGeoJSON(_xyz),

    location: location(_xyz),

  };

  function select(location, callback) {

    if (_xyz.locations.current) _xyz.locations.current.remove();

    Object.assign(location, _xyz.locations.location());

    _xyz.locations.current = location;

    location.style = {
      color: '#090',
      stroke: true,
      fill: true,
      fillOpacity: 0
    };

    if (!callback) callback = location => {

      _xyz.locations.draw(location);

      if(!_xyz.mapview.popup || !location.marker) return alert(JSON.stringify(location.infoj, null, ' '));

      _xyz.mapview.popup({
        latlng: [location.marker[1], location.marker[0]],
        content: location.view.node
      });
    };

    location.get(callback);

    return location;

  };

};