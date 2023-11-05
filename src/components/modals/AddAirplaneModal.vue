<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-card-title class="headline">
          {{ selectedLanguage === 'MNE' ? 'Dodaj Avion' : 'Add Airplane' }}
        </v-card-title>
        <v-form ref="form">
          <v-text-field v-model="model" :label="selectedLanguage === 'MNE' ? 'Model:' : 'Model'" :rules="modelRules"
            required></v-text-field>
          <v-text-field v-model="type" :label="selectedLanguage === 'MNE' ? 'Tip:' : 'Type'" type="text"
            :rules="typeRules" required></v-text-field>
          <v-text-field v-model="year" :label="selectedLanguage === 'MNE' ? 'Godina:' : 'Year'" type="number"
            :rules="yearRules" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAirplane">
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
  computed: {
    ...mapGetters('language', {
      selectedLanguage: 'selectedLanguage',
    }),
  },
  data() {
    return {
      dialog: false,
      model: '',
      type: '',
      year: null,
      modelRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Model je obavezan' : 'Model is required'),
      ],
      typeRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Tip je obavezan' : 'Type is required'),
      ],
      yearRules: [
        v => !!v || (this.selectedLanguage === 'MNE' ? 'Godina je obavezna' : 'Year is required'),
        v => (v && /^\d+$/.test(v)) || (this.selectedLanguage === 'MNE' ? 'Godina mora biti broj' : 'Year must be a number'),
      ],
    };
  },
  methods: {
    async saveAirplane() {
      if (this.$refs.form.validate()) {
        const newAirplane = {
          id: uuidv4(),
          model: this.model,
          type: this.type,
          year: this.year,
        };
        const colRef = collection(db, 'airplanes')
        const docRef = await addDoc(colRef, newAirplane)

        this.$emit('airplaneAdded', newAirplane);
        this.closeModal();
      }
    },
    closeModal() {
      this.dialog = false,
      this.model = '';
      this.type = '';
      this.year = null;
    },
  },
};
</script>

<style scoped></style>
