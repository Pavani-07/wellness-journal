
const axios = require('axios');

const API_KEY = '79cfde58d6b5a92e003ab1065d3ed90a'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(cityName) {
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: cityName,
                appid: API_KEY,
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error; 
    }
}

module.exports = {
    getWeather
};
