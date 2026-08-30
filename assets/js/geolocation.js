console.log("geolocation.js se je naložil");



function getWeather() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		console.log("Your browser does not support geolocation")
	}


function success(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;



	console.log("Pridobljena širina:", latitude);
    console.log("Pridobljena dolžina:", longitude);

	loadWeather(latitude, longitude);
	getLocationName(latitude, longitude);
}

async function getLocationName(latitude, longitude) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    const data = await response.json();

    console.log("Reverse geocoding:", data);

    const place =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality ||
        "Unknown location";


    const country = data.address.country;

    document.getElementById("location").textContent = `${place}, ${country}`;
}

// call of function to acquire weather 





}

function error(error) {
	console.error("Geolocation error code:", error.code);
    console.error("Geolocation error message:", error.message);
	document.getElementById("temperature").textContent =
    "Lokacija ni na voljo";
}

// getWeather();

document.addEventListener("DOMContentLoaded", () => {
  getWeather();
});



