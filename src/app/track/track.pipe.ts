import { Pipe, PipeTransform } from '@angular/core';

import { TrackInfo } from './track.service';

@Pipe({ name: 'matchKey' })
export class MatchKeyPipe implements PipeTransform {
  transform(trackInfos: TrackInfo[], searchKey: string) {
    return trackInfos.filter(trackInfo => trackInfo.displayedTest.toLowerCase().search(searchKey) >= 0);
  }
}
