const result = document.querySelector(".result");
const form = document.querySelector(".get-weather");
const nameCity = document.querySelector("#city");
const nameCountry = document.querySelector("#country");

/* This code is adding an event listener to the form element that listens for a "submit" event. When
the form is submitted, the function inside the event listener is executed. The first line of the
function prevents the default behavior of the form, which is to reload the page. Then, the function
checks if the values of the nameCity and nameCountry input fields are empty. If either of them is
empty, it calls the showError function with an error message and returns. If both fields have
values, it calls the callApi function with the values of the input fields as arguments. */
form.addEventListener("submit", (e) => {
	e.preventDefault();

	if (nameCity.value === "" || nameCountry.value === "") {
		showError("Ambos campos son obligatoprios");
		return;
	}

	callApi(nameCity.value, nameCountry.value);
});

/**
 * The function calls the OpenWeatherMap API to retrieve weather data for a given city and country, and
 * displays the data on the webpage.
 * @param city - the name of the city for which you want to get weather information.
 * @param country - The country parameter is a string that represents the name of the country for which
 * the weather information is being requested.
 */
function callApi(city, country) {
	const apiId = "df6e9ad4affcd06ce4ad2c41ce0d5a7b";
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

	fetch(url)
		.then((data) => {
			return data.json();
		})

		.then((dataJSON) => {
			if (dataJSON.cod === 404) {
				showError("Ciudad no encontrada...");
			} else {
				clearHtml();
				showWeather(dataJSON);
			}
			console.log(dataJSON);
		})
		.catch((error) => {
			console.log(error);
		});
}

/**
 * The function displays weather data for a given location in a formatted HTML element.
 * @param data - an object containing weather data, including the city name, temperature, minimum
 * temperature, maximum temperature, and weather icon.
 */
function showWeather(data) {
	const {
		name,
		main: { temp, temp_min, temp_max },
		weather: [arr],
		sys: { country },
	} = data;
	const degrees = kelvinToCentigrade(temp);
	const min = kelvinToCentigrade(temp_min);
	const max = kelvinToCentigrade(temp_max);

	const content = document.createElement("div");
	content.innerHTML = `<h5>Clima en ${name} ${country}</h5>
	<img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
	<h2>${degrees}°C</h2>
	<p>Max:${max}°C</p>
	<p>Min:${min}°C</p>`;

	result.appendChild(content);
}

/**
 * The function logs an error message and displays it as an alert on a web page for a limited time.
 * @param message - The error message that will be displayed in the console and as an alert message on
 * the webpage.
 */
function showError(message) {
	console.log(message);
	const alert = document.createElement("p");
	alert.classList.add("alert-message");
	alert.innerHTML = message;

	form.appendChild(alert);
	setTimeout(() => {
		alert.remove();
	}, 2000);
}

/**
 * The function converts a temperature value in Kelvin to Celsius.
 * @param temp - The temperature in Kelvin that needs to be converted to Celsius.
 * @returns The function `kelvinToCentigrade` is returning the temperature in Celsius after converting
 * it from Kelvin.
 */
function kelvinToCentigrade(temp) {
	return parseInt(temp - 273.15);
}

/**
 * The function clears the HTML content of an element with the ID "result".
 */
function clearHtml() {
	result.innerHTML = "";
}
