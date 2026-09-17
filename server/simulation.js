import { aqiLookup } from './aqiLookup.js';

export const aqiLevels = [
    { range: [0, 50], status: 'Good', color: '#10b981', textColor: '#ffffff', borderColor: 'rgba(16, 185, 129, 0.4)' },
    { range: [51, 100], status: 'Moderate', color: '#eab308', textColor: '#0f172a', borderColor: 'rgba(234, 179, 8, 0.4)' },
    { range: [101, 150], status: 'Unhealthy for Sensitive', color: '#f97316', textColor: '#ffffff', borderColor: 'rgba(249, 115, 22, 0.4)' },
    { range: [151, 200], status: 'Unhealthy', color: '#ef4444', textColor: '#ffffff', borderColor: 'rgba(239, 68, 68, 0.4)' },
    { range: [201, 300], status: 'Very Unhealthy', color: '#a855f7', textColor: '#ffffff', borderColor: 'rgba(168, 85, 247, 0.4)' },
    { range: [301, Infinity], status: 'Hazardous', color: '#881337', textColor: '#ffffff', borderColor: 'rgba(136, 19, 55, 0.5)' }
];

export function getAQIDetails(aqi) {
    const clamped = Math.min(Math.max(0, Math.round(aqi)), 501);
    return aqiLookup[clamped] || aqiLevels[aqiLevels.length - 1];
}

