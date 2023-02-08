import { defineStore } from "pinia";
import { http, auth } from "bestwebs";
import client from "/src/config/index"

let authAPI = client.api + "/auth";

const useAuthStore = defineStore("auth", {
	actions: {
		login(body) {
			return http
				.post(authAPI + "/login", body)
				.then(data => {
					auth(data.body);
				})
			// .catch(data => console.log(data));
		},
		register(body) {
			return http
				.post(authAPI + "/register", body)
				.then(data => {
					return data.body;
				})
			// .catch(data => console.log(data));
		},
		fetchReferer(Mobile) {
			return http
				.get(authAPI + `/${Mobile}`)
				.then(data => {
					return data.body[0];
				})
			// .catch(data => console.log(data));
		}
	}
});


export default useAuthStore;