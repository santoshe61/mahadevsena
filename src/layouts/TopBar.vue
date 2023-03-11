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
        <q-btn-dropdown flat label="Profile">
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 text-center">Sena Points</div>
              <h4 class="text-center q-my-sm">{{ user.Balance }}</h4>
              <q-btn
                class="q-mt-lg"
                color="primary"
                label="Sena point request"
                push
                size="sm"
                v-close-popup
                @click="prompt = true"
              />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">{{ user.Name }}</div>

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
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Sena point request</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="column q-gutter-md">
            <div class="col">
              <q-input
                label="Request Amount *"
                outlined
                no-error-icon
                autofocus
                v-model.number="promptRequest.Request_Amount"
                :rules="[$v.required, $v.number(1, user.Balance)]"
                :hint="`Available points : ${user.Balance}`"
              />
            </div>
            <div class="col">
              <q-input
                label="कृपया पॉइंट्स प्राप्त करने का उपयुक्त कारण बताएं, किस प्रचार-प्रसार हेतु आवश्यकता है (Why you need this amount, please explain) *"
                type="textarea"
                no-error-icon
                outlined
                v-model="promptRequest.Request_Details"
                counter
                :rules="[$v.required, $v.text(30, 500, /(?:)/)]"
                maxlength="500"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-actions class="text-primary">
          <q-btn flat color="negative" label="Cancel" v-close-popup />
          <q-space></q-space>
          <q-btn
            outline
            color="positive"
            label="Submit Request"
            @click="payRequest"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-header>
</template>

<script setup>
  import { ref, inject, defineEmits } from "vue";
  import { validations as $v, auth, noty } from "bestwebs";
  import { useRouter } from "vue-router";
  import useProfileStore from "../pages/profile/profile";

  const profileStore = useProfileStore();

  const router = useRouter();
  const user = auth();

  const emits = defineEmits(["toggleLeftDrawer"]);

  const client = inject("client");

  const prompt = ref(false);
  const promptRequest = ref({});

  function toggleLeftDrawer() {
    emits("toggleLeftDrawer");
  }

  function logout() {
    auth(null);
    router.push("/login");
    noty("success", "Logged  out succesfully");
  }

  function payRequest() {
    if (promptRequest.value.Request_Amount > user.Balance) {
      return noty(
        "danger",
        "Request amount can not be more than your balance points"
      );
    }
    profileStore.requestPayout(promptRequest.value).then(() => {
      promptRequest.value = {};
      prompt.value = false;
    });
  }
</script>
