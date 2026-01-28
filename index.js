import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const args = process.argv.slice(2);
const city = args.join(' ').trim();

if (!city) {
  console.error('Usage: node index.js "City Name"');
  process.exit(1);
}

// Determine base API URL. Can be overridden via API_URL in .env
let base = process.env.API_URL || 'https://goweather.herokuapp.com/weather/';
if (!base.endsWith('/')) base += '/';

// Build URL depending on chosen API
let url;
if (base.includes('goweather')) {
  url = `${base}${encodeURIComponent(city)}`;
} else if (base.includes('wttr.in')) {
  url = `${base}${encodeURIComponent(city)}?format=j1`;
} else {
  // generic: append city
  url = `${base}${encodeURIComponent(city)}`;
}

async function main() {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'cli-weather-app' } });
    if (!res.ok) {
      console.error(`API request failed: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const json = await res.json();

    // Parse goweather response
    if (json && typeof json.temperature === 'string') {
      const temp = json.temperature || 'N/A';
      const desc = json.description || 'N/A';
      console.log(`Weather in ${city}: ${temp}, ${desc}. By goweather.herokuapp.com`);
      return;
    }

    // Parse wttr.in response
    const cc = json.current_condition && json.current_condition[0];
    if (cc) {
      const tempC = cc.temp_C;
      const desc = (cc.weatherDesc && cc.weatherDesc[0] && cc.weatherDesc[0].value) || 'N/A';
      console.log(`Weather in ${city}: ${tempC}°C, ${desc}. By wttr.in`);
      return;
    }

    console.error(`Could not parse weather response for "${city}".`);
    process.exit(1);
  } catch (err) {
    console.error('Request error:', err.message);
    process.exit(1);
  }
}

main();
