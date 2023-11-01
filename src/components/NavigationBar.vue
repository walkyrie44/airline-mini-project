<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-btn icon @click.stop="drawer = !drawer" v-if="$vuetify.breakpoint.xs">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <router-link to="/" style="text-decoration: none; color: inherit">
        <v-toolbar-title>Bear Wing</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn class="hidden-xs-only" text :to="{ path: '/' }">Home</v-btn>
      <v-btn class="hidden-xs-only" text :to="{ path: '/register' }">Sign Up</v-btn>

      <div v-if="isLoggedIn">
        <v-btn class="hidden-xs-only" text @click="logout">Logout</v-btn>
      </div>
      <div v-else>
        <v-btn class="hidden-xs-only" text :to="{ path: '/login' }">Login</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list>
        <v-list-item :to="{ path: '/' }">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/register' }">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else :to="{ path: '/login' }">
          <v-list-item-icon>
            <v-icon>mdi-lock-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      menuItems: [
        { title: "Home", path: "/", icon: "mdi-home" },
        { title: "Sign Up", path: "/register", icon: "mdi-account" },
        { title: "Login", path: "/login", icon: "mdi-lock-open" },
      ],
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/');
    }
  }
};
</script>
