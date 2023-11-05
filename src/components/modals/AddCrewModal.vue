<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-card-title class="headline">
          {{ selectedLanguage === 'MNE' ? 'Dodaj Posadu' : 'Add Crew' }}
        </v-card-title>
        <v-form ref="form">
          <v-text-field v-model="name" :label="selectedLanguage === 'MNE' ? 'Ime:' : 'Name:'" required
            :rules="nameRules"></v-text-field>
          <v-text-field v-model="lastName" :label="selectedLanguage === 'MNE' ? 'Prezime:' : 'Last Name:'" type="text"
            required :rules="lastNameRules"></v-text-field>
          <v-select :label="selectedLanguage === 'MNE' ? 'Pozicija:' : 'Position:'" v-model="position"
            :items="['Pilot', 'Co-pilot', 'Flight Attendant']" required :rules="positionRules"></v-select>
          <v-text-field v-model="email" :label="selectedLanguage === 'MNE' ? 'Email:' : 'Email:'" type="email" required
            :rules="emailRules"></v-text-field>
          <v-text-field v-model="phone" :label="selectedLanguage === 'MNE' ? 'Broj Telefona:' : 'Phone number:'"
            type="number" required :rules="phoneRules"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveCrew">
          {{ selectedLanguage === 'MNE' ? 'Sačuvaj' : 'Save' }}
        </v-btn>
        <v-btn color="error" @click="closeModal">
          {{ selectedLanguage === 'MNE' ? 'Otkaži' : 'Cancel' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { collection, addDoc } from '@firebase/firestore';
import db from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { mapGetters } from 'vuex';

export default {
  name: 'AddCrewModal',
  computed: {
    ...mapGetters('language', {
      selectedLanguage: 'selectedLanguage',
    }),
  },
  data() {
    return {
      dialog: false,
      name: '',
      lastName: '',
      position: '',
      email: '',
      phone: null,
      nameRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Ime je obavezno' : 'Name is required'),
      ],
      lastNameRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Prezime je obavezno' : 'Last Name is required'),
      ],
      positionRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Pozicija je obavezna' : 'Position is required'),
      ],
      emailRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Email je obavezan' : 'Email is required'),
        v => /.+@.+/.test(v) || (this.selectedLanguage === 'MNE' ? 'Email mora biti validan' : 'Email must be valid'),
      ],
      phoneRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Broj telefona je obavezan' : 'Phone number is required'),
      ],
    };
  },
  methods: {
    async saveCrew() {
      if (this.$refs.form.validate()) {
        const newCrew = {
          id: uuidv4(),
          name: this.name,
          lastName: this.lastName,
          position: this.position,
          email: this.email,
          phone: this.phone,
        };
        const colRef = collection(db, 'crew');
        const docRef = await addDoc(colRef, newCrew);

        this.$emit('crewAdded', newCrew);
        this.closeModal();
      }
    },
    closeModal() {
      this.dialog = false;
      this.name = '';
      this.lastName = '';
      this.position = '';
      this.email = '';
      this.phone = null;
    },
  },
};
</script>

<style scoped></style>
