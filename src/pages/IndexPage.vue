<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-card-section class="my-card column justify-center align-center">
        <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
          <div
            v-if="user.isAdmin"
            class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
          >
            <q-card>
              <q-card-section
                :class="$q.dark.isActive ? 'blue_dark' : 'bg-blue-8'"
                class="text-white"
              >
                <div class="row">
                  <div class="col-10">
                    <div class="text-h6">Team Size</div>
                    <div class="text-h5">{{ profileStore.dashboard.Team }}</div>
                  </div>
                  <div class="col-2">
                    <q-icon size="62px" name="people" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div
            v-if="user.isAdmin"
            class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
          >
            <q-card>
              <q-card-section
                :class="$q.dark.isActive ? 'green_dark' : 'bg-green-8'"
                class="text-white"
              >
                <div class="row">
                  <div class="col-10">
                    <div class="text-h6">Direct</div>
                    <div class="text-h5">
                      {{ profileStore.dashboard.Count }}
                    </div>
                  </div>
                  <div class="col-2">
                    <q-icon size="62px" name="people_alt" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-card>
              <q-card-section
                :class="$q.dark.isActive ? 'orange_dark' : 'bg-orange-9'"
                class="text-white"
              >
                <div class="row">
                  <div class="col-10">
                    <div class="text-h6">Wallet Points</div>
                    <div class="text-h5">
                      $ {{ profileStore.dashboard.Balance }}
                    </div>
                  </div>
                  <div class="col-2">
                    <q-icon size="62px" name="savings" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div>
          <iframe
            name="fa051854d17ac"
            width="100%"
            height="600px"
            data-height="600px"
            data-testid="fb:page Facebook Social Plugin"
            title="fb:page Facebook Social Plugin"
            frameborder="0"
            allowtransparency="true"
            allowfullscreen="true"
            scrolling="yes"
            allow="encrypted-media"
            src="https://www.facebook.com/v16.0/plugins/page.php?adapt_container_width=true&amp;app_id=&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df3d605af1d73ffc%26domain%3Dlocalhost%26is_canvas%3Dfalse%26origin%3Dhttp%253A%252F%252Flocalhost%253A9000%252Ff1d0deffc45298c%26relation%3Dparent.parent&amp;hide_cover=true&amp;href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100089010184187&amp;locale=en_US&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true&amp;tabs=timeline&amp;"
            style="
              border: none;
              visibility: visible;
              width: 100%;
              height: 600px;
              margin-top: 30px;
            "
            class=""
          ></iframe>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
  import { onMounted } from "vue";
  import useProfileStore from "./profile/profile";
  import { auth } from "bestwebs";

  const user = auth();

  const profileStore = useProfileStore();

  onMounted(function () {
    profileStore.getDashboard();
  });
</script>
<style>
  .fb-page {
    display: block;
  }
</style>
