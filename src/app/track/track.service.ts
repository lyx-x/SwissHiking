import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient) { }

  getSchweizMobilTrack(id: Number) {
    let url = 'https://map.schweizmobil.ch/api/4/query/featuresmultilayers?WanderlandRoutenNational=859&WanderlandRoutenRegional=859&WanderlandRoutenLokal=859&WanderlandRoutenHandicap=859';
    return this.http.get(url);
  }
}
