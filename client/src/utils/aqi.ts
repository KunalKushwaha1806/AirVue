export interface AQILevel {
  range: [number, number];
  status: string;
  color: string;
  textColor: string;
  borderColor: string;
  advisory: string;
}

export const aqiLevels: AQILevel[] = [
  { 
    range: [0, 50], 
    status: 'Good', 
    color: '#10b981', 
    textColor: '#ffffff', 
    borderColor: 'rgba(16, 185, 129, 0.4)',
    advisory: 'Air quality is satisfactory. Safe for all outdoor activities.'
  },
  { 
    range: [51, 100], 
    status: 'Moderate', 
    color: '#f59e0b', 
    textColor: '#0f172a', 
    borderColor: 'rgba(245, 158, 11, 0.4)',
    advisory: 'Acceptable air quality. Exceptionally sensitive people should consider limiting heavy outdoor exertion.'
  },
  { 
    range: [101, 150], 
    status: 'Unhealthy for Sensitive', 
    color: '#f97316', 
    textColor: '#ffffff', 
    borderColor: 'rgba(249, 115, 22, 0.4)',
    advisory: 'Members of sensitive groups may experience health effects. General public less likely affected.'
  },
  { 
    range: [151, 200], 
    status: 'Unhealthy', 
    color: '#ef4444', 
    textColor: '#ffffff', 
    borderColor: 'rgba(239, 68, 68, 0.4)',
    advisory: 'Everyone may begin to experience health effects. Wear N95 masks during extended outdoor stays.'
  },
  { 
    range: [201, 300], 
    status: 'Very Unhealthy', 
    color: '#a855f7', 
    textColor: '#ffffff', 
    borderColor: 'rgba(168, 85, 247, 0.4)',
    advisory: 'Health alert: Increased risk of adverse effects in the entire population. Avoid outdoor exertion.'
  },
  { 
    range: [301, Infinity], 
    status: 'Hazardous', 
    color: '#881337', 
    textColor: '#ffffff', 
    borderColor: 'rgba(136, 19, 55, 0.5)',
    advisory: 'Emergency conditions! The entire population is likely affected. Keep windows closed and run air purifiers.'
  }
];

const aqiLookup: AQILevel[] = new Array(502);

for (let aqi = 0; aqi <= 501; aqi++) {
  for (let j = 0; j < aqiLevels.length; j++) {
    if (aqi >= aqiLevels[j].range[0] && aqi <= aqiLevels[j].range[1]) {
      aqiLookup[aqi] = aqiLevels[j];
      break;
    }
  }
  if (!aqiLookup[aqi]) aqiLookup[aqi] = aqiLevels[aqiLevels.length - 1];
}

export function getAQIDetails(aqi: number): AQILevel {
  const clamped = Math.min(Math.max(0, Math.round(aqi)), 501);
  return aqiLookup[clamped] || aqiLevels[aqiLevels.length - 1];
}
