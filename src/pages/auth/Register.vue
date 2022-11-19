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
              <div class="col text-h6 ellipsis">Register</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="submit">
              <q-input filled label="Referer Mobile" v-model="refererMobile" lazy-rules bottom-slots :rules="[validations.mobile]" maxlength="10">
                <template v-slot:append>
                      <q-btn flat round color="primary" icon="search" @click="fetchReferer">
                        <!-- <q-icon name="search" class="cursor-pointer" /> -->
                      </q-btn>
                </template>
                <template v-slot:hint>
                  <p :class="referer ? 'text-positive' : 'text-red'">{{refererMessage}}</p>
                </template>
              </q-input>
              <template v-if="referer">
                <q-input filled label="Name" lazy-rules />
                <q-input filled label="Mobile" required lazy-rules />
                <q-input filled label="Email" lazy-rules />

                <q-input type="password" filled label="Password" lazy-rules />
              </template>


              <div class="flex row q-mt-lg">
                <q-btn label="Register" to="/" type="button" color="primary" v-if="referer" />
                <q-space />
                <q-btn
                  label="Login"
                  to="/login"
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
import { validations } from "bestwebs";

let refererMobile = ref("");
let refererMessage = ref("Please enter your referer's mobile number, then click validate");
let referer = ref(false);

function fetchReferer(){
  console.log(refererMobile.value);
}
function submit(e) { }
</script>

<style>
  .bg-image {
    background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  }
  .cursor-pointer{
    cursor:pointer;
  }
</style>
