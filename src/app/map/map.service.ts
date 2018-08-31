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

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.setView([position.coords.latitude, position.coords.longitude], this.map.getZoom());
      }, (msg) => {
        alert('Please enable your GPS position future.');
      }, {enableHighAccuracy: true});
    } else {
      alert("Geolocation is not supported by this browser.");
    }

  }

  setView(center, zoom) {
    this.map.setView(center, zoom);
  }

}
