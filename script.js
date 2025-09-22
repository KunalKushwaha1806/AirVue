let map;
let markerLayer; 
let heatmapLayer = null;
let currentView = 'global';
let globalAQIData = [];
let comparisonChart;

gsap.registerPlugin(ScrollToPlugin);

const aqiLevels = [
    { range: [0, 50], status: 'Good', color: '#00e400', textColor: '#000', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [51, 100], status: 'Moderate', color: '#ffff00', textColor: '#000', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [101, 150], status: 'Unhealthy for Sensitive', color: '#ff7e00', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [151, 200], status: 'Unhealthy', color: '#ff0000', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [201, 300], status: 'Very Unhealthy', color: '#8f3f97', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [301, Infinity], status: 'Hazardous', color: '#7e0023', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' }
];

const cityAreas = {
    'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Dwarka', 'Vasant Kunj', 'Chandni Chowk', 'India Gate', 'Lodi Road', 'Nehru Place'],
    'Mumbai': ['Bandra', 'Andheri', 'Borivali', 'Powai', 'Worli', 'Colaba', 'Juhu', 'Malad', 'Thane', 'Navi Mumbai'],
    'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Jayanagar', 'Malleshwaram', 'HSR Layout', 'BTM Layout', 'Marathahalli', 'Yelahanka'],
    'Chennai': ['T Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Tambaram', 'Porur', 'OMR', 'ECR', 'Mylapore', 'Guindy'],
    'Kolkata': ['Park Street', 'Salt Lake', 'Howrah', 'Ballygunge', 'Esplanade', 'Dum Dum', 'Tollygunge', 'New Town', 'Behala', 'Jadavpur'],
    'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'HITEC City', 'Secunderabad', 'Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'Dilsukhnagar', 'Ameerpet'],
    'Pune': ['Koregaon Park', 'Aundh', 'Baner', 'Hinjewadi', 'Kothrud', 'Deccan', 'Camp', 'Hadapsar', 'Wakad', 'Pimpri'],
    'Ahmedabad': ['Satellite', 'Bopal', 'Vastrapur', 'Navrangpura', 'Maninagar', 'Ghatlodia', 'Prahlad Nagar', 'SG Highway', 'CG Road', 'Sarkhej'],
    'Jaipur': ['Pink City', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'C-Scheme', 'Civil Lines', 'Sanganer', 'Tonk Road', 'MI Road'],
    'Lucknow': ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Aminabad', 'Chowk', 'Alambagh', 'Mahanagar', 'Kaiserbagh', 'Rajajipuram'],
    'Kanpur': ['Civil Lines', 'Swaroop Nagar', 'Kidwai Nagar', 'Govind Nagar', 'Kalyanpur', 'Barra', 'Kakadeo', 'Panki', 'Arya Nagar', 'Mall Road'],
    'Agra': ['Taj Ganj', 'Sadar Bazaar', 'Civil Lines', 'Dayalbagh', 'Sikandra', 'Kamla Nagar', 'Sanjay Place', 'Lohamandi', 'Raja Ki Mandi', 'Fatehabad Road'],
    'Varanasi': ['Godowlia', 'Lanka', 'Sigra', 'Mahmoorganj', 'Cantonment', 'Sarnath', 'Assi Ghat', 'Dashashwamedh', 'Maldahiya', 'Nadesar'],
    'Patna': ['Boring Road', 'Fraser Road', 'Kankarbagh', 'Rajendra Nagar', 'Patliputra', 'Danapur', 'Gandhi Maidan', 'Bankipore', 'Kurji', 'Digha'],
    'Indore': ['Vijay Nagar', 'Palasia', 'Bhopal Road', 'MG Road', 'Rajwada', 'Sarafa', 'Scheme 78', 'AB Road', 'Rau', 'Dewas Naka'],
    'Bhopal': ['New Market', 'MP Nagar', 'Arera Colony', 'TT Nagar', 'Shahpura', 'Kolar Road', 'Berasia Road', 'Hoshangabad Road', 'Raisen Road', 'Habibganj'],
    'Beijing': ['Chaoyang', 'Haidian', 'Xicheng', 'Dongcheng', 'Fengtai', 'Shijingshan', 'Mentougou', 'Fangshan', 'Tongzhou', 'Shunyi'],
    'London': ['Westminster', 'Camden', 'Kensington', 'Greenwich', 'Hackney', 'Tower Hamlets', 'Southwark', 'Lambeth', 'Wandsworth', 'Hammersmith'],
    'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Harlem', 'SoHo', 'Chelsea', 'Upper East Side', 'Lower East Side'],
    'Dubai': ['Downtown', 'Marina', 'JBR', 'Deira', 'Bur Dubai', 'Jumeirah', 'Business Bay', 'DIFC', 'JLT', 'Discovery Gardens']
};