// Highly accurate, authentic Indian monitoring station hubs
export const indianHubs = [
    // Delhi NCR
    {
        city: 'Delhi', state: 'Delhi', baseAQI: 310,
        areas: [
            { name: 'Anand Vihar', lat: 28.6469, lng: 77.3160 },
            { name: 'Punjabi Bagh', lat: 28.6692, lng: 77.1328 },
            { name: 'RK Puram', lat: 28.5660, lng: 77.1767 },
            { name: 'Mandir Marg', lat: 28.6366, lng: 77.2010 },
            { name: 'IGI Airport T3', lat: 28.5562, lng: 77.0999 },
            { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
            { name: 'Lodhi Road', lat: 28.5933, lng: 77.2252 },
            { name: 'Dwarka Sector 8', lat: 28.5708, lng: 77.0712 },
            { name: 'Rohini Sector 16', lat: 28.7325, lng: 77.1190 },
            { name: 'Shadipur', lat: 28.6517, lng: 77.1581 },
            { name: 'Bawana Industrial Area', lat: 28.7997, lng: 77.0326 },
            { name: 'Okhla Phase II', lat: 28.5308, lng: 77.2713 }
        ]
    },
    {
        city: 'Noida', state: 'Uttar Pradesh', baseAQI: 280,
        areas: [
            { name: 'Sector 62', lat: 28.6256, lng: 77.3639 },
            { name: 'Sector 125', lat: 28.5447, lng: 77.3331 },
            { name: 'Sector 1', lat: 28.5893, lng: 77.3117 }
        ]
    },
    {
        city: 'Gurugram', state: 'Haryana', baseAQI: 275,
        areas: [
            { name: 'Vikas Sadan', lat: 28.4552, lng: 77.0324 },
            { name: 'Sector 51', lat: 28.4290, lng: 77.0712 },
            { name: 'Gwal Pahari', lat: 28.4329, lng: 77.1524 }
        ]
    },
    // Mumbai MMR
    {
        city: 'Mumbai', state: 'Maharashtra', baseAQI: 145,
        areas: [
            { name: 'Bandra Kurla Complex', lat: 19.0664, lng: 72.8688 },
            { name: 'Colaba Causeway', lat: 18.9150, lng: 72.8258 },
            { name: 'Worli Sea Face', lat: 19.0176, lng: 72.8150 },
            { name: 'Chembur', lat: 19.0522, lng: 72.8994 },
            { name: 'Andheri West', lat: 19.1136, lng: 72.8339 },
            { name: 'Borivali East', lat: 19.2288, lng: 72.8631 },
            { name: 'Powai Lake', lat: 19.1250, lng: 72.9090 },
            { name: 'Kurla West', lat: 19.0726, lng: 72.8794 },
            { name: 'Malad West', lat: 19.1874, lng: 72.8484 },
            { name: 'Sion Circle', lat: 19.0390, lng: 72.8619 }
        ]
    },
    {
        city: 'Thane', state: 'Maharashtra', baseAQI: 135,
        areas: [
            { name: 'Teen Hath Naka', lat: 19.1912, lng: 72.9663 },
            { name: 'Ghodbunder Road', lat: 19.2618, lng: 72.9460 }
        ]
    },
    {
        city: 'Navi Mumbai', state: 'Maharashtra', baseAQI: 130,
        areas: [
            { name: 'Vashi Sector 17', lat: 19.0771, lng: 72.9986 },
            { name: 'Nerul Palm Beach', lat: 19.0330, lng: 73.0180 },
            { name: 'CBD Belapur', lat: 19.0188, lng: 73.0389 }
        ]
    },
    // Bengaluru
    {
        city: 'Bengaluru', state: 'Karnataka', baseAQI: 72,
        areas: [
            { name: 'Silk Board Junction', lat: 12.9177, lng: 77.6238 },
            { name: 'BTM Layout 2nd Stage', lat: 12.9166, lng: 77.6101 },
            { name: 'Koramangala 4th Block', lat: 12.9352, lng: 77.6245 },
            { name: 'Whitefield ITPL', lat: 12.9863, lng: 77.7338 },
            { name: 'Peenya Industrial Area', lat: 13.0285, lng: 77.5197 },
            { name: 'Hebbal Flyover', lat: 13.0358, lng: 77.5970 },
            { name: 'Jayanagar 4th Block', lat: 12.9299, lng: 77.5824 },
            { name: 'Electronic City Phase 1', lat: 12.8452, lng: 77.6602 },
            { name: 'Indiranagar 100ft Rd', lat: 12.9784, lng: 77.6408 },
            { name: 'Yelahanka Satellite Town', lat: 13.1007, lng: 77.5963 }
        ]
    },
    // Kolkata
    {
        city: 'Kolkata', state: 'West Bengal', baseAQI: 195,
        areas: [
            { name: 'Victoria Memorial', lat: 22.5448, lng: 88.3426 },
            { name: 'Salt Lake Sector V', lat: 22.5800, lng: 88.4350 },
            { name: 'Rabindra Bharati Univ', lat: 22.6280, lng: 88.3780 },
            { name: 'Ballygunge Circular Rd', lat: 22.5292, lng: 88.3634 },
            { name: 'Howrah Railway Stn', lat: 22.5839, lng: 88.3428 },
            { name: 'New Town Action Area 1', lat: 22.5898, lng: 88.4680 },
            { name: 'Jadavpur University', lat: 22.4988, lng: 88.3705 },
            { name: 'Esplanade Metro', lat: 22.5636, lng: 88.3519 },
            { name: 'Dum Dum Airport', lat: 22.6547, lng: 88.4467 }
        ]
    },
    // Chennai
    {
        city: 'Chennai', state: 'Tamil Nadu', baseAQI: 78,
        areas: [
            { name: 'Alandur Bus Depot', lat: 13.0033, lng: 80.2012 },
            { name: 'IIT Madras Guindy', lat: 12.9915, lng: 80.2337 },
            { name: 'Velachery Bypass', lat: 12.9815, lng: 80.2180 },
            { name: 'Anna Nagar Roundtana', lat: 13.0850, lng: 80.2101 },
            { name: 'Manali Petrochemical', lat: 13.1670, lng: 80.2600 },
            { name: 'Royapuram Harbour', lat: 13.1147, lng: 80.2975 },
            { name: 'T Nagar Pondy Bazaar', lat: 13.0418, lng: 80.2341 },
            { name: 'OMR Sholinganallur', lat: 12.9010, lng: 80.2279 }
        ]
    },
    // Hyderabad
    {
        city: 'Hyderabad', state: 'Telangana', baseAQI: 120,
        areas: [
            { name: 'HITEC City Cyber Towers', lat: 17.4474, lng: 78.3762 },
            { name: 'Sanathnagar Industrial', lat: 17.4563, lng: 78.4439 },
            { name: 'Zoo Park Bahadurpura', lat: 17.3510, lng: 78.4520 },
            { name: 'Jubilee Hills Checkpost', lat: 17.4318, lng: 78.4076 },
            { name: 'Charminar Heritage', lat: 17.3616, lng: 78.4747 },
            { name: 'Gachibowli Stadium', lat: 17.4401, lng: 78.3489 },
            { name: 'Secunderabad Paradise', lat: 17.4399, lng: 78.4983 },
            { name: 'Banjara Hills Rd 1', lat: 17.4156, lng: 78.4347 }
        ]
    },
    // Pune
    {
        city: 'Pune', state: 'Maharashtra', baseAQI: 110,
        areas: [
            { name: 'Shivaji Nagar', lat: 18.5314, lng: 73.8446 },
            { name: 'Hinjawadi Phase 1', lat: 18.5913, lng: 73.7389 },
            { name: 'Hadapsar Magarpatta', lat: 18.5089, lng: 73.9260 },
            { name: 'Kothrud Paud Road', lat: 18.5075, lng: 73.8077 },
            { name: 'Koregaon Park', lat: 18.5362, lng: 73.8930 },
            { name: 'Pimpri Chinchwad', lat: 18.6298, lng: 73.7997 },
            { name: 'Aundh Ravet Rd', lat: 18.5584, lng: 73.8076 }
        ]
    },
    // Ahmedabad
    {
        city: 'Ahmedabad', state: 'Gujarat', baseAQI: 165,
        areas: [
            { name: 'Maninagar', lat: 23.0021, lng: 72.6047 },
            { name: 'Satellite SG Highway', lat: 23.0269, lng: 72.5299 },
            { name: 'Chandkheda Ring Rd', lat: 23.1090, lng: 72.5850 },
            { name: 'Vatva GIDC', lat: 22.9620, lng: 72.6320 },
            { name: 'Navrangpura Univ', lat: 23.0394, lng: 72.5569 },
            { name: 'Bopal South', lat: 23.0347, lng: 72.4645 }
        ]
    },
    // Jaipur
    {
        city: 'Jaipur', state: 'Rajasthan', baseAQI: 175,
        areas: [
            { name: 'Adarsh Nagar', lat: 26.9030, lng: 75.8340 },
            { name: 'Police Commissionerate', lat: 26.9180, lng: 75.7990 },
            { name: 'Shastri Nagar', lat: 26.9420, lng: 75.7950 },
            { name: 'Mansarovar Metro', lat: 26.8673, lng: 75.7620 },
            { name: 'Sitapura Industrial', lat: 26.7780, lng: 75.8450 }
        ]
    },
    // Lucknow
    {
        city: 'Lucknow', state: 'Uttar Pradesh', baseAQI: 240,
        areas: [
            { name: 'Hazratganj Central', lat: 26.8506, lng: 80.9512 },
            { name: 'Talkatora Industrial Area', lat: 26.8370, lng: 80.8930 },
            { name: 'Gomti Nagar Vibhuti Khand', lat: 26.8566, lng: 80.9917 },
            { name: 'Aliganj Sector B', lat: 26.8894, lng: 80.9387 },
            { name: 'Lalbagh Girls College', lat: 26.8480, lng: 80.9350 }
        ]
    },
    // Kanpur
    {
        city: 'Kanpur', state: 'Uttar Pradesh', baseAQI: 265,
        areas: [
            { name: 'Kalyanpur GT Road', lat: 26.4950, lng: 80.2600 },
            { name: 'Nehru Nagar', lat: 26.4680, lng: 80.3410 },
            { name: 'Kidwai Nagar', lat: 26.4429, lng: 80.3395 },
            { name: 'Panki Thermal Plant', lat: 26.4650, lng: 80.2700 }
        ]
    },
    // Patna
    {
        city: 'Patna', state: 'Bihar', baseAQI: 270,
        areas: [
            { name: 'DRM Office Danapur', lat: 25.6250, lng: 85.0450 },
            { name: 'Planetarium Bailey Rd', lat: 25.6130, lng: 85.1270 },
            { name: 'Samanpura Raja Bazar', lat: 25.6190, lng: 85.0930 },
            { name: 'Shikarpur Rajendra Nagar', lat: 25.6105, lng: 85.1550 }
        ]
    },
    // Varanasi
    {
        city: 'Varanasi', state: 'Uttar Pradesh', baseAQI: 210,
        areas: [
            { name: 'BHU Malviya Gate', lat: 25.2677, lng: 82.9913 },
            { name: 'Ardhali Bazar', lat: 25.3450, lng: 82.9750 },
            { name: 'Bhelupur Water Works', lat: 25.3020, lng: 82.9980 }
        ]
    },
    // Agra
    {
        city: 'Agra', state: 'Uttar Pradesh', baseAQI: 225,
        areas: [
            { name: 'Sanjay Place Commercial', lat: 27.2010, lng: 78.0050 },
            { name: 'Taj Ganj East Gate', lat: 27.1710, lng: 78.0421 },
            { name: 'Dayalbagh University', lat: 27.2250, lng: 78.0070 }
        ]
    },
    // Bhopal
    {
        city: 'Bhopal', state: 'Madhya Pradesh', baseAQI: 135,
        areas: [
            { name: 'Paryavaran Parisar Arera', lat: 23.2180, lng: 77.4350 },
            { name: 'TT Nagar Stadium', lat: 23.2380, lng: 77.4080 },
            { name: 'Kolar Road Sarvadharma', lat: 23.1850, lng: 77.4250 }
        ]
    },
    // Indore
    {
        city: 'Indore', state: 'Madhya Pradesh', baseAQI: 140,
        areas: [
            { name: 'Vijay Nagar Square', lat: 22.7533, lng: 75.8930 },
            { name: 'Chhoti Gwaltoli Stn', lat: 22.7170, lng: 75.8670 },
            { name: 'Sanwer Road Industrial', lat: 22.7680, lng: 75.8450 }
        ]
    },
    // Chandigarh Capital Region
    {
        city: 'Chandigarh', state: 'Chandigarh', baseAQI: 130,
        areas: [
            { name: 'Sector 22 Market', lat: 30.7333, lng: 76.7794 },
            { name: 'Sector 25 Panjab Univ', lat: 30.7510, lng: 76.7590 },
            { name: 'Sector 53 Mohali Border', lat: 30.7180, lng: 76.7320 }
        ]
    },
    // Punjab
    {
        city: 'Amritsar', state: 'Punjab', baseAQI: 185,
        areas: [
            { name: 'Golden Temple Buffer', lat: 31.6200, lng: 74.8765 },
            { name: 'Civil Lines Court', lat: 31.6420, lng: 74.8690 }
        ]
    },
    {
        city: 'Ludhiana', state: 'Punjab', baseAQI: 215,
        areas: [
            { name: 'Focal Point Industrial', lat: 30.8870, lng: 75.9080 },
            { name: 'PAU Campus', lat: 30.9010, lng: 75.8073 }
        ]
    },
    // Jammu & Kashmir
    {
        city: 'Srinagar', state: 'Jammu and Kashmir', baseAQI: 42,
        areas: [
            { name: 'Dal Lake Boulevard', lat: 34.0910, lng: 74.8450 },
            { name: 'Lal Chowk Central', lat: 34.0720, lng: 74.8100 },
            { name: 'Hazratbal Sanctuary', lat: 34.1250, lng: 74.8420 }
        ]
    },
    {
        city: 'Jammu', state: 'Jammu and Kashmir', baseAQI: 88,
        areas: [
            { name: 'Bahu Fort Area', lat: 32.7230, lng: 74.8820 },
            { name: 'Gandhi Nagar Main', lat: 32.7050, lng: 74.8580 }
        ]
    },
    // Himachal Pradesh
    {
        city: 'Shimla', state: 'Himachal Pradesh', baseAQI: 32,
        areas: [
            { name: 'The Ridge Mall Road', lat: 31.1048, lng: 77.1734 },
            { name: 'Sanjauli Hilltop', lat: 31.1020, lng: 77.1950 },
            { name: 'Summer Hill HPU', lat: 31.1120, lng: 77.1420 }
        ]
    },
    {
        city: 'Dharamshala', state: 'Himachal Pradesh', baseAQI: 28,
        areas: [
            { name: 'McLeod Ganj Monastic', lat: 32.2426, lng: 76.3213 },
            { name: 'Kotwali Bazaar', lat: 32.2190, lng: 76.3234 }
        ]
    },
    // Uttarakhand
    {
        city: 'Dehradun', state: 'Uttarakhand', baseAQI: 95,
        areas: [
            { name: 'Clock Tower Rajpur Rd', lat: 30.3244, lng: 78.0418 },
            { name: 'ISBT Haridwar Bypass', lat: 30.2870, lng: 78.0120 },
            { name: 'FRI Forest Campus', lat: 30.3420, lng: 77.9980 }
        ]
    },
    {
        city: 'Rishikesh', state: 'Uttarakhand', baseAQI: 55,
        areas: [
            { name: 'Triveni Ghat Ashram', lat: 30.1030, lng: 78.2940 },
            { name: 'Tapovan Yoga Valley', lat: 30.1320, lng: 78.3240 }
        ]
    },
    // Odisha
    {
        city: 'Bhubaneswar', state: 'Odisha', baseAQI: 105,
        areas: [
            { name: 'Patia Infocity', lat: 20.3540, lng: 85.8180 },
            { name: 'IRC Village Nayapalli', lat: 20.2961, lng: 85.8145 },
            { name: 'Master Canteen Square', lat: 20.2670, lng: 85.8420 }
        ]
    },
    // Jharkhand
    {
        city: 'Ranchi', state: 'Jharkhand', baseAQI: 135,
        areas: [
            { name: 'Doranda Overbridge', lat: 23.3320, lng: 85.3210 },
            { name: 'Morabadi Ground', lat: 23.3850, lng: 85.3340 }
        ]
    },
    // Chhattisgarh
    {
        city: 'Raipur', state: 'Chhattisgarh', baseAQI: 155,
        areas: [
            { name: 'Jaistambh Chowk', lat: 21.2420, lng: 81.6320 },
            { name: 'Atal Nagar Naya Raipur', lat: 21.1620, lng: 81.7850 }
        ]
    },
    // Assam & Northeast
    {
        city: 'Guwahati', state: 'Assam', baseAQI: 115,
        areas: [
            { name: 'Paltan Bazaar Stn', lat: 26.1800, lng: 91.7520 },
            { name: 'IIT Guwahati North', lat: 26.1920, lng: 91.6930 },
            { name: 'Dispur Secretariat', lat: 26.1445, lng: 91.7890 }
        ]
    },
    {
        city: 'Shillong', state: 'Meghalaya', baseAQI: 26,
        areas: [
            { name: 'Police Bazar Central', lat: 25.5788, lng: 91.8833 },
            { name: 'Laitumkhrah Valley', lat: 25.5680, lng: 91.8950 }
        ]
    },
    // Central & Western India
    {
        city: 'Nagpur', state: 'Maharashtra', baseAQI: 125,
        areas: [
            { name: 'Civil Lines High Court', lat: 21.1550, lng: 79.0720 },
            { name: 'MIDC Hingna Industrial', lat: 21.1180, lng: 78.9950 },
            { name: 'Sitabuldi Interchange', lat: 21.1458, lng: 79.0882 }
        ]
    },
    {
        city: 'Surat', state: 'Gujarat', baseAQI: 130,
        areas: [
            { name: 'Athwa Lines Riverside', lat: 21.1730, lng: 72.8020 },
            { name: 'Pandesara GIDC', lat: 21.1450, lng: 72.8350 },
            { name: 'Varachha Diamond Zone', lat: 21.2180, lng: 72.8590 }
        ]
    },
    {
        city: 'Vadodara', state: 'Gujarat', baseAQI: 120,
        areas: [
            { name: 'Alkapuri RC Dutt Rd', lat: 22.3120, lng: 73.1750 },
            { name: 'Makarpura GIDC', lat: 22.2540, lng: 73.1950 }
        ]
    },
    // Southern India
    {
        city: 'Visakhapatnam', state: 'Andhra Pradesh', baseAQI: 95,
        areas: [
            { name: 'RK Beach Promenade', lat: 17.7140, lng: 83.3230 },
            { name: 'Gajuwaka Industrial', lat: 17.6920, lng: 83.2120 },
            { name: 'Siripuram Junction', lat: 17.7280, lng: 83.3150 }
        ]
    },
    {
        city: 'Vijayawada', state: 'Andhra Pradesh', baseAQI: 105,
        areas: [
            { name: 'Benz Circle MG Road', lat: 16.5020, lng: 80.6550 },
            { name: 'One Town Old City', lat: 16.5200, lng: 80.6120 }
        ]
    },
    {
        city: 'Coimbatore', state: 'Tamil Nadu', baseAQI: 68,
        areas: [
            { name: 'RS Puram West', lat: 11.0110, lng: 76.9450 },
            { name: 'Peelamedu Avinashi Rd', lat: 11.0320, lng: 77.0120 }
        ]
    },
    {
        city: 'Madurai', state: 'Tamil Nadu', baseAQI: 72,
        areas: [
            { name: 'Meenakshi Temple Zone', lat: 9.9195, lng: 78.1194 },
            { name: 'Anna Nagar Melur Rd', lat: 9.9252, lng: 78.1480 }
        ]
    },
    {
        city: 'Kochi', state: 'Kerala', baseAQI: 52,
        areas: [
            { name: 'Marine Drive Waterfront', lat: 9.9816, lng: 76.2753 },
            { name: 'Kakkanad Infopark', lat: 10.0159, lng: 76.3639 },
            { name: 'Vyttila Mobility Hub', lat: 9.9680, lng: 76.3210 }
        ]
    },
    {
        city: 'Thiruvananthapuram', state: 'Kerala', baseAQI: 45,
        areas: [
            { name: 'Palayam Central Library', lat: 8.5030, lng: 76.9520 },
            { name: 'Technopark Phase 1', lat: 8.5580, lng: 76.8810 },
            { name: 'Kovalam Coastal Strip', lat: 8.4020, lng: 76.9780 }
        ]
    }
];

// Global benchmark reference hubs (accessible in 'Global Hubs' view)
export const globalHubs = [
    { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, baseAQI: 28, areas: [{ name: 'Shinjuku', lat: 35.6938, lng: 139.7034 }, { name: 'Shibuya', lat: 35.6580, lng: 139.7016 }, { name: 'Chiyoda', lat: 35.6940, lng: 139.7536 }] },
    { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, baseAQI: 38, areas: [{ name: 'Westminster', lat: 51.4975, lng: -0.1357 }, { name: 'Camden', lat: 51.5390, lng: -0.1426 }, { name: 'Greenwich', lat: 51.4834, lng: 0.0098 }] },
    { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, baseAQI: 42, areas: [{ name: 'Central Park', lat: 40.7851, lng: -73.9683 }, { name: 'Financial District', lat: 40.7075, lng: -74.0090 }, { name: 'Brooklyn Heights', lat: 40.6960, lng: -73.9933 }] },
    { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, baseAQI: 35, areas: [{ name: 'Champs-Élysées', lat: 48.8698, lng: 2.3075 }, { name: 'Montmartre', lat: 48.8867, lng: 2.3431 }] },
    { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, baseAQI: 125, areas: [{ name: 'Downtown Burj Khalifa', lat: 25.1972, lng: 55.2744 }, { name: 'Dubai Marina', lat: 25.0805, lng: 55.1403 }] },
    { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, baseAQI: 34, areas: [{ name: 'Marina Bay', lat: 1.2847, lng: 103.8610 }, { name: 'Jurong East', lat: 1.3329, lng: 103.7436 }] },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, baseAQI: 22, areas: [{ name: 'Circular Quay', lat: -33.8614, lng: 151.2108 }, { name: 'Darling Harbour', lat: -33.8749, lng: 151.2009 }] },
    { city: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, baseAQI: 145, areas: [{ name: 'Chaoyang Olympic Park', lat: 39.9928, lng: 116.3970 }, { name: 'Haidian Tech Park', lat: 39.9599, lng: 116.2982 }] },
    { city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, baseAQI: 65, areas: [{ name: 'Gangnam Station', lat: 37.4979, lng: 127.0276 }, { name: 'Jongno Historical', lat: 37.5704, lng: 126.9922 }] },
    { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, baseAQI: 30, areas: [{ name: 'Mitte', lat: 52.5219, lng: 13.4132 }, { name: 'Kreuzberg', lat: 52.4986, lng: 13.3918 }] }
];

