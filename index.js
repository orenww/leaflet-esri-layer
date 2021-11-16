(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["leaflet", "esri-leaflet"], factory);
  } else if (typeof module === "object" && module.exports) {
    factory(require("leaflet"));
  } else {
    factory(root.L);
  }
}(this, function (L, esri) {
  L.Control.CbEsri = L.Control.extend({
    options: {
      maps: [],
      overlays: []
    },

    onAdd: function(map) {
      if ((this.options && this.options.maps.length > 0) || this.options.overlays.length > 0) {
        var layerGroup = L.layerGroup();

        if (this.options.overlays.length > 0) {
          var overlays = {};

          if (this.options.overlays.includes('statesOverlay')) {
            // State overLayer
            var statesOverlay = esri.featureLayer({
              url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3',
              style: function() {
                ({ color: '#bada55', weight: 2 });
              }
            });

            overlays['U.S. States'] = statesOverlay;
          }

          if (this.options.overlays.includes('electionResultOverLay')) {
            // State electionResultOverLay
            var electionResultOverLay = esri.featureLayer({
              url:
                'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Congressional_Districts/FeatureServer/0',
              simplifyFactor: 0.5,
              precision: 5,
              style: function(feature) {
                if (feature.properties.PARTY === 'Democrat') {
                  return { color: 'blue', weight: 2 };
                } else if (feature.properties.PARTY === 'Republican') {
                  return { color: 'red', weight: 2 };
                } else {
                  return { color: 'white', weight: 2 };
                }
              }
            });

            overlays['U.S. Election results'] = electionResultOverLay;
          }
        }

        if (this.options.maps.length > 0) {
          var baseLayers = {
            basic: layerGroup.addTo(map)
          };

          if (this.options.maps.includes('Streets')) {
            baseLayers['Streetmap'] = esri.basemapLayer('Streets');
          }

          if (this.options.maps.includes('Gray')) {
            baseLayers['Grayscale'] = esri.basemapLayer('Gray');
          }

          if (this.options.maps.includes('NationalGeographic')) {
            baseLayers['NationalGeographic'] = esri.basemapLayer('NationalGeographic');
          }

          if (this.options.maps.includes('DarkGray')) {
            baseLayers['DarkGray'] = esri.basemapLayer('DarkGray');
          }

          if (this.options.maps.includes('GrayLabels')) {
            baseLayers['GrayLabels'] = esri.basemapLayer('GrayLabels');
          }
        }

        L.control.layers(baseLayers, overlays).addTo(map);

        var container = L.DomUtil.create('div', 'cb-esri');
        // container.style.backgroundColor = 'green';

        return container;
      }
    }
  })

  L.control.cbEsri = function(options) {
    return new L.Control.CbEsri(options);
  };

}));