const baseCities = [
    { city: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 }, { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 }, { city: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 }, { city: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 }, { city: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 }, { city: "Hyderabad", country: "India", lat: 17.3850, lng: 78.4867 }, { city: "Pune", country: "India", lat: 18.5204, lng: 73.8567 }, { city: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714 },
    { city: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 }, { city: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462 }, { city: "Kanpur", country: "India", lat: 26.4499, lng: 80.3319 }, { city: "Nagpur", country: "India", lat: 21.1458, lng: 79.0882 }, { city: "Indore", country: "India", lat: 22.7196, lng: 75.8577 }, { city: "Bhopal", country: "India", lat: 23.2599, lng: 77.4126 }, { city: "Patna", country: "India", lat: 25.5941, lng: 85.1376 }, { city: "Vadodara", country: "India", lat: 22.3072, lng: 73.1812 }, { city: "Ludhiana", country: "India", lat: 30.9010, lng: 75.8573 }, { city: "Agra", country: "India", lat: 27.1767, lng: 78.0081 }, { city: "Varanasi", country: "India", lat: 25.3176, lng: 82.9739 }, { city: "Srinagar", country: "India", lat: 34.0837, lng: 74.7973 }, { city: "Amritsar", country: "India", lat: 31.6340, lng: 74.8723 }, { city: "Ranchi", country: "India", lat: 23.3441, lng: 85.3096 }, { city: "Coimbatore", country: "India", lat: 11.0168, lng: 76.9558 }, { city: "Jabalpur", country: "India", lat: 23.1815, lng: 79.9864 }, { city: "Gwalior", country: "India", lat: 26.2183, lng: 78.1828 }, { city: "Vijayawada", country: "India", lat: 16.5062, lng: 80.6480 }, { city: "Jodhpur", country: "India", lat: 26.2389, lng: 73.0243 }, { city: "Madurai", country: "India", lat: 9.9252, lng: 78.1198 }, { city: "Raipur", country: "India", lat: 21.2514, lng: 81.6296 }, { city: "Kota", country: "India", lat: 25.2138, lng: 75.8648 }, { city: "Guwahati", country: "India", lat: 26.1445, lng: 91.7362 }, { city: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794 }, { city: "Bhubaneswar", country: "India", lat: 20.2961, lng: 85.8245 }, { city: "Mysore", country: "India", lat: 12.2958, lng: 76.6394 }, { city: "Gurgaon", country: "India", lat: 28.4595, lng: 77.0266 }, { city: "Jalandhar", country: "India", lat: 31.3260, lng: 75.5762 }, { city: "Thiruvananthapuram", country: "India", lat: 8.5241, lng: 76.9366 }, { city: "Kochi", country: "India", lat: 9.9312, lng: 76.2673 }, { city: "Dehradun", country: "India", lat: 30.3165, lng: 78.0322 }, { city: "Shimla", country: "India", lat: 31.1048, lng: 77.1734 },
    { city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 }, { city: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011 }, { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 }, { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 }, { city: "New York", country: "USA", lat: 40.7128, lng: -74.0060 }, { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 }, { city: "Dubai", country: "UAE", lat: 25.2770, lng: 55.2962 }
];

function getRandomArea(cityName) {
    const areas = cityAreas[cityName];
    if (areas && areas.length > 0) {
        return areas[Math.floor(Math.random() * areas.length)];
    }
    return null;
}

function generateDenseData(baseData, targetCount) {
    const data = [];
    const indiaCities = baseData.filter(c => c.country === 'India');
    const globalCities = baseData.filter(c => c.country !== 'India');
    const indiaTarget = Math.floor(targetCount * 0.95);
    for (let i = 0; i < targetCount; i++) {
        const base = (i < indiaTarget) 
            ? indiaCities[i % indiaCities.length] 
            : globalCities[i % globalCities.length];
        const spread = (base.country === 'India') ? 1.5 : 4.0;
        const latOffset = (Math.random() - 0.5) * spread;
        const lngOffset = (Math.random() - 0.5) * spread;
        let aqi;
        if(base.country === 'India'){
            aqi = Math.floor(Math.random() * 250) + 50; 
        } else {
            aqi = Math.floor(Math.random() * 200) + 1;
        }
        const area = getRandomArea(base.city);
        const locationName = area ? `${area}, ${base.city}` : base.city;
        data.push({
            city: base.city,
            locationName: locationName,
            country: base.country,
            lat: base.lat + latOffset,
            lng: base.lng + lngOffset,
            aqi: aqi
        });
    }
    return data;
}

