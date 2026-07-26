console.log("weather.js se je naložil");

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  61: "🌧️",
  71: "❄️",
  95: "⛈️"
};



async function loadWeather(latitude,longitude) {
   console.log("Prejel sem:", latitude, longitude);
  const url =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${latitude}` +
  `&longitude=${longitude}` +
  "&current=temperature_2m,weather_code";

  console.log("URL za vreme:", url);

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

   
  } catch (error) {
    console.error("Napaka pri pridobivanju vremena:", error);
    document.getElementById("temperature").textContent =
      "Podatek ni na voljo";
    document.getElementById("weather_code").textContent =
      "Podatek ni na voljo";
  }
  
}







