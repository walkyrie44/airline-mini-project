<template>
  <form @submit.prevent="submitForm">
    <v-container fluid>
      <v-alert xs12 class="text-center my-2" v-if="alert.show" type="error" dismissible @input="closeAlert">
        {{ alert.message }}
      </v-alert>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-card-title class="text-center">
              <h1 class="display-1">Manager Registration</h1>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field label="Name" v-model="firstName" required></v-text-field>
                <v-text-field label="Last Name" v-model="lastName" required></v-text-field>
                <v-select label="Position" v-model="position" :items="['General Manager', 'Operations Manager']"
                  required></v-select>
                <v-text-field label="Phone Number" v-model="phoneNumber" required></v-text-field>
                <v-text-field label="Email" type="email" v-model="email" required></v-text-field>
                <v-text-field label="Password" type="password" v-model="password" required></v-text-field>
                <v-text-field label="Confirm Password" type="password" v-model="confirmPassword" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-left pb-4 pl-4">
              <v-btn color="primary" type="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>
<script>

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      position: "",
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
    validateForm() {
      const uppercaseRegex = /[A-Z]/;
      const numberRegex = /\d/;

      if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
        this.alert.show = true;
        this.alert.type = "error";
        this.alert.message = "All fields are required.";
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.alert.show = true;
        this.alert.type = "error";
        this.alert.message = "Invalid email address.";
        return false;
      }
      if (!this.phoneNumber) {
        this.showAlert("error", "Phone Number is required.");
        return false;
      }

      if (!this.position) {
        this.showAlert("error", "Position is required.");
        return false;
      }
      if (!uppercaseRegex.test(this.password)) {
        this.showAlert("error", "Password must contain at least one uppercase letter.");
        return false;
      }
      if (!numberRegex.test(this.password)) {
        this.showAlert("error", "Password must contain at least one number.");
        return false;
      }
      if (this.password !== this.confirmPassword) {
        this.showAlert("error", "Password and confirm password do not match.");
        return false;
      }
      return true;
    },
    showAlert(type, message) {
      this.alert.type = type;
      this.alert.message = message;
      this.alert.show = true;
    },
    closeAlert() {
      this.alert.show = false;
    },
    async submitForm() {
      try {
        if (this.validateForm()) {
          const formData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            confirmPass: this.confirmPassword,
            role: 2,
            phoneNumber: this.phoneNumber,
            position: this.position,
          }
          this.$store.dispatch('signup', formData);
          this.$router.replace("/login");
        }
      } catch (err) {
        this.showAlert("Problem with server, please try again later.");
      }
    },
  }
};
</script>
