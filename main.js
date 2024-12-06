import { createApp } from "vue";
import app from "./app.vue";
import router from "./router"; // Ensure the path is correct
import axios from "axios";

// Create the Vue app
const app1 = createApp(app);

// Set up a global property for Axios
app1.config.globalProperties.$http = axios;

// Use the router
app1.use(router);

// Mount the app
app1.mount("#app");
