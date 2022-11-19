import { http, auth } from "bestwebs";
import client from "/src/config/index"
export function login(body) {
	return http
		.post(client.api + "/auth/login", body)
		.then(data => {
			auth(data.body);
		})
		.catch(data => console.log(data));
}