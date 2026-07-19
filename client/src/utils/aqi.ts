export const aqiLevels = [
    { range: [0, 50], status: 'Good', color: '#00e400', textColor: '#000', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [51, 100], status: 'Moderate', color: '#ffff00', textColor: '#000', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [101, 150], status: 'Unhealthy for Sensitive', color: '#ff7e00', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [151, 200], status: 'Unhealthy', color: '#ff0000', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [201, 300], status: 'Very Unhealthy', color: '#8f3f97', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [301, Infinity], status: 'Hazardous', color: '#7e0023', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' }
];

const aqiLookup = new Array(502);

for (let aqi = 0; aqi <= 501; aqi++) {
    for (let j = 0; j < aqiLevels.length; j++) {
        if (aqi >= aqiLevels[j].range[0] && aqi <= aqiLevels[j].range[1]) {
            aqiLookup[aqi] = aqiLevels[j];
            break;
        }
    }
    if (!aqiLookup[aqi]) aqiLookup[aqi] = aqiLevels[aqiLevels.length - 1];
}

export function getAQIDetails(aqi: number) {
    const clamped = Math.min(Math.max(0, Math.round(aqi)), 501);
    return aqiLookup[clamped] || aqiLevels[aqiLevels.length - 1];
}