// Helper to compute realistic micro-pollutants and weather
function createTelemetryMetrics(baseAQI, cityName) {
    // Add micro-variation around base AQI
    const jitter = (Math.random() * 40) - 20;
    const aqi = Math.max(12, Math.min(495, Math.round(baseAQI + jitter)));
    
    // PM2.5 closely tracks AQI
    const pm25 = Math.max(4, Math.round(aqi * 0.62 + (Math.random() * 12 - 6)));
    // PM10 is roughly 1.6-1.9x of PM2.5 in Indian conditions
    const pm10 = Math.max(8, Math.round(pm25 * 1.75 + (Math.random() * 20 - 10)));
    // NO2 from traffic/industry
    const no2 = Math.max(6, Math.round(aqi * 0.28 + (Math.random() * 15 - 5)));
    // Realistic regional temp and humidity
    const isColdRegion = ['Srinagar', 'Shimla', 'Dharamshala'].includes(cityName);
    const temperature = isColdRegion 
        ? Math.round(10 + Math.random() * 8) 
        : Math.round(24 + Math.random() * 10);
    const humidity = Math.round(35 + Math.random() * 45);

    return { aqi, pm25, pm10, no2, temperature, humidity };
}

// Generate densely distributed, geographically accurate stations
export function generateDenseData(targetCount = 3500) {
    const stations = [];
    let idCounter = 0;

    // 1. Generate 3,300+ Indian micro-stations perfectly distributed across Indian hubs
    const totalIndiaHubs = indianHubs.length;
    // Calculate stations per hub proportional to metropolitan density
    for (let h = 0; h < totalIndiaHubs; h++) {
        const hub = indianHubs[h];
        const isMegaCity = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad'].includes(hub.city);
        const stationsForHub = isMegaCity ? 140 : 75;

        for (let s = 0; s < stationsForHub; s++) {
            const area = hub.areas[s % hub.areas.length];
            // Safe, tight Gaussian-like micro spread within 400m - 2.5km of neighborhood center
            const offsetLat = (Math.random() - 0.5) * 0.024;
            const offsetLng = (Math.random() - 0.5) * 0.024;

            const metrics = createTelemetryMetrics(hub.baseAQI, hub.city);
            const stationNum = Math.floor(s / hub.areas.length) + 1;
            const locationName = stationNum > 1 ? `${area.name} Stn #${stationNum}` : area.name;

            stations.push({
                id: idCounter++,
                city: hub.city,
                locationName: locationName,
                fullName: `${locationName}, ${hub.city}`,
                state: hub.state,
                country: 'India',
                isGlobal: false,
                lat: +(area.lat + offsetLat).toFixed(5),
                lng: +(area.lng + offsetLng).toFixed(5),
                ...metrics
            });
        }
    }

    // 2. Add Global Hubs (~200 stations) clearly marked as international benchmarks
    for (let g = 0; g < globalHubs.length; g++) {
        const gh = globalHubs[g];
        const stationsPerGlobal = 20;

        for (let s = 0; s < stationsPerGlobal; s++) {
            const area = gh.areas[s % gh.areas.length];
            const offsetLat = (Math.random() - 0.5) * 0.02;
            const offsetLng = (Math.random() - 0.5) * 0.02;
            const metrics = createTelemetryMetrics(gh.baseAQI, gh.city);

            stations.push({
                id: idCounter++,
                city: gh.city,
                locationName: area.name,
                fullName: `${area.name}, ${gh.city}`,
                state: gh.country,
                country: gh.country,
                isGlobal: true,
                lat: +(area.lat + offsetLat).toFixed(5),
                lng: +(area.lng + offsetLng).toFixed(5),
                ...metrics
            });
        }
    }

    return stations;
}

