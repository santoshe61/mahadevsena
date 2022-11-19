<template>
  <router-view />
</template>

<script setup>
import { provide } from 'vue'
import { useRouter } from "vue-router";
import { useCounterStore } from "./stores/example-store";

import { events, loader } from "bestwebs";
import client from './config/index.js';

const router = useRouter();
const counterStore = useCounterStore();

events(router, counterStore);

provide('client', client);
</script>
