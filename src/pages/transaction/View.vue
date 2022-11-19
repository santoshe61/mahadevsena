<template>
  <div class="q-pa-md">
    <q-table
      title="View Transactions"
      :rows="transactionStore.transactions"
      :columns="columns"
      :filter="filter"
      v-model:pagination="pagination"
      no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results"
      row-key="Mobile"
      :loading="loading"
      binary-state-sort
      @request="onRequest"
    >
      <template #top-right>
        <q-input
          clearable
          dense
          debounce="1000"
          v-model="filter"
          placeholder="Search"
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

    </q-table>
  </div>
</template>
<script setup>
  import { ref, onMounted } from "vue";
import useTransactionStore from "./transaction";


  //   let rows = ref([]);
  const transactionStore = useTransactionStore();
  const filter = ref("");
  const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: transactionStore.count,
  });
  // const cnsl = ref(console);
  const loading = ref(false);
  const columns = ref([]);

  onMounted(() => {
    transactionStore
      .fetchTransactions({ pagelength: pagination.value.rowsPerPage })
      .then((res) => {
        pagination.value.rowsNumber = res.meta.count;
        columns.value = Object.keys(transactionStore.transactions[0]).map((key) => {
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
          if (key == "Time") {
            column.format = (val) => new Date(val).toLocaleString();
          }
          return column;
        });
      });
  });

  function onRequest(props) {
    loading.value = true;
    transactionStore
      .fetchTransactions({
        page: props.pagination.page,
        filter: props.filter || "",
        pagelength: props.pagination.rowsPerPage,
      })
      .then((res) => {
        loading.value = false;
        pagination.value = { ...props.pagination, rowsNumber: res.meta.count };
      });
  }
</script>
