const LOCATIONS = {
  Assam: {
    latitude: 26.2006,
    longitude: 92.9376,
  },

  Meghalaya: {
    latitude: 25.4670,
    longitude: 91.3662,
  },

  Manipur: {
    latitude: 24.6637,
    longitude: 93.9063,
  },

  Mizoram: {
    latitude: 23.1645,
    longitude: 92.9376,
  },

  Nagaland: {
    latitude: 26.1584,
    longitude: 94.5624,
  },

  Tripura: {
    latitude: 23.9408,
    longitude: 91.9882,
  },

  ArunachalPradesh: {
    latitude: 27.0844,
    longitude: 93.6053,
  },

  Sikkim: {
    latitude: 27.5330,
    longitude: 88.5122,
  },
};

async function getLiveWeather(state) {
  const location = LOCATIONS[state];

  if (!location) {
    throw new Error("Unknown state");
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
    `&hourly=precipitation_probability,precipitation,wind_speed_10m` +
    `&forecast_days=1` +
    `&timezone=Asia%2FKolkata`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather API failed");
  }

  const data = await response.json();

  return {
    state,

    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
    },

    hourly: {
      precipitationProbability:
        data.hourly.precipitation_probability,

      precipitation:
        data.hourly.precipitation,

      windSpeed:
        data.hourly.wind_speed_10m,
    },

    updatedAt: new Date().toISOString(),
  };
}

module.exports = {
  getLiveWeather,
};