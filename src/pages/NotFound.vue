<template>
  <v-container fluid>
    <v-layout justify-center align-center class="error-container">
      <v-flex xs12 md8 lg6>
        <h1 class="display-2 text-xs-center">Error - Page not found</h1>
        <p class="subheading text-xs-center">The requested page could not be found.</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
.error-container {
  text-align-last: center;
  margin-top: 100px;
}

.display-2 {
  color: #f44336;
  margin-bottom: 20px;
}

.subheading {
  font-size: 18px;
  color: #333;
}
</style>
