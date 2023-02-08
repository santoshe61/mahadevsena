<template>
  <q-page>
	<h2 class="q-px-md">Mahadev Sena | महादेव सेना</h2>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card col-12" v-for="item in items">
        <video v-if="item.isVideo" class="card-img" :src="item.img" ></video>
		<img v-else class="card-img" :src="item.img" />
        <q-card-section>
          <div class="text-h6 q-mb-xs">{{ item.title }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { ref } from "vue";
  import logo from "src/assets/logo.png";
const items = ref([
	{ title: "Logo", img: "/logo.png" },
	{ title: "Letter from श्री 1008 पार्श्वनाथ दिगम्बर जैन अतिशय क्षेत्र ", img: "digambar-jain-letter.jpeg" },
	{ title: "Letter from Mr. Ramdas Athawale", img: "ramdas-athavle-letter.jpeg" },
	{ title: "Logo", img: "/intro.mp4", isVideo: true },
]);
</script>
<style>
  .card-img {
    max-height: 700px;
    width: auto !important;
  }
</style>
