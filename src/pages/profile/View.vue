<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section
        class="my-card column justify-center align-center"
        style="max-width: 440px"
      >
        <h6>Your Profile</h6>
        <q-markup-table flat bordered dense>
          <tbody>
            <tr v-for="(value, key) in profileStore.authUser">
              <td>{{ key.replaceAll("_", " ") }}</td>
              <td v-if="key == 'Time'">
                {{ new Date(value).toLocaleString() }}
              </td>
              <td v-else-if="key == 'Status'">
                <q-badge v-if="value > 1" color="positive">Active</q-badge>
                <q-badge v-else color="negative">Inactive</q-badge>
              </td>
              <td v-else>{{ value }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-separator />

      <q-card-actions class="q-pa-lg">
        <q-btn outline color="primary" to="/profile/edit">Update profile</q-btn>
        <q-space></q-space>
        <q-btn outline color="warning" @click="prompt = true"
          >Change Password</q-btn
        >
      </q-card-actions>
    </q-card>
    <q-dialog v-model="prompt" persistent>
      <div>
        <form @submit.prevent.stop="onSubmit" @reset="onReset">
          <q-card style="min-width: 350px">
            <q-card-section class="row item-center">
              <div class="text-h6">Change Password</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="column q-gutter-md">
                <div class="col">
                  <q-input
                    label="Current Password *"
                    outlined
                    no-error-icon
                    v-model.trim="data.OPassword"
                    :rules="[$v.required, $v.text(6, 128)]"
                  />
                </div>
                <div class="col">
                  <q-input
                    label="New Password *"
                    outlined
                    no-error-icon
                    v-model.trim="data.Password"
                    :rules="[$v.required, $v.text(6, 128)]"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator />

            <q-card-actions class="text-primary">
              <q-btn flat color="negative" label="Reset" type="reset" />
              <q-space></q-space>
              <q-btn outline color="positive" label="Change" type="submit" />
            </q-card-actions>
          </q-card>
        </form>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { validations as $v, noty } from "bestwebs";
  import useProfileStore from "./profile";

  const data = ref({});
  const prompt = ref(false);

  const profileStore = useProfileStore();

  function onSubmit() {
    if (data.value.OPassword == data.value.Password) {
      noty("danger", "Old and new password cannot be same");
      return false;
    } else if (
      data.value.OPassword?.length < 6 ||
      data.value.Password?.length < 6
    ) {
      noty("danger", "Password must be at least 6 characters");
      return false;
    }
    profileStore.updatePassword(data.value).then(function () {
      data.value = {};
      prompt.value = false;
    });
  }

  function onReset() {
    data.value = {};
  }
</script>
