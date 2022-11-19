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
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="submit">
              <q-input
                filled
                v-model="form.Mobile"
                label="Username"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="form.Pass"
                label="Password"
                lazy-rules
              />

              <div class="flex row">
                <q-btn label="Login" type="submit" color="primary" />
                <q-space />
                <q-btn
                  label="Register"
                  to="/register"
                  type="button"
                  color="red"
                  flat
                />
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
  import { login } from "./service.js";

let form = ref({
  Mobile: 9718181389,
    Pass: "Sonuu1"
  });
  function submit(e) {
    login(form.value).then(function (data) {

    });
  }
</script>

<style>
  .bg-image {
    background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  }
</style>
