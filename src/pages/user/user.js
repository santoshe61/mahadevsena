import { defineStore } from "pinia";
import { http } from "bestwebs";
import client from "/src/config/index"

let userAPI = client.api + "/user";

const useUserStore = defineStore("user", {
	state() {
		return {
			users: [],
			count: 0,
		}
	},
	actions: {
		fetchUsers({page=1, filter="", Mobile="", pagelength}) {
			return http
				.get(userAPI + (Mobile ? `/${Mobile}` : ""), {
					query: {
						page,
						filter,
						pagelength
					},
				})
				.then(res => {
					this.users = res.body;
					this.count = res.meta.count;
					return res;
				});
		},
		addUser(data) {
			return http
				.post(userAPI, data)
				.then(res => {
					this.users.push(res.req);
					return res;
				});
		},
		deleteUser(Mobile) {
			return http
				.delete(userAPI)
				.then(res => {
					this.users = this.users.filter(user => user.Mobile != Mobile)
					return res;
				});
		},
		updateUser(Mobile, data) {
			return http
				.patch(userAPI + (Mobile ? `/${Mobile}` : ""), data)
				.then(users => {
					this.users = this.users.map(user => {
						if (user.Mobile == Mobile) {
							return { ...user, ...data };
						} else return user;
					})
					return users;
				});
		},
	}
});
export default useUserStore;