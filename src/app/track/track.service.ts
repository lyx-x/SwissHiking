import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MapComponent } from "../map/map.component";
import { FeatureCollection, MultiLineString} from "geojson";

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  mapComponent: MapComponent;

  constructor(private http: HttpClient) { }

  getTracks(): TrackInfo[] {
    // return all available tracks and their source
    return [
      new TrackInfo('SchweizMobil', '859', 'something'),
      new TrackInfo('SchweizMobil', '2', '2'),
      new TrackInfo('SchweizMobil', '3000', '3'),
    ]
  }

  getTrackRoute(trackInfo: TrackInfo) {
    switch (trackInfo.source) {
      case 'SchweizMobil':
        this.getSchweizMobilTrack(trackInfo.id);
        break;
    }
  }

  getSchweizMobilTrack(id: string) {
    let params = new HttpParams();
    params = params.append('WanderlandRoutenNational', id);
    params = params.append('WanderlandRoutenRegional', id);
    params = params.append('WanderlandRoutenLokal', id);
    params = params.append('WanderlandRoutenHandicap', id);

    this.http.get('https://map.schweizmobil.ch/api/4/query/featuresmultilayers', {params: params})
      .subscribe(
        result => {
          let features = (result as FeatureCollection).features;
          if (features.length > 0) {
            let positions = (features[0].geometry as MultiLineString).coordinates[0];
            let route = {
              'type': 'LineString',
              'coordinates': []
            };

            positions.forEach(position => {
              let coords = CoordinatesConverter.ch1903ToWgs84(position[0], position[1]);
              route.coordinates.push([coords[0], coords[1]]);
            });
            this.mapComponent.updateTrackRoute(route);
          }
          else {
            this.mapComponent.selectedTrackInfo.setInvalid();
            console.warn(`[Warning] getSchweizMobilTrack(${id}): no feature returned`)
          }
        },
        error => {
          this.mapComponent.selectedTrackInfo.setInvalid();
          console.warn(`[Error] getSchweizMobilTrack(${id}): ${error}`);
        },
        () => console.log(`[Done] getSchweizMobilTrack(${id})`)
      );
  }
}

export class TrackInfo {
  private isValid: boolean = true;

  constructor(public source: string, public id: string, public displayedTest: string) {

  }

  setInvalid() {
    this.isValid = false;
  }
}

class CoordinatesConverter {
  // --------------------------------------------------------------------------
  // Reference: Solutions approchees pour la transformation de coordonnees
  // CH1903-WGS84, Office federal de topographie swisstopo, Octobre 2005.
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // A few precise points to check the algorithm:
  //
  // Location        Easting     Northing    Height    Longitude (E)  Latitude (N)    Height
  // -----------------------------------------------------------------------------------------
  // Zimmerwald      602030.680  191775.030   897.915  7.46527319611  46.87709460056   947.149
  // Chrischona      617306.300  268507.300   456.064  7.66860641028  47.56705147250   504.935
  // Pfaender        776668.105  265372.681  1042.624  9.78436047861  47.51532577694  1089.372
  // La Givrine      497313.292  145625.438  1207.434  6.10203510028  46.45408056139  1258.274
  // Monte Generoso  722758.810   87649.670  1636.600  9.02121918139  45.92928833889  1685.027
  // --------------------------------------------------------------------------

  static ch1903ToWgs84(east: number, north: number): [number, number, number] {
    let eastmax = 880000;  // Swiss grid limits.
    let eastmin = 450000;
    let northmax = 330000;
    let northmin = 50000;

    if ((east < eastmin) || (east > eastmax) || isNaN(east))  // Test validity of input coordinates.
    {
      console.log(`Invalid easting: ${eastmin} < ${east} (easting) < ${eastmax}`);
    }
    if ((north < northmin) || (north > northmax) || isNaN(north))
    {
      console.log(`Invalid northing: ${northmin} < ${north} (northing) < ${northmax}`);
    }

    let hgt = 0;                                                // Transform coordinates.
    east -= 600000;                                             // Convert origin to "civil" system, where Bern has coordinates 0,0.
    north -= 200000;

    east /= 1E6;                                                // Express distances in 1000km units.
    north /= 1E6;

    let lon = 2.6779094;                                        // Calculate longitude in 10000" units.
    lon += 4.728982 * east;
    lon += 0.791484 * east * north;
    lon += 0.1306 * east * north * north;
    lon -= 0.0436 * east * east * east;

    let lat = 16.9023892;                                       // Calculate latitude in 10000" units.
    lat += 3.238272 * north;
    lat -= 0.270978 * east * east;
    lat -= 0.002528 * north * north;
    lat -= 0.0447 * east * east * north;
    lat -= 0.0140 * north * north * north;

    hgt += 49.55;                                               // Convert height [m].
    hgt -= 12.60 * east;
    hgt -= 22.64 * north;

    lon *= 100 / 36;                                            // Convert longitude and latitude back in degrees.
    lat *= 100 / 36;

    return [lon, lat, hgt];
  }

}
