<template>
  <q-form @submit.prevent.stop="onSubmit" @reset="onReset" class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <TitleBar />
        <div class="row q-my-xs q-gutter-lg">
          <q-input
            outlined
            required
            v-model="data.Mobile"
            class="col"
            label="कार्यकर्ता (Activist) Mobile Number *"
            lazy-rules
            :rules="[$v.required, $v.mobile]"
            maxlength="10"
            :hint="`Name: ${member.Name}, Balance: ${member.Balance}`"
            :error="!!member.error"
            :error-message="member.error"
          >
            <template v-slot:prepend>
              <q-icon name="phone_iphone" />
            </template>
          </q-input>
          <q-input
            outlined
            required
            no-error-icon
            class="col"
            v-model.number="data.Request_Amount"
            label="Request Amount *"
            color="warning"
            lazy-rules
            :rules="[$v.required, $v.number(1, member.Balance)]"
            :max="member.Balance"
          />
        </div>
        <div class="row q-my-xs q-gutter-lg">
          <q-input
            type="textarea"
            outlined
            required
            class="col"
            v-model="data.Request_Details"
            label="Reason for request *"
            lazy-rules
            :rules="[$v.required, $v.text(30, 500, /(?:)/)]"
            maxlength="500"
            counter
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
  import { ref, watch } from "vue";
  import { validations as $v, noty } from "bestwebs";
  import usePayoutStore from "./payout";
import useUserStore from "../user/user.js";
  import TitleBar from "@/layouts/TitleBar.vue";

  const payoutStore = usePayoutStore();
  const userStore = useUserStore();

  let dummyData = {
    Mobile: "",
    Request_Amount: "",
    Request_Details: "",
  };
  const data = ref(dummyData);
  const member = ref({});

  watch(
    () => data.value.Mobile,
    function (newMobile) {
      if (newMobile?.length !== 10) return;
      userStore
        .fetchUsers({ Mobile: newMobile })
        .then((res) => {
          if (res.body.length > 0) {
            member.value = res.body[0] || {};
          } else {
            member.value = {
              error: "No Member found with Mobile " + newMobile,
            };
          }
        })
        .catch((err) => {
          member.value = {
            error: error.message,
          };
        });
    }
  );

  function onSubmit() {
    if (!data.value.Mobile) {
      noty("danger", "Member's Mobile Number cannot be blank");
      return false;
    } else if (data.value.Request_Amount > member.value.Balance) {
      noty("danger", "Request amount cannot be more then Member's balance");
      return false;
    } else if (member.value.error) {
      noty("danger", member.value.error);
      return false;
    }
    payoutStore.addPayout(data.value).then(function () {
      data.value = { dummyData };
    });
  }

  function onReset() {
    data.value = { dummyData };
  }
</script>
