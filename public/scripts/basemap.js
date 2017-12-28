var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
var osm = L.tileLayer(osmUrl, {maxZoom: 19, attribution: osmAttrib});

var basemap = L.map('map', {
    zoomControl: true
}).setView([51.505, -0.09], 13).addLayer(osm);

basemap.zoomControl.setPosition('bottomright');

L.marker([51.5, -0.09]).addTo(basemap)
    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(basemap).bindPopup("I am a circle.");

L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(basemap).bindPopup("I am a polygon.");


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(basemap);
}

basemap.on('click', onMapClick);