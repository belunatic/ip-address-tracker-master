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
// const map
//variables
let map;

//DOM loaded
document.addEventListener("DOMContentLoaded", apiFetch());

//fetch data
async function apiFetch(options = "") {
	try {
		const res = await fetch(
			`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}${options}`
		);

		if (!res.ok) {
			errorMessage.classList.remove("hidden");
			throw new Error(`Fetching error, status -> ${res.status}`);
		}
		//get the data
		const data = await res.json();
		console.log(data);
		displayResult(data);
		displayMap(data.location.lat, data.location.lng);
	} catch (error) {
		console.error(error);
	}
}

//display result in DOM
function displayResult(data) {
	ipAddress.textContent = data.ip;
	city.textContent = `${data.location.city}, ${data.location.region}`;
	zipCode.textContent = `${data.location.postalCode}`;
	timezone.textContent = `UTC ${data.location.timezone}`;
	isp.textContent = data.isp;
}

//display Map
function displayMap(lat, lon) {
	//check to see if map element is initiated
	//if so remove and add the new lat and lng
	if (map != undefined) {
		map.remove();
	}
	map = L.map("map").setView([lat, lon], 19);
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
	var myIcon = L.icon({
		iconUrl: "images/icon-location.svg",
		iconSize: [40, 50],
		// iconAnchor: [22, 94],
	});
	var marker = L.marker([lat, lon], { icon: myIcon }).addTo(map);
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
