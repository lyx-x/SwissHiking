import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map: L.Map;
  private baseMap: L.Layer;

  private statsLayer: L.Layer;

  constructor() {

  }

  ngOnInit() {
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

    this.setView([48.8571, 2.3507], 13);
  }

  public setView(center, zoom) {
    this.map.setView(center, zoom);
  }

  public refreshStatsLayer(geojsonFeature) {
    function getColor(d) {
      return d > 35000 ? '#800026' :
        d > 30000  ? '#BD0026' :
          d > 25000  ? '#E31A1C' :
            d > 20000  ? '#FC4E2A' :
              d > 15000   ? '#FD8D3C' :
                d > 10000   ? '#FEB24C' :
                  d > 5000   ? '#FED976' :
                    '#FFEDA0';
    }

    function s(feature) {
      return {
        fillColor: getColor(feature.properties.DISP_MED14),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }

    this.statsLayer = L.geoJSON(geojsonFeature, {style: s});
    this.statsLayer.addTo(this.map);

    console.log("remove");
    this.map.removeLayer(this.statsLayer);

    console.log("readd");
    this.statsLayer.addTo(this.map);


  }

  public changeField(field: String) {

  }

}
