const express = require("express");
const cors = require("cors");

const { getLiveWeather } = require("./weather");
const {
  calculateWeatherRisk,
  getRiskLevel,
} = require("./riskEngine");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Health check
app.get("/", (req, res) => {
  res.json({
    system: "SAMpark AI",
    status: "Backend Online",
    message: "Real-time emergency intelligence engine active",
  });
});

// Live weather + risk
app.get("/api/weather/:state", async (req, res) => {
  try {
    const state = req.params.state;

    const weather = await getLiveWeather(state);

    const riskScore = calculateWeatherRisk(weather);

    const riskLevel = getRiskLevel(riskScore);

    res.json({
      state,
      weather,
      risk: {
        score: riskScore,
        level: riskLevel,
      },
      system: {
        status: "LIVE",
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to fetch live weather data",
    });
  }
});

app.listen(PORT, () => {
  console.log(`SAMpark AI backend running on http://localhost:${PORT}`);
});