<template>
  <q-layout view="lHh Lpr lFf">
    <TopBar @toggle-left-drawer="toggleLeftDrawer" />

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <SideBar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref } from "vue";
  import SideBar from "./SideBar.vue";
  import TopBar from "./TopBar.vue";
  const leftDrawerOpen = ref(false);

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }
</script>
