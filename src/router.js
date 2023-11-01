import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/Home.vue";
import Registration from "./pages/Registration.vue";
import Login from "./pages/Login.vue";
import NotFound from "./pages/NotFound.vue";
import store from "./store/index.js";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Home },
    { path: "/register", component: Registration },
    { path: "/login", component: Login, meta: { requiresAuth: true }},
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && localStorage.getItem('token') !== null) {
    next(false);
  } else {
    next();
  }
});

export default router;
