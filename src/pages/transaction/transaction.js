import { defineStore } from "pinia";
import { http } from "bestwebs";
import client from "/src/config/index"

let transactionAPI = client.api + "/transaction";

const useTransactionStore = defineStore("transaction", {
	state() {
		return {
			transactions: [],
			count: 0,
		}
	},
	actions: {
		fetchTransactions({page=1, filter="", pagelength}) {
			return http
				.get(transactionAPI, {
					query: {
						page,
						filter,
						pagelength
					}
				})
				.then(res => {
					this.transactions = res.body;
					this.count = res.meta.count;
					return res;
				});
		},
	}
});
export default useTransactionStore;