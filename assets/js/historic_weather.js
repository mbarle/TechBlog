import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";



    console.log("JS loaded");

    const form = document.getElementById("destination-form");
    const destinationInput = document.getElementById("destination");
    const dateInput = document.getElementById("selected-date");

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
      console.log("Destination:" + destination);
      console.log(selectedDate);
      console.log()
    });

    // transform destination to latitude, longtude

    // https://geocoding-api.open-meteo.com/v1/search

    // Initializing map based on Ljublana's coordinates; L stands for Leaflet library

  


    // const URL = https://archive-api.open-meteo.com/v1/archive

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

  
    
