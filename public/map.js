// var baseUrl = 'http://localhost:3000/'
var baseUrl = 'https://swiss-hiking.appspot.com/'

// create a Vue component on a Div
new Vue({
  el: '#app',
  // map will become a reference to the Leaflet map
  // tileLayer will become a reference to the tile layer (actual map visuals)
  // tracks array will eventually contain objects
  data: {
    map: null,
    tileLayer: null,
    tracks: new Map(),
  },
  mounted() {
    this.initTrack();
    this.initMap();
  },
  // define methods that are used in mounted()
  methods: {
    initTrack() {

    },
    initMap() {
      var self = this  // the vue object

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

      //
      // define action after a view point change
      //

      this.map.on('moveend', function () {
        // this is the map in this scope
        self.fetchTracks(this.getBounds());
      });
    },
    // find all tracks in a nearby region
    fetchTracks(latLngBounds) {
      var west = latLngBounds.getWest();
      var south = latLngBounds.getSouth();
      var east = latLngBounds.getEast();
      var north = latLngBounds.getNorth();
      fetch(baseUrl + 'api/search/' + west + '/' + south + '/' + east + '/' + north)
        .then(response => response.json())
        .then(trackids => {
          trackids.forEach((key) => {
            console.log(key);
            // fetch the track only if it's not fetched yet
            if (!this.tracks.has(key)) {
              fetch(baseUrl + 'api/SchweizMobil/Track/' + key)
                .then(response => response.json())
                .then(json => {
                  var track = JSON.parse(json[0].value);
                  var trackLayer = L.geoJSON(track)
                  this.tracks.set(key, trackLayer);
                  trackLayer.addTo(this.map);
                })
                .catch(error => console.log(error))
            }
          })
        })
        .catch(error => console.log(error))
    },
  },
});
Vue.config.devtools = true;
