<template>

      <q-list>
        <q-item-label header> {{client.company}} </q-item-label>

		<q-item
			v-for="link in routes"
		  clickable
		  tag="a"
		  :to="link.link"
		  exact
		>
		  <q-item-section
			v-if="link.icon"
			avatar
		  >
			<q-icon :name="link.icon" />
		  </q-item-section>

		  <q-item-section>
			<q-item-label>{{ link.title }}</q-item-label>
			<q-item-label caption>{{ link.caption }}</q-item-label>
		  </q-item-section>
		</q-item>
      </q-list>

</template>

<script setup>
import { inject } from "vue";
import { useRouter } from 'vue-router'
import { auth } from "bestwebs";

const client = inject("client");
const user = auth();

const router = useRouter();

let routes = router.options.routes[3].children.reduce((acc, r) => {
	if (r?.meta?.isAdmin) {
		if (!user.isAdmin) {
			return acc;
		}
	}
	acc.push({ link: r.path.split(":")[0] || "/", ...r.meta });
	return acc;
 }, []);

</script>
