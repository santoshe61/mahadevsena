import { boot } from 'quasar/wrappers'
// import { directives } from "bestwebs/vue";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
export default boot(({ app }) => {
	app.directive("case", function (el, { value }) {
		el = el.querySelector("input,select,textarea");
		// UPPERCASE
		if (value == "upper") el.value = el.value.toUpperCase()
		// lowercase
		else if (value == "lower") el.value = el.value.toLowerCase()
		// PascalCase
		else if (value == "pascal") el.value = el.value.split(/[-_,\s]+/).map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join('');
		// camelCase
		else if (value == "camel") {
			el.value = el.value.split(/[-_,\s]+/).map((w, i) => {
				return i == 0 ? w.toLowerCase() : w[0].toUpperCase() + w.substring(1).toLowerCase();
			}).join('');
		}
		// snake_case
		else if (value == "snake") el.value = el.value.split(/[-_,\s]+/).map(w => w.toLowerCase()).join("_")
		// kebab-case
		else if (value == "kebab") el.value = el.value.split(/[-_,\s]+/).map(w => w.toLowerCase()).join("-")
		// Title case
		else if (value == "title" || value == "sentence") el.value = el.value[0].toUpperCase() + el.value.substring(1).toLowerCase()
		// Capital Case
		else if (value == "capital" || value == "capitalize") el.value.split(/[-_\s]+/).map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ');
	})
})