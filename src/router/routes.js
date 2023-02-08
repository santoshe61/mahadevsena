import { auth } from "bestwebs";
const routes = [
  {
    path: "/register",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("/src/pages/auth/Register.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("/src/pages/auth/Login.vue") },
    ],
  },
  {
    path: "/logout",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/app",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter(to, from, next) {
      let authUser = auth();
      if (!authUser) {
        next("/login");
        return false;
      } else {
        next();
        return true;
      }
    },
    children: [
      {
        path: "/app",
        alias: "dashboard",
        meta: {
          title: "Home",
          caption: "Home",
          icon: "home",
          isAdmin: false
        },
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/user/add/:mobile?",
        meta: {
          title: "Add Activist",
          caption: "नया कार्यकर्ता जोड़ें",
          isAdmin: true,
          icon: "person_add",
        },
        component: () => import("pages/user/Add.vue"),
      },
      {
        path: "/user/view",
        meta: {
          title: "View Activists List",
          caption: "कार्यकर्ता सूची देखें",
          isAdmin: true,
          icon: "people_alt",
        },
        component: () => import("pages/user/View.vue"),
      },

      {
        path: "/transaction/view",
        meta: {
          title: "View Points Transactions",
          caption: "अंक लेनदेन देखें",
          isAdmin: true,
          icon: "format_list_numbered",
        },
        component: () => import("pages/transaction/View.vue"),
      },
      {
        path: "/payouts/add",
        meta: {
          title: "Add Payout request",
          caption: "पेआउट अनुरोध जोड़ें",
          isAdmin: true,
          icon: "playlist_add",
        },
        component: () => import("pages/payout/Add.vue"),
      },
      {
        path: "/payouts/request/view",
        meta: {
          title: "View Payout Requests",
          caption: "पेआउट अनुरोध देखें",
          isAdmin: true,
          icon: "playlist_play",
        },
        component: () => import("pages/payout/ViewRequest.vue"),
      },
      {
        path: "/payouts/paid/view",
        meta: {
          title: "View released Payouts",
          caption: "जारी किए गए पेआउट देखें",
          isAdmin: true,
          icon: "playlist_add_check",
        },
        component: () => import("pages/payout/ViewPaid.vue"),
      },

      {
        path: "/profile",
        meta: {
          title: "Profile",
          caption: "View/Update Profile",
          isAdmin: false,
          icon: "person",
        },
        component: () => import("layouts/BlankLayout.vue"),
        children: [
          {
            path: "",
            meta: {
              title: "Profile",
              caption: "View/Update Profile",
              isAdmin: false,
              icon: "person",
            },
            component: () => import("@/pages/profile/View.vue"),
          },
          {
            path: "edit",
            meta: {
              title: "Edit Profile",
              caption: "Edit Profile",
              isAdmin: false,
              icon: "person",
            },
            component: () => import("@/pages/profile/Edit.vue"),
          },
        ]
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/Home.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
