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

    this.setView([51.505, -0.09], 13);
  }

  public setView(center, zoom) {
    this.map.setView(center, zoom);
  }

}
