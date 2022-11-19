import { defineStore } from "pinia";
import { http } from "bestwebs";
import client from "/src/config/index"

let payoutAPI = client.api + "/payout";

const usePayoutStore = defineStore("payout", {
	state() {
		return {
			payouts: [],
			count: 0,
		}
	},
	actions: {
		fetchPayouts({ page = 1, filter = "", pagelength, Mobile = "", Status }) {
			return http
				.get(payoutAPI + (Mobile ? `/${Mobile}` : ""), {
					query: {
						page,
						filter,
						pagelength,
						Status
					},
				})
				.then(res => {
					this.payouts = res.body;
					this.count = res.meta.count;
					return res;
				}).catch(err => {
					return res;
				});
		},
		addPayout(data) {
			return http
				.post(payoutAPI, data)
				.then(res => {
					this.payouts.push(res.req);
					return res;
				});
		},
		approvePayout(ID, data) {
			return http
				.patch(payoutAPI + `/${ID}`, data)
				.then(res => {
					this.payouts = this.payouts.filter(payout => payout.Payout_ID != ID);
					return res;
				});
		},
	}
});
export default usePayoutStore;