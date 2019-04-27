// create a Vue component on a Div
new Vue({
  el: '#app',
  // map will become a reference to the Leaflet map
  // tileLayer will become a reference to the tile layer (actual map visuals)
  // layers array will eventually contain objects
  data: {
    map: null,
    tileLayer: null,
    layers: [],
  },
  mounted() {
    this.initMap();
    this.initLayers();
  },
  // define methods that are used in mounted()
  methods: {
    initMap() {
      //
      // initialize the map component
      //

      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
        '<a href="https://www.schweizmobil.ch/en/copyright-privacy-policy.html">SwitzerlandMobility</a>';
      this.tileLayer = L.tileLayer(osmUrl, { maxZoom: 19, attribution: osmAttrib });

      // default to Zurich
      var defaultLatlng = L.latLng(47.36667, 8.55);

      // this must not be called after the div in html is constructed
      this.map = L.map('map', {
        zoomControl: false,
        layers: [this.tileLayer]
      });

      L.control.zoom({ position: 'bottomright' }).addTo(this.map);
      L.control.scale().addTo(this.map);

      // centered around default location
      this.map.setView(defaultLatlng, 13);

      //
      // define a tracking control
      //

      var locationRequested = false;

      var locationIcon = L.icon({
        iconUrl: 'static/images/bluecircle.png',
        className: 'location-icon'
      });

      var locationMarker = L.marker(
        defaultLatlng,
        {
          'icon': locationIcon,
          'interactive': false,
        });

      var locationCircle = L.circle(defaultLatlng, 0);

      L.Control.Tracking = L.Control.extend({
        onAdd: function (map) {
          var div = L.DomUtil.create('div', 'leaflet-bar');
          var button = L.DomUtil.create('a', 'leaflet-touch tracking-control', div);
          button.innerText = '📡';

          button.setAttribute('href', '#');
          button.setAttribute('role', 'button');
          button.setAttribute('aria-label', 'Go to current location');
          button.setAttribute('title', 'Go to current location');

          L.DomEvent.on(button, 'click', (ev) => {
            // start location tracking and set view to the current location
            console.log('Enabling geo localization...');
            // signal a new push of button
            locationRequested = true;
            // only watch and update the marker, do not set view
            map.locate({ 'watch': true })
              .on('locationfound', e => {
                var radius = e.accuracy / 2;

                locationMarker.setLatLng(e.latlng);
                locationCircle.setLatLng(e.latlng);
                locationCircle.setRadius(radius);

                // won't do anything if already added
                locationMarker.addTo(map);
                locationCircle.addTo(map);

                // only change the view by pushing the button
                if (locationRequested) {
                  locationRequested = false;
                  map.panTo(e.latlng);
                }
              })
              .on('locationerror', e => {
                console.warn(e.message);
              });
          });

          return div;
        },

        onRemove: function (map) {
          // Nothing to do here
        }
      });

      L.control.tracking = function (opts) {
        return new L.Control.Tracking(opts);
      }

      L.control.tracking({ position: 'bottomright' }).addTo(this.map);

    },
    initLayers() { },
  },
});
