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
                label="परिचयकर्ता का मोबाइल नंबर"
                v-model="data.Referer"
                lazy-rules
                bottom-slots
                :rules="[$v.required, $v.mobile]"
                maxlength="10"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="search"
                    @click="fetchReferer"
                  >
                    <!-- <q-icon name="search" class="cursor-pointer" /> -->
                  </q-btn>
                </template>
                <template v-slot:hint>
                  <p v-if="referer.Name" class="text-positive">
                    परिचयकर्ता का नाम: {{ referer.Name }}
                  </p>
                  <p v-else class="text-red">{{ referer.error }}</p>
                </template>
              </q-input>
              <template v-if="referer.Name">
                <q-input
                  filled
                  v-model="data.Name"
                  label="Your Name"
                  lazy-rules
                  required
                  :rules="[$v.required, $v.text(1, 100)]"
                />
                <q-input
                  filled
                  v-model="data.Mobile"
                  label="Your Mobile"
                  required
                  lazy-rules
                  :rules="[$v.required, $v.mobile]"
                  maxlength="10"
                />
                <q-input
                  filled
                  v-model="data.Email"
                  label="Your Email"
                  lazy-rules
                  :rules="[$v.email, $v.text(1, 100)]"
                  maxlength="100"
                />
                <q-input
                  type="password"
                  filled
                  required
                  v-model="data.Password"
                  label="Password"
                  lazy-rules
                  :rules="[$v.required, $v.text(1, 128)]"
                  maxlength="128"
                />
              </template>

              <div class="flex row q-mt-lg">
                <q-btn
                no-caps
                label="Go back to login"
                to="/login"
                type="button"
                color="red"
                flat
                />
                <q-space />
                <q-btn
                  label="Register"
                  type="submit"
                  color="primary"
                  v-if="referer.Name"
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
  import { validations as $v, noty } from "bestwebs";
  import useAuthStore from "./auth";

  const authStore = useAuthStore();
  // fetchReferer

  let data = ref({});
  let referer = ref({
    error: "Please enter your referer's mobile number, then click search icon",
  });

  function fetchReferer(e) {
    if (data.value.Referer.length !== 10) {
      noty("danger", "Please enter correct mobile number");
    } else if (e.isTrusted) {
      authStore
        .fetchReferer(data.value.Referer)
        .then((res) => {
          if (res) {
            referer.value = res;
          } else {
            referer.value = {
              error: "No referer found with Mobile " + data.value.Referer,
            };
          }
        })
        .catch((err) => {
          referer.value = {
            error: `Unable to fetch referer with mobile ${data.value.Referer}, try later`,
          };
        });
    }
  }
function onSubmit(e) {
  if (data.value.Referer.length !== 10 || data.value.Mobile.length !== 10) {
    return noty("danger", "Please enter correct mobile number");
  } else if (data.value.Referer === data.value.Mobile) {
    return noty("danger", "Referer's and Your's mobile number cannot be same");
  } else if (e.isTrusted) {
    authStore.register(data.value).then(() => {
      data.value = {};
      referer = {
        error:
          "Please enter your referer's mobile number, then click search icon",
      };
    });
  }
  }
</script>

<style>
  .bg-image {
    background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
