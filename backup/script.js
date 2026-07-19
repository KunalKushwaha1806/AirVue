let map;
let markerLayer; 
let heatmapLayer = null;
let currentView = 'global';
let globalAQIData = [];
let comparisonChart;

// --- Optimization #6: Cache DOM references ---
let domCache = {};

// --- Optimization #5: Page Visibility API ---
let feedIntervalId = null;
let chartIntervalId = null;
let isPageVisible = true;

const aqiLevels = [
    { range: [0, 50], status: 'Good', color: '#00e400', textColor: '#000', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [51, 100], status: 'Moderate', color: '#ffff00', textColor: '#000', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [101, 150], status: 'Unhealthy for Sensitive', color: '#ff7e00', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [151, 200], status: 'Unhealthy', color: '#ff0000', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [201, 300], status: 'Very Unhealthy', color: '#8f3f97', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' },
    { range: [301, Infinity], status: 'Hazardous', color: '#7e0023', textColor: '#fff', borderColor: 'rgba(0,0,0,0.2)' }
];

// --- Optimization #1: O(1) AQI lookup via precomputed table ---
const aqiLookup = new Array(502);
(function buildAQILookup() {
    for (let aqi = 0; aqi <= 501; aqi++) {
        for (let j = 0; j < aqiLevels.length; j++) {
            if (aqi >= aqiLevels[j].range[0] && aqi <= aqiLevels[j].range[1]) {
                aqiLookup[aqi] = aqiLevels[j];
                break;
            }
        }
        if (!aqiLookup[aqi]) aqiLookup[aqi] = aqiLevels[aqiLevels.length - 1];
    }
})();

function getAQIDetails(aqi) {
    const clamped = Math.min(Math.max(0, Math.round(aqi)), 501);
    return aqiLookup[clamped];
}

const cityAreas = {
    'Delhi': [
        { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
        { name: 'Karol Bagh', lat: 28.6519, lng: 77.1905 },
        { name: 'Lajpat Nagar', lat: 28.5677, lng: 77.2433 },
        { name: 'Rohini', lat: 28.7496, lng: 77.0654 },
        { name: 'Dwarka', lat: 28.5921, lng: 77.0460 },
        { name: 'Vasant Kunj', lat: 28.5193, lng: 77.1571 },
        { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2334 },
        { name: 'India Gate', lat: 28.6129, lng: 77.2295 },
        { name: 'Lodi Road', lat: 28.5933, lng: 77.2252 },
        { name: 'Nehru Place', lat: 28.5494, lng: 77.2517 }
    ],
    'Mumbai': [
        { name: 'Bandra', lat: 19.0596, lng: 72.8295 },
        { name: 'Andheri', lat: 19.1197, lng: 72.8464 },
        { name: 'Borivali', lat: 19.2307, lng: 72.8567 },
        { name: 'Powai', lat: 19.1176, lng: 72.9060 },
        { name: 'Worli', lat: 19.0176, lng: 72.8150 },
        { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
        { name: 'Juhu', lat: 19.1075, lng: 72.8263 },
        { name: 'Malad', lat: 19.1874, lng: 72.8484 },
        { name: 'Thane', lat: 19.2183, lng: 72.9781 },
        { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 }
    ],
    'Bangalore': [
        { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
        { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
        { name: 'Whitefield', lat: 12.9698, lng: 77.7500 },
        { name: 'Electronic City', lat: 12.8440, lng: 77.6600 },
        { name: 'Jayanagar', lat: 12.9308, lng: 77.5838 },
        { name: 'Malleshwaram', lat: 13.0035, lng: 77.5647 },
        { name: 'HSR Layout', lat: 12.9116, lng: 77.6474 },
        { name: 'BTM Layout', lat: 12.9166, lng: 77.6101 },
        { name: 'Marathahalli', lat: 12.9591, lng: 77.7009 },
        { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 }
    ],
    'Chennai': [
        { name: 'T Nagar', lat: 13.0418, lng: 80.2341 },
        { name: 'Adyar', lat: 13.0063, lng: 80.2574 },
        { name: 'Velachery', lat: 12.9815, lng: 80.2180 },
        { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
        { name: 'Tambaram', lat: 12.9249, lng: 80.1000 },
        { name: 'Porur', lat: 13.0382, lng: 80.1564 },
        { name: 'OMR', lat: 12.9600, lng: 80.2500 },
        { name: 'ECR', lat: 12.9800, lng: 80.2600 },
        { name: 'Mylapore', lat: 13.0339, lng: 80.2676 },
        { name: 'Guindy', lat: 13.0067, lng: 80.2206 }
    ],
    'Kolkata': [
        { name: 'Park Street', lat: 22.5509, lng: 88.3521 },
        { name: 'Salt Lake', lat: 22.5958, lng: 88.4012 },
        { name: 'Howrah', lat: 22.5958, lng: 88.2636 },
        { name: 'Ballygunge', lat: 22.5292, lng: 88.3634 },
        { name: 'Esplanade', lat: 22.5636, lng: 88.3519 },
        { name: 'Dum Dum', lat: 22.6228, lng: 88.4267 },
        { name: 'Tollygunge', lat: 22.4988, lng: 88.3479 },
        { name: 'New Town', lat: 22.5800, lng: 88.4800 },
        { name: 'Behala', lat: 22.4889, lng: 88.3091 },
        { name: 'Jadavpur', lat: 22.4988, lng: 88.3705 }
    ],
    'Hyderabad': [
        { name: 'Banjara Hills', lat: 17.4156, lng: 78.4347 },
        { name: 'Jubilee Hills', lat: 17.4318, lng: 78.4076 },
        { name: 'HITEC City', lat: 17.4435, lng: 78.3772 },
        { name: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
        { name: 'Gachibowli', lat: 17.4401, lng: 78.3489 },
        { name: 'Madhapur', lat: 17.4484, lng: 78.3908 },
        { name: 'Kondapur', lat: 17.4577, lng: 78.3685 },
        { name: 'Kukatpally', lat: 17.4849, lng: 78.3997 },
        { name: 'Dilsukhnagar', lat: 17.3688, lng: 78.5247 },
        { name: 'Ameerpet', lat: 17.4375, lng: 78.4483 }
    ],
    'Pune': [
        { name: 'Koregaon Park', lat: 18.5362, lng: 73.8930 },
        { name: 'Aundh', lat: 18.5584, lng: 73.8076 },
        { name: 'Baner', lat: 18.5590, lng: 73.7868 },
        { name: 'Hinjewadi', lat: 18.5913, lng: 73.7389 },
        { name: 'Kothrud', lat: 18.5075, lng: 73.8077 },
        { name: 'Deccan', lat: 18.5175, lng: 73.8390 },
        { name: 'Camp', lat: 18.5130, lng: 73.8794 },
        { name: 'Hadapsar', lat: 18.5089, lng: 73.9260 },
        { name: 'Wakad', lat: 18.5987, lng: 73.7613 },
        { name: 'Pimpri', lat: 18.6298, lng: 73.7997 }
    ],
    'Ahmedabad': [
        { name: 'Satellite', lat: 23.0269, lng: 72.5299 },
        { name: 'Bopal', lat: 23.0347, lng: 72.4645 },
        { name: 'Vastrapur', lat: 23.0369, lng: 72.5272 },
        { name: 'Navrangpura', lat: 23.0394, lng: 72.5569 },
        { name: 'Maninagar', lat: 23.0021, lng: 72.6047 },
        { name: 'Ghatlodia', lat: 23.0621, lng: 72.5434 },
        { name: 'Prahlad Nagar', lat: 23.0147, lng: 72.5130 },
        { name: 'SG Highway', lat: 23.0337, lng: 72.5067 },
        { name: 'CG Road', lat: 23.0289, lng: 72.5660 },
        { name: 'Sarkhej', lat: 22.9853, lng: 72.4976 }
    ],
    'Jaipur': [
        { name: 'Pink City', lat: 26.9237, lng: 75.8267 },
        { name: 'Malviya Nagar', lat: 26.8551, lng: 75.8049 },
        { name: 'Vaishali Nagar', lat: 26.9103, lng: 75.7350 },
        { name: 'Mansarovar', lat: 26.8673, lng: 75.7620 },
        { name: 'Jagatpura', lat: 26.8500, lng: 75.8310 },
        { name: 'C-Scheme', lat: 26.9050, lng: 75.7867 },
        { name: 'Civil Lines', lat: 26.9300, lng: 75.8050 },
        { name: 'Sanganer', lat: 26.8306, lng: 75.7837 },
        { name: 'Tonk Road', lat: 26.8700, lng: 75.8000 },
        { name: 'MI Road', lat: 26.9168, lng: 75.8021 }
    ],
    'Lucknow': [
        { name: 'Hazratganj', lat: 26.8506, lng: 80.9512 },
        { name: 'Gomti Nagar', lat: 26.8566, lng: 80.9917 },
        { name: 'Aliganj', lat: 26.8894, lng: 80.9387 },
        { name: 'Indira Nagar', lat: 26.8728, lng: 80.9929 },
        { name: 'Aminabad', lat: 26.8537, lng: 80.9253 },
        { name: 'Chowk', lat: 26.8603, lng: 80.9128 },
        { name: 'Alambagh', lat: 26.8149, lng: 80.9068 },
        { name: 'Mahanagar', lat: 26.8764, lng: 80.9359 },
        { name: 'Kaiserbagh', lat: 26.8491, lng: 80.9392 },
        { name: 'Rajajipuram', lat: 26.8571, lng: 80.8883 }
    ],
    'Kanpur': [
        { name: 'Civil Lines', lat: 26.4612, lng: 80.3321 },
        { name: 'Swaroop Nagar', lat: 26.4571, lng: 80.3445 },
        { name: 'Kidwai Nagar', lat: 26.4429, lng: 80.3395 },
        { name: 'Govind Nagar', lat: 26.4680, lng: 80.3410 },
        { name: 'Kalyanpur', lat: 26.4500, lng: 80.2900 },
        { name: 'Barra', lat: 26.4300, lng: 80.3200 },
        { name: 'Kakadeo', lat: 26.4362, lng: 80.3600 },
        { name: 'Panki', lat: 26.4650, lng: 80.2700 },
        { name: 'Arya Nagar', lat: 26.4550, lng: 80.3250 },
        { name: 'Mall Road', lat: 26.4600, lng: 80.3380 }
    ],
    'Agra': [
        { name: 'Taj Ganj', lat: 27.1710, lng: 78.0421 },
        { name: 'Sadar Bazaar', lat: 27.1900, lng: 78.0000 },
        { name: 'Civil Lines', lat: 27.2000, lng: 78.0100 },
        { name: 'Dayalbagh', lat: 27.2200, lng: 78.0050 },
        { name: 'Sikandra', lat: 27.2188, lng: 77.9500 },
        { name: 'Kamla Nagar', lat: 27.1950, lng: 78.0200 },
        { name: 'Sanjay Place', lat: 27.1900, lng: 78.0100 },
        { name: 'Lohamandi', lat: 27.1800, lng: 78.0200 },
        { name: 'Raja Ki Mandi', lat: 27.1850, lng: 78.0100 },
        { name: 'Fatehabad Road', lat: 27.1670, lng: 78.0300 }
    ],
    'Varanasi': [
        { name: 'Godowlia', lat: 25.3114, lng: 83.0100 },
        { name: 'Lanka', lat: 25.2800, lng: 82.9900 },
        { name: 'Sigra', lat: 25.3200, lng: 82.9800 },
        { name: 'Mahmoorganj', lat: 25.3100, lng: 82.9600 },
        { name: 'Cantonment', lat: 25.3300, lng: 82.9500 },
        { name: 'Sarnath', lat: 25.3736, lng: 83.0257 },
        { name: 'Assi Ghat', lat: 25.2900, lng: 83.0000 },
        { name: 'Dashashwamedh', lat: 25.3100, lng: 83.0100 },
        { name: 'Maldahiya', lat: 25.3150, lng: 82.9850 },
        { name: 'Nadesar', lat: 25.3250, lng: 82.9900 }
    ],
    'Patna': [
        { name: 'Boring Road', lat: 25.6078, lng: 85.1225 },
        { name: 'Fraser Road', lat: 25.6100, lng: 85.1400 },
        { name: 'Kankarbagh', lat: 25.5867, lng: 85.1200 },
        { name: 'Rajendra Nagar', lat: 25.6105, lng: 85.1050 },
        { name: 'Patliputra', lat: 25.6200, lng: 85.1000 },
        { name: 'Danapur', lat: 25.6200, lng: 85.0500 },
        { name: 'Gandhi Maidan', lat: 25.6130, lng: 85.1459 },
        { name: 'Bankipore', lat: 25.6150, lng: 85.1500 },
        { name: 'Kurji', lat: 25.6300, lng: 85.1100 },
        { name: 'Digha', lat: 25.6250, lng: 85.1050 }
    ],
    'Indore': [
        { name: 'Vijay Nagar', lat: 22.7533, lng: 75.8930 },
        { name: 'Palasia', lat: 22.7232, lng: 75.8743 },
        { name: 'Bhopal Road', lat: 22.7500, lng: 75.9000 },
        { name: 'MG Road', lat: 22.7196, lng: 75.8577 },
        { name: 'Rajwada', lat: 22.7185, lng: 75.8552 },
        { name: 'Sarafa', lat: 22.7174, lng: 75.8566 },
        { name: 'Scheme 78', lat: 22.7300, lng: 75.8900 },
        { name: 'AB Road', lat: 22.7100, lng: 75.8700 },
        { name: 'Rau', lat: 22.6700, lng: 75.8700 },
        { name: 'Dewas Naka', lat: 22.7500, lng: 75.8500 }
    ],
    'Bhopal': [
        { name: 'New Market', lat: 23.2335, lng: 77.4230 },
        { name: 'MP Nagar', lat: 23.2330, lng: 77.4310 },
        { name: 'Arera Colony', lat: 23.2200, lng: 77.4400 },
        { name: 'TT Nagar', lat: 23.2400, lng: 77.4100 },
        { name: 'Shahpura', lat: 23.2100, lng: 77.4400 },
        { name: 'Kolar Road', lat: 23.1850, lng: 77.4300 },
        { name: 'Berasia Road', lat: 23.2900, lng: 77.4000 },
        { name: 'Hoshangabad Road', lat: 23.2000, lng: 77.4700 },
        { name: 'Raisen Road', lat: 23.2600, lng: 77.4600 },
        { name: 'Habibganj', lat: 23.2292, lng: 77.4395 }
    ],
    'Beijing': [
        { name: 'Chaoyang', lat: 39.9219, lng: 116.4435 },
        { name: 'Haidian', lat: 39.9599, lng: 116.2982 },
        { name: 'Xicheng', lat: 39.9122, lng: 116.3662 },
        { name: 'Dongcheng', lat: 39.9283, lng: 116.4163 },
        { name: 'Fengtai', lat: 39.8585, lng: 116.2870 },
        { name: 'Shijingshan', lat: 39.9046, lng: 116.2225 },
        { name: 'Mentougou', lat: 39.9405, lng: 116.1014 },
        { name: 'Fangshan', lat: 39.7472, lng: 116.1430 },
        { name: 'Tongzhou', lat: 39.9022, lng: 116.6569 },
        { name: 'Shunyi', lat: 40.1302, lng: 116.6543 }
    ],
    'London': [
        { name: 'Westminster', lat: 51.4975, lng: -0.1357 },
        { name: 'Camden', lat: 51.5390, lng: -0.1426 },
        { name: 'Kensington', lat: 51.5017, lng: -0.1912 },
        { name: 'Greenwich', lat: 51.4834, lng: 0.0098 },
        { name: 'Hackney', lat: 51.5450, lng: -0.0553 },
        { name: 'Tower Hamlets', lat: 51.5203, lng: -0.0293 },
        { name: 'Southwark', lat: 51.5031, lng: -0.0906 },
        { name: 'Lambeth', lat: 51.4571, lng: -0.1231 },
        { name: 'Wandsworth', lat: 51.4567, lng: -0.1910 },
        { name: 'Hammersmith', lat: 51.4927, lng: -0.2239 }
    ],
    'New York': [
        { name: 'Manhattan', lat: 40.7831, lng: -73.9712 },
        { name: 'Brooklyn', lat: 40.6782, lng: -73.9442 },
        { name: 'Queens', lat: 40.7282, lng: -73.7949 },
        { name: 'Bronx', lat: 40.8448, lng: -73.8648 },
        { name: 'Staten Island', lat: 40.5795, lng: -74.1502 },
        { name: 'Harlem', lat: 40.8116, lng: -73.9465 },
        { name: 'SoHo', lat: 40.7233, lng: -73.9983 },
        { name: 'Chelsea', lat: 40.7465, lng: -74.0014 },
        { name: 'Upper East Side', lat: 40.7736, lng: -73.9566 },
        { name: 'Lower East Side', lat: 40.7150, lng: -73.9843 }
    ],
    'Dubai': [
        { name: 'Downtown', lat: 25.1972, lng: 55.2744 },
        { name: 'Marina', lat: 25.0805, lng: 55.1403 },
        { name: 'JBR', lat: 25.0774, lng: 55.1326 },
        { name: 'Deira', lat: 25.2750, lng: 55.3096 },
        { name: 'Bur Dubai', lat: 25.2567, lng: 55.2980 },
        { name: 'Jumeirah', lat: 25.2098, lng: 55.2557 },
        { name: 'Business Bay', lat: 25.1860, lng: 55.2619 },
        { name: 'DIFC', lat: 25.2048, lng: 55.2708 },
        { name: 'JLT', lat: 25.0754, lng: 55.1442 },
        { name: 'Discovery Gardens', lat: 25.0369, lng: 55.1476 }
    ]
};

const baseCities = [
    { city: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 }, { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 }, { city: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 }, { city: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 }, { city: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 }, { city: "Hyderabad", country: "India", lat: 17.3850, lng: 78.4867 }, { city: "Pune", country: "India", lat: 18.5204, lng: 73.8567 }, { city: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714 },
    { city: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 }, { city: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462 }, { city: "Kanpur", country: "India", lat: 26.4499, lng: 80.3319 }, { city: "Nagpur", country: "India", lat: 21.1458, lng: 79.0882 }, { city: "Indore", country: "India", lat: 22.7196, lng: 75.8577 }, { city: "Bhopal", country: "India", lat: 23.2599, lng: 77.4126 }, { city: "Patna", country: "India", lat: 25.5941, lng: 85.1376 }, { city: "Vadodara", country: "India", lat: 22.3072, lng: 73.1812 }, { city: "Ludhiana", country: "India", lat: 30.9010, lng: 75.8573 }, { city: "Agra", country: "India", lat: 27.1767, lng: 78.0081 }, { city: "Varanasi", country: "India", lat: 25.3176, lng: 82.9739 }, { city: "Srinagar", country: "India", lat: 34.0837, lng: 74.7973 }, { city: "Amritsar", country: "India", lat: 31.6340, lng: 74.8723 }, { city: "Ranchi", country: "India", lat: 23.3441, lng: 85.3096 }, { city: "Coimbatore", country: "India", lat: 11.0168, lng: 76.9558 }, { city: "Jabalpur", country: "India", lat: 23.1815, lng: 79.9864 }, { city: "Gwalior", country: "India", lat: 26.2183, lng: 78.1828 }, { city: "Vijayawada", country: "India", lat: 16.5062, lng: 80.6480 }, { city: "Jodhpur", country: "India", lat: 26.2389, lng: 73.0243 }, { city: "Madurai", country: "India", lat: 9.9252, lng: 78.1198 }, { city: "Raipur", country: "India", lat: 21.2514, lng: 81.6296 }, { city: "Kota", country: "India", lat: 25.2138, lng: 75.8648 }, { city: "Guwahati", country: "India", lat: 26.1445, lng: 91.7362 }, { city: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794 }, { city: "Bhubaneswar", country: "India", lat: 20.2961, lng: 85.8245 }, { city: "Mysore", country: "India", lat: 12.2958, lng: 76.6394 }, { city: "Gurgaon", country: "India", lat: 28.4595, lng: 77.0266 }, { city: "Jalandhar", country: "India", lat: 31.3260, lng: 75.5762 }, { city: "Thiruvananthapuram", country: "India", lat: 8.5241, lng: 76.9366 }, { city: "Kochi", country: "India", lat: 9.9312, lng: 76.2673 }, { city: "Dehradun", country: "India", lat: 30.3165, lng: 78.0322 }, { city: "Shimla", country: "India", lat: 31.1048, lng: 77.1734 },
    { city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 }, { city: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011 }, { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 }, { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 }, { city: "New York", country: "USA", lat: 40.7128, lng: -74.0060 }, { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 }, { city: "Dubai", country: "UAE", lat: 25.2770, lng: 55.2962 }
];

// --- Optimization #8: Pre-split city arrays ---
const indiaCities = baseCities.filter(c => c.country === 'India');
const globalCities = baseCities.filter(c => c.country !== 'India');

function getRandomArea(cityName) {
    const areas = cityAreas[cityName];
    if (areas && areas.length > 0) {
        return areas[Math.floor(Math.random() * areas.length)];
    }
    return null;
}

function generateDenseData(targetCount) {
    const data = new Array(targetCount);
    const indiaTarget = Math.floor(targetCount * 0.95);
    const indiaLen = indiaCities.length;
    const globalLen = globalCities.length;
    for (let i = 0; i < targetCount; i++) {
        const base = (i < indiaTarget) 
            ? indiaCities[i % indiaLen] 
            : globalCities[(i - indiaTarget) % globalLen];
        const aqi = (base.country === 'India')
            ? (Math.random() * 250 + 50) | 0
            : (Math.random() * 200 + 1) | 0;
        const area = getRandomArea(base.city);
        let lat, lng, locationName;
        if (area) {
            lat = area.lat + (Math.random() - 0.5) * 0.02;
            lng = area.lng + (Math.random() - 0.5) * 0.02;
            locationName = `${area.name}, ${base.city}`;
        } else {
            const spread = (base.country === 'India') ? 0.3 : 0.5;
            lat = base.lat + (Math.random() - 0.5) * spread;
            lng = base.lng + (Math.random() - 0.5) * spread;
            locationName = base.city;
        }
        data[i] = {
            city: base.city,
            locationName: locationName,
            country: base.country,
            lat: lat,
            lng: lng,
            aqi: aqi
        };
    }
    return data;
}

// --- Optimization #9: Particle count reduction on mobile ---
function createBackgroundParticles() {
    const particlesContainer = domCache.particles;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
}

function populateLegend() {
    const legendContainer = domCache.legend;
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
    globalAQIData = generateDenseData(3500);
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

// --- Optimization #4: Lazy popup binding ---
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
        const chunkSize = 500; // Larger chunks = fewer rAF cycles
        for (let j = 0; j < chunkSize && i < globalAQIData.length; j++, i++) {
            const location = globalAQIData[i];
            const details = getAQIDetails(location.aqi);
            const icon = L.divIcon({
                className: 'aqi-marker-container',
                html: `<div class="aqi-marker" style="background-color: ${details.color}; color: ${details.textColor}; border-color: ${details.borderColor};">${location.aqi}</div>`,
                iconSize: [42, 30], iconAnchor: [21, 30], popupAnchor: [0, -30]
            });
            const marker = L.marker([location.lat, location.lng], { icon: icon });
            // Lazy popup: build content only when clicked
            marker._aqiDataIndex = i - 1;
            marker.on('click', function() {
                const idx = this._aqiDataIndex;
                const loc = globalAQIData[idx];
                if (!loc) return;
                const det = getAQIDetails(loc.aqi);
                const popupContent = `
                    <div class="custom-popup">
                        <div class="popup-title">${loc.locationName}, ${loc.country}</div>
                        <div class="popup-aqi" style="color: ${det.color};">AQI: ${loc.aqi}</div>
                        <div class="popup-status" style="background-color: ${det.color}; color:${det.textColor}">${det.status}</div>
                    </div>`;
                this.bindPopup(popupContent).openPopup();
            });
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

// --- Optimization #2 & #7: Single-pass stats + avoid DOM rebuild ---
let statsInitialized = false;
function updateStats() {
    const len = globalAQIData.length;
    let sum = 0, goodAir = 0, hazardousAir = 0;
    for (let i = 0; i < len; i++) {
        const aqi = globalAQIData[i].aqi;
        sum += aqi;
        if (aqi <= 50) goodAir++;
        else if (aqi > 300) hazardousAir++;
    }
    const stats = {
        totalStations: len,
        avgAQI: Math.round(sum / len),
        goodAir: goodAir,
        hazardousAir: hazardousAir
    };
    const container = domCache.statsGrid;
    if (!statsInitialized) {
        container.innerHTML = `
            <div class="stat-item"><div class="stat-number" data-stat="totalStations">0</div><div class="stat-label">Stations</div></div>
            <div class="stat-item"><div class="stat-number" data-stat="avgAQI">0</div><div class="stat-label">Avg AQI</div></div>
            <div class="stat-item"><div class="stat-number" data-stat="goodAir">0</div><div class="stat-label">Good Air</div></div>
            <div class="stat-item"><div class="stat-number" data-stat="hazardousAir">0</div><div class="stat-label">Hazardous</div></div>
        `;
        statsInitialized = true;
    }
    for (const key in stats) {
        gsap.to(container.querySelector(`[data-stat="${key}"]`), {
            duration: 2, innerText: stats[key], roundProps: "innerText", ease: "power2.out", delay: 0.5
        });
    }
}

// --- Optimization #5: Page Visibility API for interval management ---
function startLiveFeed() {
    const feedElement = domCache.liveFeed;
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
            const lastChild = feedElement.lastChild;
            gsap.to(lastChild, { 
                opacity: 0, height: 0, margin: 0, padding: 0, duration: 0.4, 
                onComplete: () => { if (lastChild.parentNode) lastChild.remove(); }
            });
        }
    }
    setTimeout(() => addUpdate("System initialized successfully", 50), 1000);
    setTimeout(() => addUpdate("Delhi AQI alert: 285 - Very Unhealthy", 285), 2000);
    setTimeout(() => addUpdate("Shimla maintains excellent air: 35", 35), 3000);

    function feedTick() {
        if (!isPageVisible) return;
        const randomIndex = Math.floor(Math.random() * globalAQIData.length);
        const randomStation = globalAQIData[randomIndex];
        const newAQI = Math.max(0, randomStation.aqi + Math.floor(Math.random() * 20) - 10);
        globalAQIData[randomIndex].aqi = newAQI;
        addUpdate(`${randomStation.locationName} updated: ${newAQI}`, newAQI);
    }
    function chartTick() {
        if (!isPageVisible) return;
        updateComparisonChart();
    }
    feedIntervalId = setInterval(feedTick, 4000);
    chartIntervalId = setInterval(chartTick, 5000);
}

// Page Visibility API: pause background work
document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
});

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
        globalAQIData = generateDenseData(3500);
        statsInitialized = false; // Force stats DOM rebuild with fresh data
        renderAll();
        updateComparisonChart();
        hideLoading();
        const feedElement = domCache.liveFeed;
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.style.borderLeftColor = '#4facfe';
        item.innerHTML = `<div class="feed-time">${new Date().toLocaleTimeString()}</div><div class="feed-content">Data refreshed - 3,500 stations updated</div>`;
        feedElement.prepend(item);
        gsap.to(item, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
    }, 1500);
}

function showLoading() {
    const overlay = domCache.loadingOverlay;
    overlay.style.display = 'flex';
    gsap.to(overlay, { opacity: 1, duration: 0.4 });
}

function hideLoading() {
    const overlay = domCache.loadingOverlay;
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
    const topCities = getTopK(globalAQIData, 15);

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
        animation: { duration: 600 },
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

// --- Optimization #3: Efficient top-K using partial selection ---
function getTopK(arr, k) {
    if (arr.length <= k) return [...arr].sort((a, b) => b.aqi - a.aqi);
    // Maintain a min-heap of size k for the top-k highest AQI values
    const heap = arr.slice(0, k);
    heap.sort((a, b) => a.aqi - b.aqi); // Sort ascending so heap[0] is the smallest
    let minVal = heap[0].aqi;
    for (let i = k; i < arr.length; i++) {
        if (arr[i].aqi > minVal) {
            heap[0] = arr[i];
            // Bubble down to maintain min-heap property
            let idx = 0;
            while (true) {
                let smallest = idx;
                const left = 2 * idx + 1;
                const right = 2 * idx + 2;
                if (left < k && heap[left].aqi < heap[smallest].aqi) smallest = left;
                if (right < k && heap[right].aqi < heap[smallest].aqi) smallest = right;
                if (smallest === idx) break;
                const tmp = heap[idx]; heap[idx] = heap[smallest]; heap[smallest] = tmp;
                idx = smallest;
            }
            minVal = heap[0].aqi;
        }
    }
    return heap.sort((a, b) => b.aqi - a.aqi);
}

function updateComparisonChart() {
    if (!comparisonChart) return;
    const topCities = getTopK(globalAQIData, 15);
    comparisonChart.data.labels = topCities.map(c => c.locationName);
    comparisonChart.data.datasets[0].data = topCities.map(c => c.aqi);
    comparisonChart.data.datasets[0].backgroundColor = topCities.map(c => getAQIDetails(c.aqi).color);
    comparisonChart.update('none'); // Skip animation for periodic updates
}

// --- Optimization #6: Cache DOM references at init ---
document.addEventListener('DOMContentLoaded', function() {
    domCache = {
        particles: document.getElementById('particles'),
        legend: document.getElementById('legend'),
        statsGrid: document.getElementById('statsGrid'),
        liveFeed: document.getElementById('liveFeed'),
        loadingOverlay: document.getElementById('loadingOverlay')
    };
    gsap.registerPlugin(ScrollToPlugin);
    createBackgroundParticles();
    populateLegend();
    initMap();
});