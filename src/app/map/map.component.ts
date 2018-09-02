import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";
import { TrackInfo, TrackService } from "../track/track.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // base map
  private map: L.Map;

  // current location, e.g. blue dot
  private location: L.Marker;

  // current displayed track, could be null
  private routeMap: L.Layer;

  selectedTrackInfo: TrackInfo;

  // information displayed and controlled in the modal
  trackInfos: TrackInfo[];

  constructor(private trackService: TrackService) {
    this.location = L.marker(
      [47.36667, 8.55],
      {
        'icon': L.icon({
          iconUrl: 'assets/img/bluecircle.png',
          className: 'location-icon'
        }),
        'interactive': false
      }
    );

    this.trackService.mapComponent = this;
  }

  ngOnInit() {
    let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
      '<a href="https://www.schweizmobil.ch/en/copyright-privacy-policy.html">SwitzerlandMobility</a>';
    let baseMap = L.tileLayer(osmUrl, {maxZoom: 19, attribution: osmAttrib});

    // this must not be called in the constructor because the div in html should be constructed first
    this.map = L.map('map', {
      zoomControl: false,
      layers: [baseMap]
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    L.control.scale().addTo(this.map);

    new LocationControl(this,{ position: 'bottomright' }).addTo(this.map);
    new TrackControl(this,{ position: 'bottomright' }).addTo(this.map);

    this.setView([47.36667, 8.55], 13);
    this.setCurrentLocation();
  }

  setView(center, zoom) {
    this.map.setView(center, zoom);
  }

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // center around the current location
        this.map.panTo([position.coords.latitude, position.coords.longitude]);
        // change the coordinates of the marker
        this.location.setLatLng([position.coords.latitude, position.coords.longitude]);
        // add the marker to the map, if it has been added, nothing will happen
        this.location.addTo(this.map);
      },  (err) => {
        switch(err.code) {
          case err.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
          case err.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
          default:
            alert('An unknown error occurred.');
            break;
        }
      }, { enableHighAccuracy: true });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  updateTrackInfos() {
    if (this.trackInfos == null) {
      this.trackInfos = this.trackService.getTracks();
      this.selectedTrackInfo = null;
    }
  }

  pickTrack(track: TrackInfo) {
    this.selectedTrackInfo = track;
    this.trackService.getTrackRoute(track);
  }

  updateTrackRoute(route) {
    if (this.routeMap != null) {
      this.routeMap.removeFrom(this.map);
    }
    this.routeMap = L.geoJSON(route).addTo(this.map);
    this.map.fitBounds(route.coordinates.map(pt => L.latLng(pt[1], pt[0])));
  }
}

class LocationControl extends L.Control {
  constructor(private mapComponent: MapComponent, opts) {
    super(opts);
  }

  onAdd(map) {
    let div = L.DomUtil.create('div', 'leaflet-bar');
    let button = L.DomUtil.create('a', 'leaflet-touch location-control', div);
    button.innerText = '📡';

    button.setAttribute('href', '#');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Go to current location');
    button.setAttribute('title', 'Go to current location');

    L.DomEvent.on(button, 'click', (ev) => {
      this.mapComponent.setCurrentLocation();
    });

    return div;
  }

  onRemove(map) {
    // Nothing to do here
  }
}

class TrackControl extends L.Control {
  constructor(private mapComponent: MapComponent, opts) {
    super(opts);
  }

  onAdd(map) {
    let div = L.DomUtil.create('div');
    let buttonDiv = L.DomUtil.create('div', 'leaflet-bar menu-control', div);
    buttonDiv.setAttribute('id', 'search-button');

    let button = L.DomUtil.create('a', 'leaflet-touch menu-control', buttonDiv);
    button.innerText = '🏞';

    button.setAttribute('href', '#');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Display available tracks');
    button.setAttribute('title', 'Display available tracks');

    // bind with Bootstrap modal
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#search');

    L.DomEvent.on(button, 'click', (ev) => {
      this.mapComponent.updateTrackInfos();
    });

    return div;
  }

  onRemove(map) {
    // Nothing to do here
  }
}