function getAQIDetails(aqi) {
    return aqiLevels.find(level => aqi >= level.range[0] && aqi <= level.range[1]) || aqiLevels[aqiLevels.length - 1];
}

function createBackgroundParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particlesContainer.appendChild(particle);
    }
}

function populateLegend() {
    const legendContainer = document.getElementById('legend');
    let content = '<h3><i class="fas fa-palette"></i> AQI Scale</h3>';
    aqiLevels.forEach(level => {
        content += `
            <div class="legend-item">
                <div class="legend-color" style="background: ${level.color};"></div>
                <div class="legend-text">
                    <strong>${level.status}</strong>
                    ${level.range[0]}-${level.range[1] === Infinity ? '301+' : level.range[1]}
                </div>
            </div>`;
    });
    legendContainer.innerHTML = content;
}

function initMap() {
    map = L.map('map').setView([22.5, 82.0], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        minZoom: 2,
        maxZoom: 18
    }).addTo(map);
    globalAQIData = generateDenseData(baseCities, 3500);
    setTimeout(() => {
        renderAll();
        initComparisonChart();
        hideLoading();
        animateInUI();
        startLiveFeed();
    }, 2000);
}

function renderAll() {
    clearMap();
    if (currentView === 'global') {
        addGlobalMarkers();
    } else if (currentView === 'heatmap') {
        addHeatmap();
    }
    updateStats();
}

function addGlobalMarkers() {
    markerLayer = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 60,
        iconCreateFunction: function(cluster) {
            const childCount = cluster.getChildCount();
            let c = ' marker-cluster-';
            if (childCount < 100) { c += 'small'; } 
            else if (childCount < 1000) { c += 'medium'; } 
            else { c += 'large'; }
            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
        }
    });
    let i = 0;
    function processChunk() {
        const chunkSize = 250;
        for (let j = 0; j < chunkSize && i < globalAQIData.length; j++, i++) {
            const location = globalAQIData[i];
            const details = getAQIDetails(location.aqi);
            const icon = L.divIcon({
                className: 'aqi-marker-container',
                html: `<div class="aqi-marker" style="background-color: ${details.color}; color: ${details.textColor}; border-color: ${details.borderColor};">${location.aqi}</div>`,
                iconSize: [42, 30], iconAnchor: [21, 30], popupAnchor: [0, -30]
            });
            const marker = L.marker([location.lat, location.lng], { icon: icon });
            const popupContent = `
                <div class="custom-popup">
                    <div class="popup-title">${location.locationName}, ${location.country}</div>
                    <div class="popup-aqi" style="color: ${details.color};">AQI: ${location.aqi}</div>
                    <div class="popup-status" style="background-color: ${details.color}; color:${details.textColor}">${details.status}</div>
                </div>`;
            marker.bindPopup(popupContent);
            markerLayer.addLayer(marker);
        }
        if (i < globalAQIData.length) {
            requestAnimationFrame(processChunk);
        }
    }
    requestAnimationFrame(processChunk);
    map.addLayer(markerLayer);
}

function addHeatmap() {
    const heatData = globalAQIData.map(d => [d.lat, d.lng, d.aqi / 500]);
    heatmapLayer = L.heatLayer(heatData, {
        radius: 25, blur: 20, maxZoom: 12,
        gradient: { 0.0: '#00e400', 0.2: '#ffff00', 0.4: '#ff7e00', 0.6: '#ff0000', 0.8: '#8f3f97', 1.0: '#7e0023' }
    }).addTo(map);
    gsap.fromTo(heatmapLayer._canvas, { opacity: 0 }, { opacity: 0.8, duration: 1 });
}

function clearMap() {
    if (markerLayer) { map.removeLayer(markerLayer); markerLayer = null; }
    if (heatmapLayer) { map.removeLayer(heatmapLayer); heatmapLayer = null; }
}

