import { createRouter, createWebHistory } from "vue-router";
import Profile from "../pages/profile.vue";
import Favorites from "../pages/favorites.vue";
import Home from "../pages/home.vue";
import Login from "../pages/login.vue";
import Registration from "../pages/register.vue";
import UserProfile from "../pages/userProfile.vue";

const routes = [
//   { path: "/", redirect: "/home" },
//   { path: "/home", component: Home, name: "Home" },
//   { path: "/profile", component: Profile, name: "Profile" },
//   { path: "/favorites", component: Favorites, name: "Favorites" },
//   { path: "/login", component: Login, name: "Login" },
//   { path: "/register", component: Registration, name: "Register" },
//   { path: "/user/:id", component: UserProfile, name: "UserProfile" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
