function calculateWeatherRisk(weather) {
  let risk = 0;

  const rainfall =
    weather.current.precipitation || 0;

  const humidity =
    weather.current.humidity || 0;

  const wind =
    weather.current.windSpeed || 0;

  if (rainfall >= 20) risk += 40;
  else if (rainfall >= 10) risk += 25;
  else if (rainfall >= 5) risk += 15;

  if (humidity >= 90) risk += 15;
  else if (humidity >= 80) risk += 10;

  if (wind >= 50) risk += 30;
  else if (wind >= 30) risk += 20;
  else if (wind >= 20) risk += 10;

  return Math.min(Math.round(risk), 100);
}

function getRiskLevel(score) {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 35) return "MODERATE";
  return "LOW";
}

module.exports = {
  calculateWeatherRisk,
  getRiskLevel,
};