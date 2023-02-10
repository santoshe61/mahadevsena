<template>
  <q-form @submit.prevent.stop="onSubmit" @reset="onReset" class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <TitleBar />
        <div class="row q-my-xs q-col-gutter-lg">
          <q-input
            outlined
            required
            v-model="data.Referer"
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            label="परिचयकर्ता (Referer) Mobile Number *"
            label-color="warning"
            color="warning"
            lazy-rules
            :rules="[$v.required, $v.mobile]"
            maxlength="10"
            :hint="`${referer.Name ? 'Name: ' + referer.Name : ''}`"
            :error="!!referer.error"
            :error-message="referer.error"
          >
            <template v-slot:prepend>
              <q-icon name="phone_iphone" />
            </template>
          </q-input>
          <q-input
            outlined
            :disable="!!editMember"
            required
            v-model="data.Mobile"
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            label="कार्यकर्ता (Activist) Mobile Number *"
            label-color="warning"
            color="warning"
            lazy-rules
            :rules="[$v.required, $v.mobile]"
            maxlength="10"
            :error="!!member.error"
            :error-message="member.error"
          >
            <template v-slot:prepend>
              <q-icon name="phone_iphone" />
            </template>
          </q-input>
        </div>
        <div class="row q-my-xs q-col-gutter-lg">
          <q-input
            outlined
            required
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Name"
            label="कार्यकर्ता (Activist) Name *"
            label-color="warning"
            color="warning"
            lazy-rules
            :rules="[$v.required, $v.text(2, 100)]"
            maxlength="100"
          />
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Password"
            label="Password *"
            label-color="warning"
            color="warning"
            lazy-rules
            :rules="[$v.required, $v.text(6, 128)]"
            maxlength="128"
          />
        </div>
        <div class="row q-my-xs q-col-gutter-lg">
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Account_IFSC"
            label="Bank Account IFSC"
            lazy-rules
            :rules="[$v.ifsc]"
            maxlength="11"
          />
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Account_Number"
            label="Bank Account Number"
            lazy-rules
            :rules="[$v.min(99999)]"
            maxlength="20"
          />
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Account_Name"
            label="Bank Account Name"
            lazy-rules
            :rules="[$v.text(2, 100)]"
            maxlength="100"
          />
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Account_UPI"
            label="Bank Account UPI ID"
            lazy-rules
            :rules="[$v.upi]"
            maxlength="100"
          />
        </div>
        <div class="row q-my-xs q-col-gutter-lg">
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.Email"
            label="Email"
            lazy-rules
            :rules="[$v.email]"
            maxlength="100"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
            v-model="data.PAN"
            label="PAN Number"
            lazy-rules
            :rules="[$v.pan]"
            maxlength="10"
          />
          <q-input
            outlined
            class="col-12 col-xs-6 col-md-4 col-sm-6"
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
  import { ref, watch, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { validations as $v, noty, random } from "bestwebs";
import useUserStore from "./user";
  import TitleBar from "@/layouts/TitleBar.vue";

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  let rand = random(1, 9);
  let dummyData = {
    Name: "",
    Mobile: "",
    Password: "",
    Referer: "",
    Email: "",
    Account_IFSC: null,
    Account_Number: null,
    Account_Name: null,
    Account_UPI: null,
    PAN: null,
    AADHAR: null,
  };
  const data = ref(dummyData);
  const editMember = ref("");
  const referer = ref({});
  const member = ref({});

  function mobileWatcher(type = "Referer", value) {
    if (value?.length !== 10) return;
    userStore
      .fetchUsers({ Mobile: value })
      .then((res) => {
        if (res.body.length > 0) {
          if (type === "Referer") {
            referer.value = res.body[0] || {};
          } else {
            member.value = {
              error:
                res.body[0].Name + " already registered with Mobile " + value,
            };
          }
        } else {
          if (type === "Referer") {
            referer.value = {
              error: "No Referer found with Mobile " + value,
            };
          } else {
            member.value = {};
          }
        }
      })
      .catch((err) => {
        if (type === "Referer") {
          referer.value = {
            error: error.message,
          };
        } else {
          member.value = {
            error: error.message,
          };
        }
      });
  }

  watch(
    () => data.value.Referer,
    function (newReferer) {
      mobileWatcher("Referer", newReferer);
    }
  );

  watch(
    () => data.value.Mobile,
    function (newMobile) {
      mobileWatcher("Mobile", newMobile);
    }
  );

  function onSubmit() {
    if (data.value.Referer === data.value.Mobile) {
      noty("danger", "Referer's and Member's Mobile Number cannot be same");
      return false;
    } else if (member.value.error) {
      noty("danger", member.value.error);
      return false;
    } else if (referer.value.error) {
      noty("danger", referer.value.error);
      return false;
    }
    if (editMember.value) {
      userStore.updateUser(editMember.value, data.value).then(function () {
        data.value = { dummyData };
        editMember.value = "";
        router.push("/user/add");
      });
    } else {
      // console.log(data.value);
      userStore.addUser(data.value).then(function () {
        data.value = { dummyData };
      });
    }
  }

  function onReset() {
    data.value = { dummyData };
  }

  onMounted(function () {
    if (route.params.mobile) {
      editMember.value = route.params.mobile;
      userStore.fetchUsers({ Mobile: route.params.mobile }).then((res) => {
        if (res.body[0]) {
          data.value = res.body[0];
        } else {
          noty(
            "danger",
            "No Member found to edit with Mobile " + route.params.mobile
          );
        }
      });
    }
  });
</script>
