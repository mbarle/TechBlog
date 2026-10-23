/*
PREGLED VSEBINE DATOTEKE

1. Form input
   Pridobivanje obrazca ter vnosnih polj za destinacijo in datum.

2. Odpiranje koledarja
   Klik kjerkoli v datumskem polju odpre koledar,
   če brskalnik podpira showPicker().

3. Form output
   Pridobivanje elementov za prikaz izbrane destinacije in datuma.

4. Datumske omejitve
   Določitev današnjega datuma in datuma pred 20 leti.
   Funkcija formatDateForInput() pripravi lokalni datum
   v obliki YYYY-MM-DD, ki jo zahteva HTML-polje type="date".
   Izbira datuma je omejena na zadnjih 20 let do danes.

5. Oddaja obrazca – event listener
   Preprečitev privzetega pošiljanja obrazca.
   Preverjanje, ali sta destinacija in datum izpolnjena.
   Prikaz izbire ter klic funkcije transformDestination().

6. Pretvorba destinacije v zemljepisne koordinate
   Funkcija transformDestination() pridobi latitude in longitude
   prek Open-Meteo Geocoding API ter pokliče loadWeather().
   https://geocoding-api.open-meteo.com/v1/search

7. Pridobivanje in prikaz zgodovinskega vremena
   Objekt weatherIcons povezuje izbrane vremenske kode z ikonami.
   Funkcija loadWeather() pridobi vremensko kodo ter najvišjo
   in najnižjo temperaturo za izbrane koordinate in datum.
   Ob napaki prikaže »Podatek ni na voljo«.
   https://archive-api.open-meteo.com/v1/archive

8. Inicializacija zemljevida
   Leaflet (L) ustvari zemljevid s središčem v Ljubljani.

9. Podlaga zemljevida
   Dodajanje podlage OpenStreetMap.

10. Klik na zemljevid
    Pridobivanje in izpis koordinat izbrane točke.
    Klic API-ja za vreme na tem mestu še ni dodan.

11. Iskanje krajev – zakomentiran osnutek
    Na koncu je neaktiven osnutek funkcije isciKraj()
    za iskanje krajev prek Nominatim API.
    URL v osnutku še ni ustrezen za takšno iskanje.

REFERENČNI PRIMER URL-JA ZA VREME
https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2026-09-08&end_date=2026-09-22&daily=weather_code,temperature_2m_max,temperature_2m_min
*/


import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";


// Form input
    const form = document.getElementById("destination-form");
    const destinationInput = document.getElementById("destination");
    const dateInput = document.getElementById("selected-date");

// Omogoči, da pod Select a date kliknes kjerkoli za prikaz koledarja 

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
      
    });

    // transform destination to latitude, longtude with https://geocoding-api.open-meteo.com/v1/search

    async function transformDestination(destination, selectedDate) { 

    if (!destination) {
    console.log("No destination yet");
    return;
    }

    console.log("Destination:" + destination);
    console.log("transformDestination function loaded");
    const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;


    try {
      const response = await fetch(url);

      if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
    throw new Error("Lokacije ni bilo mogoče najti.");
    }

    const latitude = data.results[0].latitude;

    const longitude = data.results[0].longitude;

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
  const url =
  "https://archive-api.open-meteo.com/v1/archive" +
  `?latitude=${latitude}` +
  `&longitude=${longitude}` +
  `&start_date=${selectedDate}` +
  `&end_date=${selectedDate}` +
  `&timezone=auto` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    document.getElementById("hist_weather_code").textContent =
      `${weatherIcons[data.daily.weather_code[0]]} `;

    document.getElementById("max_temperature").textContent =
      `${data.daily.temperature_2m_max[0]} °C`;

    document.getElementById("min_temperature").textContent =
      `${data.daily.temperature_2m_min[0]} °C`;

   
  } catch (error) {
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

  
    
