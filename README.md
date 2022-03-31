# leaflet-esri-layer

For add layers and maps to leaflet map using `esri-leaflet` according configuration.

Example:

(L.control as any)
  .cbEsri({
	maps: ['DarkGray', 'Gray', 'Streets'],
	overlays: ['statesOverlay', 'electionResultOverLay']
  })
  .addTo(map);