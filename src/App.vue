<template>
  <navigation-bar />
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';

export default {
  name: 'App',

  components: {
    NavigationBar,
  },
  created() {
    this.$store.dispatch('tryLogin');
  },
  data: () => ({
    //
  }),
};
</script>