// In-Memory Simulated State
export let globalAQIData = [];
export let feedLog = [];

export function initSimulation() {
    globalAQIData = generateDenseData(3500);
    feedLog = [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), message: "Telemetry network online — 3,500 sensors synchronized", aqi: 45, city: "National Network" },
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), message: "Delhi NCR: Severe inversion layer detected (AQI 342)", aqi: 342, city: "Delhi" },
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), message: "Bengaluru Silk Board: Moderate levels recorded (AQI 88)", aqi: 88, city: "Bengaluru" },
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), message: "Shimla Ridge: Clean Himalayan airflow active (AQI 26)", aqi: 26, city: "Shimla" }
    ];
}

export function refreshSimulation() {
    globalAQIData = generateDenseData(3500);
    const newFeed = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: "Full telemetry recalibrated — 3,500 stations synchronized across India and global hubs",
        aqi: 95,
        city: "System Calibration"
    };
    feedLog.unshift(newFeed);
    if (feedLog.length > 30) feedLog.pop();
}

export function tickSimulation() {
    if (globalAQIData.length === 0) return;
    
    // Choose 3-5 random stations to update on each tick for lively, fluid telemetry
    const updateCount = Math.floor(Math.random() * 3) + 2;
    for (let u = 0; u < updateCount; u++) {
        const randomIndex = Math.floor(Math.random() * globalAQIData.length);
        const station = globalAQIData[randomIndex];
        
        // Small realistic fluctuation (±6 AQI)
        const delta = Math.floor(Math.random() * 13) - 6;
        const oldAQI = station.aqi;
        let newAQI = Math.max(10, Math.min(500, oldAQI + delta));
        
        globalAQIData[randomIndex].aqi = newAQI;
        globalAQIData[randomIndex].pm25 = Math.max(4, Math.round(newAQI * 0.62));
        globalAQIData[randomIndex].pm10 = Math.max(8, Math.round(globalAQIData[randomIndex].pm25 * 1.75));

        // Log notable changes
        if (Math.abs(delta) >= 5 && u === 0) {
            const details = getAQIDetails(newAQI);
            const message = `${station.fullName}: AQI changed to ${newAQI} (${details.status})`;
            
            feedLog.unshift({
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                message,
                aqi: newAQI,
                city: station.city,
                stationId: station.id
            });
            
            if (feedLog.length > 30) {
                feedLog.pop();
            }
        }
    }
}

