<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title>
        {{ client.name }}
      </q-toolbar-title>
      <div>
        <q-btn-dropdown flat icon="person">
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 text-center">Wallet Points</div>
			  <h4 class="text-center"> {{user.Balance}}</h4>
			  <q-btn
			  class="q-mt-xl"
                color="primary"
                label="Profile"
                push
                size="md"
                v-close-popup
                to="/profile"
              />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">{{user.Name}}</div>

              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
                @click="logout"
              />
            </div>
          </div>
        </q-btn-dropdown>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
  import { ref, inject, defineEmits } from "vue";
  import { auth, noty } from "bestwebs";
  import { useRouter } from "vue-router";

const router = useRouter();
const user =  auth();

  const emits = defineEmits(["toggleLeftDrawer"]);

  const client = inject("client");

  function toggleLeftDrawer() {
    emits("toggleLeftDrawer");
  }

  function logout() {
    auth(null);
    router.push("/login");
    noty("success", "Logged  out succesfully");
  }
</script>
