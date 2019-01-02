var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
  '<a href="https://www.schweizmobil.ch/en/copyright-privacy-policy.html">SwitzerlandMobility</a>';
var baseMap = L.tileLayer(osmUrl, {maxZoom: 19, attribution: osmAttrib});

// default to Zurich
var defaultLatlng = L.latLng(47.36667, 8.55);

// this must not be called after the div in html is constructed
var map = L.map('map', {
  zoomControl: false,
  layers: [baseMap]
});

L.control.zoom({ position: 'bottomright' }).addTo(map);
L.control.scale().addTo(map);

// centered around default location
map.setView(defaultLatlng, 13);

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

function onLocationFound(e) {
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
}

function onLocationError(e) {
  console.warn(e.message);
}

L.Control.Tracking = L.Control.extend( {
  onAdd: function(map) {
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
      map.locate({'watch': true});
      map.on('locationfound', onLocationFound);
      map.on('locationerror', onLocationError);
    });

    return div;
  },

  onRemove: function(map) {
    // Nothing to do here
  }
});

L.control.tracking = function(opts) {
    return new L.Control.Tracking(opts);
}

L.control.tracking({ position: 'bottomright' }).addTo(map);
