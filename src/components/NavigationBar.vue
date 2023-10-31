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
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        class="hidden-xs-only"
        text
        :to="item.path"
      >
        {{ item.title }}
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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
};
</script>
