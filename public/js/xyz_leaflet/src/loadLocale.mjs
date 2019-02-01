export default _xyz => {

  _xyz.loadLocale = locale => {

    // Filter invalid layers
    _xyz.layers.list = Object.keys(locale.layers)
      .filter(key => key.indexOf('__') === -1)
      .reduce((obj, key) => {
        obj[key] = locale.layers[key];
        return obj;
      }, {});

    // Set the layer display from hooks then remove layer hooks.
    if (_xyz.hooks.current.layers) Object.keys(_xyz.layers.list).forEach(layer => {
      _xyz.layers.list[layer].display = (_xyz.hooks.current.layers.indexOf(encodeURIComponent(layer)) > -1);
    });

    if (_xyz.hooks.remove) _xyz.hooks.remove('layers');

    _xyz.panes.next = 500;
    _xyz.panes.list = [];

    Object.values(_xyz.layers.list).forEach(layer => _xyz.layers.add(layer));

  };

};