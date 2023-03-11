<template>
  <q-form @submit.prevent.stop="onSubmit" @reset="onReset" class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <TitleBar />
        <div class="row q-my-xs q-gutter-lg">
          <q-input
            outlined
            disable
            filled
            class="col"
            v-model="data.Mobile"
            label="Mobile"
            label-color="negative"
            color="negative"
            hint="(Mobile can not be changed)"
          />
          <q-input
            outlined
            required
            class="col"
            v-model="data.Name"
            label="Your Name *"
            lazy-rules
            :rules="[$v.required, $v.text(2, 100)]"
            maxlength="100"
          />
        </div>
        <div class="row q-my-xs q-gutter-lg">
          <q-input
            outlined
            class="col"
            v-model="data.Account_IFSC"
            label="Bank Account IFSC"
            lazy-rules
            :rules="[$v.ifsc]"
            maxlength="11"
            v-case="'upper'"
          />
          <q-input
            outlined
            class="col"
            v-model="data.Account_Number"
            label="Bank Account Number"
            lazy-rules
            :rules="[$v.min(99999)]"
            maxlength="20"
          />
          <q-input
            outlined
            class="col"
            v-model="data.Account_Name"
            label="Name in Bank Account"
            lazy-rules
            :rules="[$v.text(2, 100)]"
            maxlength="100"
          />
          <q-input
            outlined
            class="col"
            v-model="data.Account_UPI"
            label="Bank Account UPI ID"
            lazy-rules
            :rules="[$v.upi]"
            maxlength="100"
            hint="Like. xyz@abc"
            v-case="'lower'"
          />
        </div>
        <div class="row q-my-xs q-gutter-lg">
          <q-input
            outlined
            class="col"
            v-model="data.Email"
            label="Email"
            lazy-rules
            :rules="[$v.email]"
            maxlength="100"
            v-case="'lower'"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input
            outlined
            class="col"
            v-model="data.PAN"
            label="PAN Number"
            lazy-rules
            :rules="[$v.pan]"
            maxlength="10"
            v-case="'upper'"
          />
          <q-input
            outlined
            class="col"
            v-model="data.AADHAR"
            label="AADHAR Number"
            lazy-rules
            :rules="[$v.aadhar]"
            maxlength="16"
            mask="#### #### ####"
          />
        </div>
      </q-card-section>
      <q-separator />

      <q-card-actions class="q-pa-lg">
        <q-btn flat color="negative" type="reset">Reset</q-btn>
        <q-space></q-space>
        <q-btn outline color="positive" type="submit">Save Details</q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup>
  import { ref } from "vue";
  import { validations as $v, noty, } from "bestwebs";
import useProfileStore from "./profile";
  import TitleBar from "@/layouts/TitleBar.vue";

  const profileStore = useProfileStore();
  const data = ref(profileStore.authUser);

  function onSubmit() {
    profileStore.updateProfile(data.value).then(function () {

    });
  }

  function onReset() {
    data.value = profileStore.authUser ;
  }
</script>
