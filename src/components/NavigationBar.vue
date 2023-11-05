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
      <div v-if="this.roleId === '2'">
        <v-btn class="hidden-xs-only" text :to="{ path: '/dashboard' }">Dashboard</v-btn>
      </div>
      <div v-if="this.roleId !== '2'">
        <v-btn class="hidden-xs-only" text :to="{ path: '/register' }">Sign Up</v-btn>
      </div>
      <div v-else>
        <v-btn class="hidden-xs-only" text :to="{ path: '/register-manager' }">Sign Up</v-btn>
      </div>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-list-item-title>{{ selecetdLanguage }}</v-list-item-title>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(language, index) in languages" :key="index" @click="changeLanguage(language.code)">
            <v-list-item-title>{{ language.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
        <v-list-item :to="{ path: '/register' }" v-if="this.roleId !== '2'">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="this.roleId === '2'" :to="{ path: '/dashboard' }">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="this.roleId === '2'" :to="{ path: '/register-manager' }">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item> 
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-list-item-icon v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-translate</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ selecetdLanguage }}</v-list-item-title>
            </v-list-item-icon>
          </template>
          <v-list>
            <v-list-item v-for="(language, index) in languages" :key="index" @click="changeLanguage(language.code)">
              <v-list-item-content>{{ language.name }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
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
      roleId: null,
      languages: [
        { name: 'English', code: 'EN' },
        { name: 'Montenegrin', code: 'MNE' },
      ],
      selecetdLanguage: 'EN',
    };
  },
  created() {
    this.roleId = localStorage.getItem('roleId')
  },
  watch: {
    $route(to, from) {
      const newRoleId = localStorage.getItem('roleId');
      if (this.roleId !== newRoleId) {
        this.roleId = newRoleId;
      }
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    changeLanguage(languageCode) {
      this.selecetdLanguage = languageCode;
      this.$store.dispatch('language/changeLanguage', languageCode);
    },
  }
};
</script>
