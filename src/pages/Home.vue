<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-header class="q-header row q-pa-lg" elevated>
		  <h6 class="q-px-md q-my-sm">Mahadev Sena | महादेव सेना</h6>
			<q-space />
			<q-btn to="/login" rounded>जुड़ने के लिये यहाँ क्लिक करे</q-btn>
      </q-header>


      <q-page-container class="bg-grey-2">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card col-12" v-for="item in items">
		<video v-if="item.isVideo" class="card-img" controls>
			<source :src="item.media" type="video/mp4">
			Your browser does not support the video tag.
		</video>
		<img v-else class="card-img" :src="item.media" />
        <q-card-section>
          <div class="text-h6 q-mb-xs">{{ item.title }}</div>
        </q-card-section>
      </q-card>
    </div>
      </q-page-container>


    </q-layout>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import logo from "src/assets/logo.png";
import { useQuasar } from 'quasar'

const items = ref([
  { title: "महादेव सेना में आपका स्वागत है", media: "/logo.png" },
  { title: "Letter from श्री 1008 पार्श्वनाथ दिगम्बर जैन अतिशय क्षेत्र ", media: "digambar-jain-letter.jpeg" },
  { title: "Letter from Mr. Ramdas Athawale", media: "ramdas-athavle-letter.jpeg" },
  { title: "Introductory video clip", media: "/intro.mp4", isVideo: true },
]);
const conversations = [
  {
    id: 1,
    person: 'Razvan Stoenescu',
    avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
    caption: 'I\'m working on Quasar!',
    time: '15:00',
    sent: true
  },
  {
    id: 2,
    person: 'Dan Popescu',
    avatar: 'https://cdn.quasar.dev/team/dan_popescu.jpg',
    caption: 'I\'m working on Quasar!',
    time: '16:00',
    sent: true
  },
  {
    id: 3,
    person: 'Jeff Galbraith',
    avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
    caption: 'I\'m working on Quasar!',
    time: '18:00',
    sent: true
  },
  {
	  id: 4,
	  person: 'Allan Gaunt',
	  avatar: 'https://cdn.quasar.dev/team/allan_gaunt.png',
	  caption: 'I\'m working on Quasar!',
    time: '17:00',
    sent: true
  }
]

const $q = useQuasar()

const leftDrawerOpen = ref(false)
const search = ref('')
const message = ref('')
const currentConversationIndex = ref(0)

const currentConversation = computed(() => {
  return conversations[ currentConversationIndex.value ]
})

const style = computed(() => ({
  height: $q.screen.height + 'px'
}))

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function setCurrentConversation (index) {
  currentConversationIndex.value = index
}

</script>

<style lang="sass">
.q-header
  background-color: #d95b1e
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
    background-color: #d95b1e

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem

</style>
<style>
.card-img {
	max-height: 700px;
	width: auto !important;
  }
  </style>