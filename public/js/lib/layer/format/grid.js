export default (layer) => {
  layer.grid_size = Object.values(layer.grid_fields)[0];
  layer.grid_color = Object.values(layer.grid_fields)[1];
  layer.grid_ratio = false;
  layer.reload = () => source.refresh();
  const source = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      if (layer.xhr)
        layer.xhr.abort();
      this.resolution = resolution;
      source.clear();
      const tableZ = layer.tableCurrent();
      if (!tableZ)
        return;
      layer.xhr = new XMLHttpRequest();
      layer.xhr.open("GET", layer.mapview.host + "/api/layer/grid?" + mapp.utils.paramString({
        locale: layer.mapview.locale.key,
        layer: layer.key,
        table: tableZ,
        size: layer.grid_size,
        color: layer.grid_color,
        viewport: [extent[0], extent[1], extent[2], extent[3]]
      }));
      layer.xhr.setRequestHeader("Content-Type", "application/json");
      layer.xhr.responseType = "json";
      layer.xhr.onload = (e) => {
        if (e.target.status !== 200)
          return;
        const data = e.target.response;
        layer.sizeAvg = 0;
        layer.colorAvg = 0;
        const dots = data.map((record) => {
          if (parseFloat(record[2]) > 0) {
            record[2] = isNaN(record[2]) ? record[2] : parseFloat(record[2]);
            record[3] = isNaN(record[3]) ? record[3] : parseFloat(record[3]);
            if (layer.grid_ratio && record[3] > 0) {
              record[3] /= record[2];
            }
            layer.sizeAvg += parseFloat(record[2]);
            layer.colorAvg += isNaN(record[3]) ? 0 : parseFloat(record[3]);
            return new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat([record[0], record[1]])),
              properties: {
                size: parseFloat(record[2]),
                color: isNaN(record[3]) ? record[3] : parseFloat(record[3])
              }
            });
          }
        });
        function getMath(arr, idx, type) {
          const numbers = arr.filter((n2) => isFinite(n2[idx]));
          return Math[type].apply(null, numbers.map((val) => val[idx]));
        }
        layer.sizeMin = getMath(data, 2, "min");
        layer.sizeAvg /= dots.length;
        layer.sizeMax = getMath(data, 2, "max");
        layer.colorMin = getMath(data, 3, "min");
        layer.colorAvg /= dots.length;
        layer.colorMax = getMath(data, 3, "max");
        layer.colorBins = [];
        let n = layer.style.range.length;
        for (var i = 1; i < n; i++) {
          if (i < n / 2) {
            layer.colorBins.push(layer.colorMin + (layer.colorAvg - layer.colorMin) / (n / 2) * i);
          }
          if (i === n / 2) {
            layer.colorBins.push(layer.colorAvg);
          }
          if (i > n / 2) {
            layer.colorBins.push(layer.colorAvg + (layer.colorMax - layer.colorAvg) / (n / 2) * (i - n / 2));
          }
        }
        source.addFeatures(dots);
        if (layer.style.legend.size_min)
          layer.style.legend.size_min.textContent = layer.sizeMin.toLocaleString("en-GB", {maximumFractionDigits: 0});
        if (layer.style.legend.size_avg)
          layer.style.legend.size_avg.textContent = layer.sizeAvg.toLocaleString("en-GB", {maximumFractionDigits: 0});
        if (layer.style.legend.size_max)
          layer.style.legend.size_max.textContent = layer.sizeMax.toLocaleString("en-GB", {maximumFractionDigits: 0});
        if (layer.grid_ratio) {
          if (layer.style.legend.color_min)
            layer.style.legend.color_min.textContent = layer.colorMin.toLocaleString("en-GB", {maximumFractionDigits: 0, style: "percent"});
          if (layer.style.legend.color_avg)
            layer.style.legend.color_avg.textContent = layer.colorAvg.toLocaleString("en-GB", {maximumFractionDigits: 0, style: "percent"});
          if (layer.style.legend.color_max)
            layer.style.legend.color_max.textContent = layer.colorMax.toLocaleString("en-GB", {maximumFractionDigits: 0, style: "percent"});
        } else {
          if (layer.style.legend.color_min)
            layer.style.legend.color_min.textContent = layer.colorMin.toLocaleString("en-GB", {maximumFractionDigits: 0});
          if (layer.style.legend.color_avg)
            layer.style.legend.color_avg.textContent = layer.colorAvg.toLocaleString("en-GB", {maximumFractionDigits: 0});
          if (layer.style.legend.color_max)
            layer.style.legend.color_max.textContent = layer.colorMax.toLocaleString("en-GB", {maximumFractionDigits: 0});
        }
      };
      layer.xhr.send();
    },
    strategy: function(extent, resolution) {
      if (this.resolution && this.resolution != resolution) {
        this.loadedExtentsRtree_.clear();
      }
      return [ol.proj.transformExtent(extent, "EPSG:" + layer.mapview.srid, "EPSG:" + layer.srid)];
    }
  });
  layer.L = new ol.layer.Vector({
    source,
    zIndex: layer.style.zIndex || 1,
    style: (feature) => {
      const properties = feature.getProperties().properties;
      const size = properties.size <= layer.sizeAvg ? 7 + 7 / layer.sizeAvg * properties.size : 14 + 7 / (layer.sizeMax - layer.sizeAvg) * (properties.size - layer.sizeAvg);
      properties.hxcolor = layer.style.hxcolor || "#C0C0C0";
      if (parseFloat(properties.color)) {
        properties.hxcolor = layer.style.range[0];
        for (let i = 0; i < layer.colorBins.length; i++) {
          if (properties.color < layer.colorBins[i])
            break;
          properties.hxcolor = layer.style.range[i + 1];
        }
      }
      return new ol.style.Style({
        image: mapp.utils.icon({
          type: "dot",
          fillColor: properties.hxcolor,
          scale: size / 30
        })
      });
    }
  });
  layer.L.set("layer", layer, true);
};
