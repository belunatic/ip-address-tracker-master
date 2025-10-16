import { API_KEY } from "./secret.js";
//get DOM elements
const form = document.getElementById("ip-form");
const ipInput = document.getElementById("ip-address");
//result DOM
const ipAddress = document.getElementById("ip");
const city = document.getElementById("city");
const zipCode = document.getElementById("zip-code");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const errorMessage = document.getElementById("error-message");

//DOM loaded
//document.addEventListener("DOMContentLoaded", apiFetch());

async function apiFetch(options = "") {
	try {
		const res = await fetch(
			`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}${options}`
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
	//remove the error message
	errorMessage.classList.add("hidden");
	let option = "";
	//regex
	let domainRegEx = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
	let ipRegEx =
		/^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	if (domainRegEx.test(ipInput.value)) {
		option = `&domain=${ipInput.value}`;
		apiFetch(option);
	} else if (ipRegEx.test(ipInput.value)) {
		option = `&ipAddress=${ipInput.value}`;
		apiFetch(option);
	} else if (ipInput.value === "") {
		option = "";
		apiFetch();
	} else {
		//add error message
		errorMessage.classList.remove("hidden");
	}
});
