import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/users/:user_id/friends",
    name: "Friends",
    component: () => import("@/pages/users/[user_id]/friends.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
