export interface Station {
  id: number;
  city: string;
  locationName: string;
  fullName: string;
  state: string;
  country: string;
  isGlobal?: boolean;
  lat: number;
  lng: number;
  aqi: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  temperature?: number;
  humidity?: number;
}

export interface Stats {
  totalStations: number;
  avgAQI: number;
  goodAir: number;
  moderateAir?: number;
  unhealthyAir?: number;
  hazardousAir: number;
  safePercent?: number;
}

export interface FeedItem {
  time: string;
  message: string;
  aqi: number;
  city?: string;
  stationId?: number;
}

export type ViewMode = 'india' | 'global' | 'heatmap';
export type BasemapMode = 'dark' | 'satellite' | 'streets';
