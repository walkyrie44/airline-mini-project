<template>
  <v-container fluid>
    <v-alert xs12 class="text-center my-2" v-if="alert.show" type="error" dismissible @input="closeAlert">
      {{ alert.message }}
    </v-alert>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-center">
            <h1 class="display-1 my-3">Login</h1>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-btn color="primary" @click.prevent="submitForm" class="mt-4">Sign In</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      alert: {
        show: false,
        type: "",
        message: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$store.dispatch('login', { email: this.email, password: this.password });
        this.$router.replace("/");
      } catch (err) {
        this.alert.show = true;
        this.alert.message = "Incorrect email or password.";
      }
    },
    closeAlert() {
      this.alert.show = false;
    },
  }
};
</script>
