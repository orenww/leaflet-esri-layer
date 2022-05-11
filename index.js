(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["leaflet", "esri-leaflet", "esri-leaflet-vector"], factory);
  } else if (typeof module === "object" && module.exports) {
    factory(require("leaflet"));
  } else {
    factory(root.L);
  }
}(this, function (L, esri, vector) {
  L.Control.CbEsri = L.Control.extend({
    options: {
      maps: [],
      overlays: []
    },

    onAdd: function(map) {
      if ((this.options)){
        var overlays;
        var baseLayers;

        //layers
        if (this.options.overlays) {
          overlays = {};

          var layerName;
          for(var layer of this.options.overlays){
            try{
              layerName = layer.name;
              var overlay;
              if(layer.type === "featureLayer"){
                const cloneStyle = { ...layer.style };

                overlay = esri.featureLayer({
                  url: layer.url,
                  simplifyFactor: layer.simplifyFactor,
                  precision: layer.precision,
                  style: function() {
                    return cloneStyle;
                  }
                });
              }else if(layer.type === "vectorTileLayer"){
                overlay = vector.vectorTileLayer(
                  layer.url
                );
              }

              overlays[layer.name] = overlay;
            }catch(error){
              console.log(`ERROR, add layer - ${layerName}, ${error}`);
            }
          }
        }

        // maps
        if (this.options.maps) {
          var mapName;
          for(var newMap of this.options.maps){
            try{
              if(!baseLayers){
                var layerGroup = L.layerGroup();
                baseLayers = {
                  basic: layerGroup.addTo(map)
                };
              }

              mapName = newMap.name;

              var tileProtocol = newMap.tileProtocol;
              var newMapObj = {
                urlTemplate: tileProtocol + newMap.config.urlTemplate,
                options: newMap.config.options
              }

              baseLayers[mapName] = esri.basemapLayer(newMapObj);
            }catch(error){
              console.log(`ERROR, add map - ${mapName}, ${error}`);
            }
          }
        }

        if(baseLayers || overlays){
          L.control.layers(baseLayers, overlays, {position: 'topleft'}).addTo(map);

          var container = L.DomUtil.create('div', 'cb-esri');

          return container;
        }
      }
    }
  })

  L.control.cbEsri = function(options) {
    return new L.Control.CbEsri(options);
  };
}));