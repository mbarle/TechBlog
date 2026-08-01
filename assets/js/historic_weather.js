const form = document.getElementById("destination-form");
    const destinationInput = document.getElementById("destination");
    const dateInput = document.getElementById("selected-date");

    const summary = document.getElementById("selection-summary");
    const selectedDestination =
      document.getElementById("selected-destination");
    const displayedDate =
      document.getElementById("displayed-date");

    // Današnji datum.
    const today = new Date();

    // Datum pred petimi leti.
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

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
    dateInput.min = formatDateForInput(fiveYearsAgo);
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
    });