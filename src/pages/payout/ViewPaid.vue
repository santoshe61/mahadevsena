<template>
  <div class="q-pa-md">
    <q-table
      :title="`${$route.meta.title} ( ${$route.meta.caption} )`"
      :rows="payoutStore.payouts"
      :columns="columns"
      :filter="filter"
      v-model:pagination="pagination"
      :visible-columns="visibleColumns"
      no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results"
      row-key="Mobile"
      :loading="loading"
      binary-state-sort
      @request="onRequest"
    >
      <template #top-right>
        <q-input
          dense
          debounce="1000"
          v-model="filter"
          clearable
          placeholder="Search" title="Search Mobile or Paid Time"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template #no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Well this is sad... {{ message }} </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>

      <template #header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left q-table--dense">
              <table class="q-table">
                <tbody>
                  <template v-for="(val, col) of props.row" :key="col">
                    <template v-if="!visibleColumns.includes(col)">
                      <tr>
                        <td>{{ col.replaceAll("_", " ") }}</td>
                        <td style="width: 80%">
                          <b class="wrap-text q-mb-lg">{{ val }}</b>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Approve Request #{{ promptRequest.Payout_ID }} of
            {{ promptRequest.Mobile }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="column q-gutter-md">
            <div class="col">
              <q-input
                label="Amount Paid *"
                outlined
                no-error-icon
                v-model.number="promptRequest.Paid_Amount"
                :rules="[
                  $v.required,
                  $v.number(1, promptRequest.Request_Amount),
                ]"
                :hint="`Requested Amount : ${promptRequest.Request_Amount}`"
              />
            </div>
            <div class="col">
              <q-input
                autogrow
                label="Payout Details *"
                type="textarea"
                outlined
                autofocus
                v-model="promptRequest.Paid_Details"
                counter
                :rules="[$v.required, $v.text(30, 500, /(?:)/)]"
                maxlength="500"
              />
            </div>
            <div class="col">
              <b>Request Details :</b>
              {{ promptRequest.Request_Details }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="text-primary">
          <q-btn flat color="negative" label="Cancel" v-close-popup />
          <q-space></q-space>
          <q-btn outline color="positive" label="Pay" @click="payRequest" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
  import { ref, onMounted } from "vue";
  import usePayoutStore from "./payout";
  import { validations as $v } from "bestwebs";

  const prompt = ref(false);
  const promptRequest = ref({});
  const payoutStore = usePayoutStore();
  const filter = ref("");
  const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: payoutStore.count,
  });
  const visibleColumns = ref([
    "Payout_ID",
    "Mobile",
    "Name",
	  "Request_Amount",
	"Paid_Amount",
	"Request_Time",
	"Paid_Time",
    // "Status",
    // "Request_Details",
	// "Paid_Details",
	// "Referer",
  ]);
  // const cnsl = ref(console);
  const loading = ref(false);
  const columns = ref([]);
  onMounted(() => {
    loading.value = true;
    payoutStore
      .fetchPayouts({ pagelength: pagination.value.rowsPerPage, Status: -2 })
      .then((res) => {
        pagination.value.rowsNumber = res.meta.count;
        columns.value = Object.keys(payoutStore.payouts[0]).map((key) => {
          let column = {
            name: key,
            field: key,
            label: key.replace("_", " "),
            align: "left",
            // format: (val) => `${val}`,
            // required: true,
            // sortable: true,
            // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
          };
          if (key == "Request_Time" || key == "Paid_Time") {
            column.format = (val) => new Date(val).toLocaleString();
          }
          return column;
        });
      })
      .finally((err) => {
        loading.value = false;
      });
  });

  function onRequest(props) {
    loading.value = true;
    payoutStore
      .fetchPayouts({
        page: props.pagination.page,
        filter: props.filter || "",
        pagelength: props.pagination.rowsPerPage,
        Status: 2,
      })
      .then((res) => {
        pagination.value = { ...props.pagination, rowsNumber: res.meta.count };
      })
      .finally((err) => {
        loading.value = false;
      });
  }

  function proceedToPay(request) {
    console.log(request);
    prompt.value = true;
    promptRequest.value = request;
    promptRequest.value.Paid_Amount = request.Request_Amount;
    promptRequest.value.Paid_Details = `Name: ${request.Name}\nAccount IFSC: ${request.Account_IFSC}\nAccount Number: ${request.Account_Number}\nAccount Name: ${request.Account_Name}\nAccount UPI: ${request.Account_UPI}\nDetails: -\n`;
  }

  function payRequest() {
    payoutStore.approvePayout(
      promptRequest.value.Payout_ID,
      promptRequest.value
    ).then(() => {
      prompt.value = false;
      promptRequest.value = {};
    })
  }
</script>
<style>
  .wrap-text {
    white-space: pre-line;
    word-break: keep-all;
  }
</style>
