import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";


// Form input
    const form = document.getElementById("destination-form");
    const destinationInput = document.getElementById("destination");
    const dateInput = document.getElementById("selected-date");

// omogoči, da se date picker odpre kjerkoli v okvirčku 

   dateInput.addEventListener("click", () => {
    if (dateInput.showPicker) {
    dateInput.showPicker();
      }
    });

// Form output
    const summary = document.getElementById("selection-summary");
    const selectedDestination = document.getElementById("selected-destination");
    const displayedDate = document.getElementById("displayed-date");

    // Today's date
    const today = new Date();

    // A date from 20 years ago

    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(today.getFullYear() - 20);

    /*
      HTML-polje type="date" zahteva obliko YYYY-MM-DD.
      Funkcija pripravi lokalni datum brez težav zaradi časovnih pasov.
    */

    function formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    // Uporabnik ne more izbrati starejšega ali prihodnjega datuma.
    dateInput.min = formatDateForInput(twentyYearsAgo);
    dateInput.max = formatDateForInput(today);

// Event listener

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const destination = destinationInput.value.trim();
      const selectedDate = dateInput.value;

      if (!destination || !selectedDate) {
        return;
      }

      selectedDestination.textContent = destination;
      displayedDate.textContent = selectedDate;
      summary.hidden = false;

      transformDestination(destination, selectedDate); 
      
      
      console.log("Date:" + selectedDate);
      console.log("Destination:" + destination)
    });

    // transform destination to latitude, longtude
    // https://geocoding-api.open-meteo.com/v1/search


async function transformDestination(destination, selectedDate) {
    console.log("transformDestination f loaded")  

    if (!destination) {
    console.log("No destination yet");
    return;
    }

    console.log("Destination:" + destination);
    console.log("transformDestination function loaded");
    const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;

    console.log("Geocoding URL:", url);

    



    try {
      const response = await fetch(url);

      if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Geocoding response:", data);

    if (!data.results || data.results.length === 0) {
    throw new Error("Lokacije ni bilo mogoče najti.");
    }

    const latitude = data.results[0].latitude;

    const longitude = data.results[0].longitude;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    loadWeather(latitude, longitude, selectedDate);
  } catch (error) {
    console.error("Napaka pri pretvorbi lokacije:", error);
  } 
}



    // Fetch data for selected destination and date

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  61: "🌧️",
  71: "❄️",
  95: "⛈️"
};

async function loadWeather(latitude,longitude, selectedDate) {
   console.log("Prejel sem:" + latitude, longitude, selectedDate);
  const url =
  "https://archive-api.open-meteo.com/v1/archive" +
  `?latitude=${latitude}` +
  `&longitude=${longitude}` +
  `&start_date=${selectedDate}` +
  `&end_date=${selectedDate}` +
  `&timezone=auto` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min`;

  console.log("URL za vreme:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Response:", data);

    console.log("Weather code:", data.daily.weather_code[0]);
    console.log("Icon:", weatherIcons[data.daily.weather_code[0]]);

    document.getElementById("hist_weather_code").textContent =
      `${weatherIcons[data.daily.weather_code[0]]} `;

    document.getElementById("max_temperature").textContent =
      `${data.daily.temperature_2m_max[0]} °C`;

    document.getElementById("min_temperature").textContent =
      `${data.daily.temperature_2m_min[0]} °C`;

   
  } catch (error) {
    console.error("Napaka pri pridobivanju vremena:", error);
    document.getElementById("max_temperature").textContent =
      "Podatek ni na voljo";
    document.getElementById("min_temperature").textContent =
      "Podatek ni na voljo";
    document.getElementById("hist_weather_code").textContent =
      "Podatek ni na voljo";
  }
  
}









    







    // Initializing map based on Ljublana's coordinates; L stands for Leaflet library

  


    // const URL = https://archive-api.open-meteo.com/v1/archive
    // const open-meteoURL = https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2026-09-08&end_date=2026-09-22&daily=weather_code,temperature_2m_max,temperature_2m_min

    // 1. Inicializacija zemljevida na koordinatah Ljubljane
const map = L.map('map').setView([46.0569, 14.5058], 13);

// 2. Dodajanje brezplačne podlage (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. Kako rešiti problem manjkajočih krajev? Klik kamor koli na zemljevidu!
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    console.log(`Uporabnik je izbral koordinate: ${lat}, ${lng}`);
    // Tukaj sedaj pokličeš svoj API za zgodovino vremena
});

/* 4. Iskanje preko polja (primer klica na Nominatim API med tipkanjem)
async function isciKraj(vnos) {

    const response = await fetch(`https://openstreetmap.org${vnos}`);
    const podatki = await response.json();
    
    // Podatki vsebujejo polje objektov z 'lat' in 'lon' za vsak najden kraj
    return podatki;
}

*/

  
    
