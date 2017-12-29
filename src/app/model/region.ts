import { GeoDataInfo } from "./geodata";

export class Region {
  id: number;
  name: string;
  description?: string;
  center: number[];
  data: GeoDataInfo[];
}

export const REGIONS: Region[] = [
  {
    id: 0,
    name: 'Paris',
    description: '',
    center: [48.8571, 2.3507],
    data: [
      {
        type: 'unemployment',
        year: '2014'
      },
      {
        type: 'crime',
        year: '2014'
      },
      {
        type: 'revenue',
        year: '2014'
      }
    ]
  }
];
