import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/Home.vue";
import Registration from "./pages/Registration.vue";
import Login from "./pages/Login.vue";
import NotFound from "./pages/NotFound.vue";
import ManagerRegistration from "./pages/ManagerRegistration.vue";
import Dashboard from "./pages/Dashboard.vue";

Vue.use(VueRouter);


const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Home },
    { path: "/register-manager", component: ManagerRegistration, meta: { requiresAuth: true } },
    { path: "/register", component: Registration },
    { path: "/login", component: Login, meta: { requiresAuth: true }},
    { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true }},
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach(async (to, _, next) => {
  const roleId = localStorage.getItem('roleId');
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && localStorage.getItem('roleId') === '2' && localStorage.getItem('token') !== null) {
    next(true);
  }
  if (to.meta.requiresAuth && localStorage.getItem('token') !== null) {
    next(false);
  } else {
    next();
  }
});

export default router;
