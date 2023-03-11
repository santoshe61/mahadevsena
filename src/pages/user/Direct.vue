<template>
  <div class="q-pa-md">
    <q-table
      :title="`${$route.meta.title} ( ${$route.meta.caption} )`"
      :rows="userStore.users"
      :columns="columns"
      :visible-columns="visibleColumns"
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
          dense
          debounce="1000"
          v-model="filter"
          clearable
          placeholder="Search"
          title="Search Mobile or Referer Mobile or Name"
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
            <span v-if="col.name == 'Status'">
              <q-btn
                icon="edit_note"
                title="Edit"
                size="md"
                color="primary"
                flat
                :to="`/user/add/${props.row.Mobile}`"
              />
              <q-btn
                v-if="col.value > 0"
                @click="changeStatus(props.row.Mobile, 0)"
                icon="block"
                title="Block"
                size="md"
                color="negative"
                flat
              />
              <q-btn
                v-else
                @click="changeStatus(props.row.Mobile, 2)"
                icon="check_circle_outline"
                title="Unblock"
                size="md"
                color="positive"
                flat
              />
              <q-badge v-if="col.value > 0" color="positive" label="Active" />
              <q-badge v-else color="negative" label="Inactive" />
            </span>
            <span v-else>{{ col.value }}</span>
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
                        <td>{{ col.replace("_", " ") }}</td>
                        <td style="width: 80%">
                          <b>{{ val }}</b>
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
  </div>
</template>
<script setup>
  import { ref, onMounted } from "vue";
  import useUserStore from "./user";
  import { auth } from "bestwebs";

  //   let rows = ref([]);
  const userStore = useUserStore();
  const filter = ref("");
  const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: userStore.count,
  });
  // const cnsl = ref(console);
  const loading = ref(false);
  const columns = ref([]);
  const visibleColumns = ref([
    "Mobile",
    "Referer",
    "Name",
    "Referer_Name",
    "Time",
  ]);
  // console.log(auth().Mobile);
const mobile = auth().Mobile;
  onMounted(() => {
    userStore
      .fetchDirect({
        pagelength: pagination.value.rowsPerPage,
        filter: mobile,
      })
      .then((res) => {
        pagination.value.rowsNumber = res.meta.count;
        columns.value = [
          {
            name: "Mobile",
            field: "Mobile",
            label: "कार्यकर्ता मोबाइल",
            align: "left",
            format: (val) => val === mobile ? mobile+" ( स्वयं )" : val,
          },
          {
            name: "Name",
            field: "Name",
            label: "कार्यकर्ता नाम",
            align: "left",
          },
          {
            name: "Time",
            field: "Time",
            label: "समय",
            align: "left",
            format: (val) => new Date(val).toLocaleString(),
          },
        ];
      });
  });

  function onRequest(props) {
    loading.value = true;
    userStore
      .fetchDirect({
        page: props.pagination.page,
        filter: props.filter || "",
        pagelength: props.pagination.rowsPerPage,
      })
      .then((res) => {
        loading.value = false;
        pagination.value = { ...props.pagination, rowsNumber: res.meta.count };
      });
  }

  function changeStatus(Mobile, Status) {
    userStore.updateUser(Mobile, { Status });
  }
</script>
