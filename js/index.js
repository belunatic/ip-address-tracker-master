import { API_KEY } from "./secret.js";
//get DOM elements
const form = document.getElementById("ip-form");
const ipInput = document.getElementById("ip-address");
//result DOM
const ipAddress = document.getElementById("ip-address");
const city = document.getElementById("city");
const zipCode = document.getElementById("zip-code");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");

//DOM loaded
//document.addEventListener("DOMContentLoaded", apiFetch());

async function apiFetch(ip = "") {
	try {
		const res = await fetch(
			`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`
		);

		if (!res.ok) {
			throw new Error(`Fetching error, status -> ${res.status}`);
		}
		//get the data
		const data = await res.json();
		displayResult(data);
	} catch (error) {
		console.error(error);
	}
}

//display result in DOM
function displayResult(data) {
	ipAddress.textContent = data.ip;
	city.textContent = `${data.location.city}, ${data.location.region}`;
	timezone.textContent = `UTC ${data.location.timezone}`;
	isp.textContent = data.isp;
}

//form submission
form.addEventListener("submit", (e) => {
	e.preventDefault();
	apiFetch(ipInput.value);
});
