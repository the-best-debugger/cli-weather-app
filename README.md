CLI Weather App

Usage

Run the CLI with a city name:

```
node index.js "New York"
```

Output example:

```
Weather in New York: 15°C, Partly cloudy. By goweather.herokuapp.com
```
```
Weather in New York: 15°C, Partly cloudy. By wttr.in
```

Notes

- Uses the free wttr.in or goweather.herokuapp.com JSON API (no API key required).
- Requires Node.js. The project already has `node-fetch` dependency.
