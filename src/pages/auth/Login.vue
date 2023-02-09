<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="105px" class="absolute-center shadow-10">
              <img src="/src/assets/logo.png" height="100px" width="100px" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Mahadev Sena ( महादेव सेना )</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="onSubmit">
              <q-input
                filled
                v-model="data.Mobile"
                label="Username"
                lazy-rules
                :rules="[$v.required, $v.mobile]"
                maxlength="10"
              />

              <q-input
                type="password"
                filled
                v-model="data.Pass"
                label="Password"
                lazy-rules
                :rules="[$v.required, $v.text(4, 128)]"
                maxlength="128"
              />

              <div class="flex row">
                <q-btn
                  label="Click here to Register"
                  no-caps
                  to="/register"
                  type="button"
                  color="red"
                  flat
                />
                <q-space />
                <q-btn label="Login" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref } from "vue";
  import { validations as $v } from "bestwebs";
  import useAuthStore from "./auth";

  const authStore = useAuthStore();

  let data = ref({});
  function onSubmit(e) {
    if (e.isTrusted) {
      authStore.login(data.value);
    }
  }
</script>

<style>
  .bg-image {
    background-image: linear-gradient(135deg, #d95b1e 0%, #d95b1e33 100%);
  }
</style>
