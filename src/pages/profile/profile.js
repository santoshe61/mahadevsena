import { defineStore } from "pinia";
import { http, auth } from "bestwebs";
import client from "/src/config/index"

const authUser = auth();
delete authUser.isAdmin;
delete authUser.Token;
let profileAPI = client.api + "/profile";

const useUserStore = defineStore("profile", {
	state() {
		return {
			authUser,
			count: 0,
			dashboard: {}
		}
	},
	actions: {
		getDashboard() {
			return http
				.get(profileAPI)
				.then((res) => {
					this.dashboard = res.body[0];
					// authUser.Balance = res.body[0].Balance;
					auth({ ...auth(), Balance: res.body[0].Balance });
				});
		},
		updateProfile(data) {
			return http
				.patch(profileAPI, data)
				.then(() => {
					return this.authUser = auth({ ...authUser , ...data});
				});
		},
		updatePassword(data) {
			return http
				.patch(profileAPI + "/changepass", data);
		},
		requestPayout(data) {
			return http
				.patch(profileAPI + "/payout-request", data);
		}
	}
});
export default useUserStore;