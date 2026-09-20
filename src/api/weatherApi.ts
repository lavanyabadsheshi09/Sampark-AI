export async function getWeather(state: string) {
  const response = await fetch(
    `http://localhost:5000/api/weather/${state}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}