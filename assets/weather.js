const url =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=46.0569" +
  "&longitude=14.5058" +
  "&current=temperature_2m,weather_code";

async function loadWeather() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    document.getElementById("weather_code").textContent =
      `${weatherIcons[data.current.weather_code]} `;

    document.getElementById("temperature").textContent =
      `${data.current.temperature_2m} °C`;

    console.log(data.current.temperature_2m);
    console.log(data.current.weather_code);
    console.log(data);
    console.log(weatherDescriptions[data.current.weather_code]);
  } catch (error) {
    document.getElementById("temperature").textContent =
      "Podatek ni na voljo";
    document.getElementById("weather_code").textContent =
      "Podatek ni na voljo";
  }
  
}

loadWeather();

const weatherDescriptions = {
  0: "Jasno",
  1: "Pretežno jasno",
  2: "Delno oblačno",
  3: "Oblačno",
  45: "Megla",
  48: "Megla z ivjem",
  51: "Rahlo rosenje",
  61: "Rahel dež",
  63: "Dež",
  65: "Močan dež",
  71: "Rahlo sneženje",
  80: "Plohe",
  95: "Nevihta"
};

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  61: "🌧️",
  71: "❄️",
  95: "⛈️"
};



