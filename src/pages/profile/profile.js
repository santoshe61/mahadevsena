import { defineStore } from "pinia";
import { http, auth } from "bestwebs";
import client from "/src/config/index"

const authUser = auth();

let profileAPI = client.api + "/profile";

const useUserStore = defineStore("profile", {
	state() {
		return {
			authUser,
			count: 0,
		}
	},
	actions: {
		updateProfile(data) {
			return http
				.patch(profileAPI, data)
				.then(() => {
					return this.authUser = auth({ ...authUser , ...data});
				});
		},
	}
});
export default useUserStore;