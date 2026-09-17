import type { Station, Stats, FeedItem } from '../types/station';

// Pre-packaged fallback telemetry for static or cold-start deployments
export const fallbackHubs = [
  { city: 'Delhi', state: 'Delhi', baseAQI: 310, lat: 28.6469, lng: 77.3160, area: 'Anand Vihar' },
  { city: 'Delhi', state: 'Delhi', baseAQI: 295, lat: 28.6692, lng: 77.1328, area: 'Punjabi Bagh' },
  { city: 'Delhi', state: 'Delhi', baseAQI: 280, lat: 28.5660, lng: 77.1767, area: 'RK Puram' },
  { city: 'Mumbai', state: 'Maharashtra', baseAQI: 145, lat: 19.0664, lng: 72.8688, area: 'BKC' },
  { city: 'Mumbai', state: 'Maharashtra', baseAQI: 135, lat: 18.9150, lng: 72.8258, area: 'Colaba' },
  { city: 'Bengaluru', state: 'Karnataka', baseAQI: 72, lat: 12.9177, lng: 77.6238, area: 'Silk Board' },
  { city: 'Bengaluru', state: 'Karnataka', baseAQI: 68, lat: 12.9863, lng: 77.7338, area: 'Whitefield' },
  { city: 'Kolkata', state: 'West Bengal', baseAQI: 195, lat: 22.5448, lng: 88.3426, area: 'Victoria Memorial' },
  { city: 'Chennai', state: 'Tamil Nadu', baseAQI: 78, lat: 13.0033, lng: 80.2012, area: 'Alandur' },
  { city: 'Hyderabad', state: 'Telangana', baseAQI: 120, lat: 17.4474, lng: 78.3762, area: 'HITEC City' },
  { city: 'Pune', state: 'Maharashtra', baseAQI: 110, lat: 18.5314, lng: 73.8446, area: 'Shivaji Nagar' },
  { city: 'Ahmedabad', state: 'Gujarat', baseAQI: 165, lat: 23.0021, lng: 72.6047, area: 'Maninagar' },
  { city: 'Jaipur', state: 'Rajasthan', baseAQI: 175, lat: 26.9030, lng: 75.8340, area: 'Adarsh Nagar' },
  { city: 'Lucknow', state: 'Uttar Pradesh', baseAQI: 240, lat: 26.8506, lng: 80.9512, area: 'Hazratganj' },
  { city: 'Patna', state: 'Bihar', baseAQI: 270, lat: 25.6250, lng: 85.0450, area: 'Danapur' },
  { city: 'Shimla', state: 'Himachal Pradesh', baseAQI: 32, lat: 31.1048, lng: 77.1734, area: 'The Ridge' },
  { city: 'Srinagar', state: 'Jammu and Kashmir', baseAQI: 42, lat: 34.0910, lng: 74.8450, area: 'Dal Lake' },
  { city: 'Kochi', state: 'Kerala', baseAQI: 52, lat: 9.9816, lng: 76.2753, area: 'Marine Drive' }
];

export function getFallbackStations(): Station[] {
  const stations: Station[] = [];
  let id = 0;

  fallbackHubs.forEach(hub => {
    for (let i = 0; i < 25; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.03;
      const offsetLng = (Math.random() - 0.5) * 0.03;
      const aqi = Math.max(15, Math.min(490, hub.baseAQI + Math.floor((Math.random() * 30) - 15)));
      const pm25 = Math.round(aqi * 0.62);
      const pm10 = Math.round(pm25 * 1.75);

      stations.push({
        id: id++,
        city: hub.city,
        locationName: i > 0 ? `${hub.area} Stn #${i + 1}` : hub.area,
        fullName: `${hub.area}, ${hub.city}`,
        state: hub.state,
        country: 'India',
        isGlobal: false,
        lat: +(hub.lat + offsetLat).toFixed(5),
        lng: +(hub.lng + offsetLng).toFixed(5),
        aqi,
        pm25,
        pm10,
        no2: Math.round(aqi * 0.28),
        temperature: 28,
        humidity: 55
      });
    }
  });

  return stations;
}

export function getFallbackStats(stations: Station[]): Stats {
  const total = stations.length;
  let sum = 0, good = 0, haz = 0, mod = 0, unh = 0;

  stations.forEach(s => {
    sum += s.aqi;
    if (s.aqi <= 50) good++;
    else if (s.aqi <= 100) mod++;
    else if (s.aqi > 200 && s.aqi <= 300) unh++;
    else if (s.aqi > 300) haz++;
  });

  return {
    totalStations: total,
    avgAQI: Math.round(sum / Math.max(1, total)),
    goodAir: good,
    moderateAir: mod,
    unhealthyAir: unh,
    hazardousAir: haz,
    safePercent: Math.round(((good + mod) / Math.max(1, total)) * 100)
  };
}

export const fallbackFeed: FeedItem[] = [
  { time: '12:00:00', message: 'Telemetry grid synchronized (Vercel Network)', aqi: 45, city: 'National Network' },
  { time: '12:00:05', message: 'Delhi NCR: Elevated inversion layer detected (AQI 324)', aqi: 324, city: 'Delhi' },
  { time: '12:00:10', message: 'Shimla Ridge: Clean mountain airflow registered (AQI 28)', aqi: 28, city: 'Shimla' }
];
