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
              <h1 class="display-1">{{ selectedLanguage === 'MNE' ? 'Registracija' : 'Registration' }}</h1>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field :label="selectedLanguage === 'MNE' ? 'Ime' : 'Name'" v-model="firstName"
                  required></v-text-field>
                <v-text-field :label="selectedLanguage === 'MNE' ? 'Prezime' : 'Last Name'" v-model="lastName"
                  required></v-text-field>
                <v-text-field :label="selectedLanguage === 'MNE' ? 'Email' : 'Email'" type="email" v-model="email"
                  required></v-text-field>
                <v-text-field :label="selectedLanguage === 'MNE' ? 'Šifra' : 'Password'" type="password"
                  v-model="password" required></v-text-field>
                <v-text-field :label="selectedLanguage === 'MNE' ? 'Potvrdi Šifru' : 'Confirm Password'" type="password"
                  v-model="confirmPassword" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-left pb-4 pl-4">
              <v-btn color="primary" type="submit">{{ selectedLanguage === 'MNE' ? 'Potvrdi' : 'Submit' }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('language', {
      selectedLanguage: 'selectedLanguage',
    }),
  },
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
    validateForm() {
      const uppercaseRegex = /[A-Z]/;
      const numberRegex = /\d/;
      const minLength = 6;

      if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
        this.alert.show = true;
        this.alert.type = "error";
        this.alert.message = this.selectedLanguage === 'MNE' ? "Sva polja su obavezna." : "All fields are required.";
        return false;
      }
      if (this.password.length < minLength) {
        const minLengthMessage = this.selectedLanguage === 'MNE' ? `Lozinka mora biti dugačka barem ${minLength} karaktera.` : `Password must be at least ${minLength} characters long.`;
        this.showAlert("error", minLengthMessage);
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.alert.show = true;
        this.alert.type = "error";
        this.alert.message = this.selectedLanguage === 'MNE' ? "Nevažeća email adresa." : "Invalid email address.";
        return false;
      }
      if (!uppercaseRegex.test(this.password)) {
        const uppercaseMessage = this.selectedLanguage === 'MNE' ? "Lozinka mora sadržati barem jedno veliko slovo." : "Password must contain at least one uppercase letter.";
        this.showAlert("error", uppercaseMessage);
        return false;
      }
      if (!numberRegex.test(this.password)) {
        const numberMessage = this.selectedLanguage === 'MNE' ? "Lozinka mora sadržati barem jednu cifru." : "Password must contain at least one number.";
        this.showAlert("error", numberMessage);
        return false;
      }
      if (this.password !== this.confirmPassword) {
        const mismatchMessage = this.selectedLanguage === 'MNE' ? "Lozinka i potvrda lozinke se ne podudaraju." : "Password and confirm password do not match.";
        this.showAlert("error", mismatchMessage);
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
            role: 1,
          }
          this.$store.dispatch('signup', formData);
          this.$router.replace("/login");
        }
      } catch (err) {
        const errorMessage = this.selectedLanguage === 'MNE' ? "Problem sa serverom, molimo pokušajte kasnije." : "Problem with server, please try again later.";
        this.showAlert("error", errorMessage);
      }
    },
  }

};
</script>
