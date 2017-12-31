import {Component, Input, OnInit} from '@angular/core';
import { StatsService } from "./stats.service";
import { MapComponent } from "../map/map.component";
import { GeoJSONWrapper } from "../model/geodata";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input() mapComponent: MapComponent;

  private geojsonWrapper: GeoJSONWrapper;

  constructor(private stats: StatsService) { }

  ngOnInit() {
    this.stats.GetStats('france', 'iris', 2014, '11')
      .subscribe(
        data => this.geojsonWrapper = data,
        err => console.log(err),
        () => this.mapComponent.refreshStatsLayer(this.geojsonWrapper.data)
        );
  }

}