function updateStats() {
    const totalStations = globalAQIData.length;
    const avgAQI = Math.round(globalAQIData.reduce((sum, city) => sum + city.aqi, 0) / totalStations);
    const goodAir = globalAQIData.filter(city => city.aqi <= 50).length;
    const hazardousAir = globalAQIData.filter(city => city.aqi > 300).length;
    const stats = { totalStations, avgAQI, goodAir, hazardousAir };
    const container = document.getElementById('statsGrid');
    container.innerHTML = `
        <div class="stat-item"><div class="stat-number" data-stat="totalStations">0</div><div class="stat-label">Stations</div></div>
        <div class="stat-item"><div class="stat-number" data-stat="avgAQI">0</div><div class="stat-label">Avg AQI</div></div>
        <div class="stat-item"><div class="stat-number" data-stat="goodAir">0</div><div class="stat-label">Good Air</div></div>
        <div class="stat-item"><div class="stat-number" data-stat="hazardousAir">0</div><div class="stat-label">Hazardous</div></div>
    `;
    for (const key in stats) {
        gsap.to(container.querySelector(`[data-stat="${key}"]`), {
            duration: 2, innerText: stats[key], roundProps: "innerText", ease: "power2.out", delay: 0.5
        });
    }
}

function startLiveFeed() {
    const feedElement = document.getElementById('liveFeed');
    function addUpdate(message, aqiLevel) {
        const details = getAQIDetails(aqiLevel);
        const time = new Date().toLocaleTimeString();
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.style.borderLeftColor = details.color;
        item.innerHTML = `<div class="feed-time">${time}</div><div class="feed-content">${message}</div>`;
        feedElement.prepend(item);
        gsap.to(item, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
        if (feedElement.children.length > 12) {
            gsap.to(feedElement.lastChild, { 
                opacity: 0, height: 0, margin: 0, padding: 0, duration: 0.4, 
                onComplete: () => feedElement.lastChild.remove() 
            });
        }
    }
    setTimeout(() => addUpdate("System initialized successfully", 50), 1000);
    setTimeout(() => addUpdate("Delhi AQI alert: 285 - Very Unhealthy", 285), 2000);
    setTimeout(() => addUpdate("Shimla maintains excellent air: 35", 35), 3000);
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * globalAQIData.length);
        const randomStation = globalAQIData[randomIndex];
        const newAQI = Math.max(0, randomStation.aqi + Math.floor(Math.random() * 20) - 10);
        globalAQIData[randomIndex].aqi = newAQI;
        addUpdate(`${randomStation.locationName} updated: ${newAQI}`, newAQI);
    }, 4000);
    setInterval(updateComparisonChart, 5000);
}

function setView(view, btn) {
    if (currentView === view) return;
    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = view;
    renderAll();
    map.flyTo([22.5, 82.0], 5, { duration: 1.5 });
}

function refreshData() {
    showLoading();
    setTimeout(() => {
        globalAQIData = generateDenseData(baseCities, 3500);
        renderAll();
        updateComparisonChart();
        hideLoading();
        const feedElement = document.getElementById('liveFeed');
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.style.borderLeftColor = '#4facfe';
        item.innerHTML = `<div class="feed-time">${new Date().toLocaleTimeString()}</div><div class="feed-content">Data refreshed - 3,500 stations updated</div>`;
        feedElement.prepend(item);
        gsap.to(item, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
    }, 1500);
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    gsap.to(overlay, { opacity: 1, duration: 0.4 });
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    gsap.to(overlay, { opacity: 0, duration: 0.6, onComplete: () => overlay.style.display = 'none' });
}

function animateInUI() {
    const tl = gsap.timeline();
    tl.to('.header', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
      .to('.map-container', { opacity: 1, scale: 1, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, "-=0.8")
      .to('.panel-card', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, "-=0.6");
}

function scrollToTop() {
    gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: "power2.out" });
}

function initComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const topCities = [...globalAQIData].sort((a, b) => b.aqi - a.aqi).slice(0, 15);

    const data = {
        labels: topCities.map(c => c.locationName),
        datasets: [{
            label: 'AQI',
            data: topCities.map(c => c.aqi),
            backgroundColor: topCities.map(c => getAQIDetails(c.aqi).color),
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            borderRadius: 5,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)'
                }
            }
        }
    };

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function updateComparisonChart() {
    if (!comparisonChart) return;
    const topCities = [...globalAQIData].sort((a, b) => b.aqi - a.aqi).slice(0, 15);
    comparisonChart.data.labels = topCities.map(c => c.locationName);
    comparisonChart.data.datasets[0].data = topCities.map(c => c.aqi);
    comparisonChart.data.datasets[0].backgroundColor = topCities.map(c => getAQIDetails(c.aqi).color);
    comparisonChart.update();
}

document.addEventListener('DOMContentLoaded', function() {
    createBackgroundParticles();
    populateLegend();
    initMap();
});