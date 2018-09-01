import { Injectable } from "@angular/core";
import * as L from "leaflet";

@Injectable()
export class MapService {
  public map: L.Map;
  public baseMap: L.Layer;

  constructor() {

  }

  init() {
    let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    this.baseMap = L.tileLayer(osmUrl, {maxZoom: 19, attribution: osmAttrib});

    this.map = L.map("map", {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.baseMap]
    });

    L.control.zoom({ position: "bottomright" }).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.setView([47.3769, -8.5417], 13);
    this.setCurrentLocation();

    class LocationControl extends L.Control {
      private mapService: MapService;

      constructor(mapService: MapService, opts) {
        super(opts);
        this.mapService = mapService;
      }

      onAdd(map) {
        let div = L.DomUtil.create('div', 'leaflet-bar');
        let button = L.DomUtil.create('a', 'leaflet-touch location-control', div);

        button.setAttribute('href', '#');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', 'Go to current location');
        button.setAttribute('title', 'Go to current location');

        L.DomEvent.on(button, 'click', (ev) => {
          this.mapService.setCurrentLocation();
        });

        return div;
      }

      onRemove(map) {
        // Nothing to do here
      }
    }

    new LocationControl(this,{ position: 'bottomright' }).addTo(this.map);

  }

  setView(center, zoom) {
    this.map.setView(center, zoom);
  }

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.map.panTo([position.coords.latitude, position.coords.longitude]);
        L.marker(
          [position.coords.latitude, position.coords.longitude],
          {
            'icon': L.icon({
              iconUrl: 'assets/img/bluecircle.png',
              className: 'location-icon'
            })
          }
        ).addTo(this.map);
      },  (err) => {
        switch(err.code) {
          case err.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            alert( "Location information is unavailable.");
            break;
          case err.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          default:
            alert("An unknown error occurred.");
            break;
        }
      }, {enableHighAccuracy: true});
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

}
