let config = {
	name: "Mahadev Sena",
	company: "Mahadev Sena",
	url: "www.mahadevsena.in",
	email: "info@mahadevsena.in",
	mobile: "",
	address: "Paschim Vihar, Delhi",
	comission: {
		l1: 30,
		l2: 25,
		l3: 20,
		l4: 15,
		l5: 10,
	}
}
if (window.location.hostname.includes("mahadevsena.org")) {
	config.api = "/api";
} else {
	config.api = "http://localhost:5000/api";
}
export default config;