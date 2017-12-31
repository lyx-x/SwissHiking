import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { GeoJSONWrapper } from "../model/geodata";
import { tap } from "rxjs/operators";

@Injectable()
export class StatsService {

  constructor(private http: HttpClient) { }

  public GetStats(region: String, geo_type: String, geo_year: Number, dispatch: String): Observable<GeoJSONWrapper> {
    return this.http.get<GeoJSONWrapper>('/api/stats/' + region + '/' + geo_type + '/' + geo_year + '/' + dispatch)
      .pipe(
        tap(data => {
          console.log("Fetch data from API.");
        })
      );
  }

}