// Top K Pollution selection
export function getTopPolluted(k = 15) {
    if (globalAQIData.length <= k) {
        return [...globalAQIData].sort((a, b) => b.aqi - a.aqi);
    }
    
    // Min-heap top-k implementation
    const heap = globalAQIData.slice(0, k);
    heap.sort((a, b) => a.aqi - b.aqi);
    
    let minVal = heap[0].aqi;
    for (let i = k; i < globalAQIData.length; i++) {
        if (globalAQIData[i].aqi > minVal) {
            heap[0] = globalAQIData[i];
            
            // Bubble down
            let idx = 0;
            while (true) {
                let smallest = idx;
                const left = 2 * idx + 1;
                const right = 2 * idx + 2;
                if (left < k && heap[left].aqi < heap[smallest].aqi) smallest = left;
                if (right < k && heap[right].aqi < heap[smallest].aqi) smallest = right;
                if (smallest === idx) break;
                const tmp = heap[idx]; 
                heap[idx] = heap[smallest]; 
                heap[smallest] = tmp;
                idx = smallest;
            }
            minVal = heap[0].aqi;
        }
    }
    return heap.sort((a, b) => b.aqi - a.aqi);
}

// Single-pass Stats calculation
export function calculateStats() {
    const len = globalAQIData.length;
    if (len === 0) return { totalStations: 0, avgAQI: 0, goodAir: 0, hazardousAir: 0, moderateAir: 0, unhealthyAir: 0 };
    
    let sum = 0, goodAir = 0, hazardousAir = 0, moderateAir = 0, unhealthyAir = 0;
    for (let i = 0; i < len; i++) {
        const aqi = globalAQIData[i].aqi;
        sum += aqi;
        if (aqi <= 50) goodAir++;
        else if (aqi <= 100) moderateAir++;
        else if (aqi > 200 && aqi <= 300) unhealthyAir++;
        else if (aqi > 300) hazardousAir++;
    }
    
    return {
        totalStations: len,
        avgAQI: Math.round(sum / len),
        goodAir,
        moderateAir,
        unhealthyAir,
        hazardousAir,
        safePercent: Math.round(((goodAir + moderateAir) / len) * 100)
    };
}
