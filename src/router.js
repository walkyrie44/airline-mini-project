import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/Home.vue";
import Registration from "./pages/Registration.vue";
import Login from "./pages/Login.vue";
import NotFound from "./pages/NotFound.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Home },
    { path: "/register", component: Registration },
    { path: "/login", component: Login },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

export default router;
