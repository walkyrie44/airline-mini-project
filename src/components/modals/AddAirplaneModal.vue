<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-card-title class="headline">Add Airplane</v-card-title>
        <v-form ref="form">
          <v-text-field v-model="model" label="Model" :rules="modelRules" required></v-text-field>
      <v-text-field v-model="type" label="Type" type="text" :rules="typeRules" required></v-text-field>
      <v-text-field v-model="year" label="Year" type="number" :rules="yearRules" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAirplane">Save</v-btn>
        <v-btn color="error" @click="closeModal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
import { collection, addDoc } from '@firebase/firestore';
import db from '../../firebase';
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      dialog: false,
      model: '',
      type: '',
      year: null,
      modelRules: [
        v => !!v || 'Model is required',
      ],
      typeRules: [
        v => !!v || 'Type is required',
      ],
      yearRules: [
        v => !!v || 'Year is required',
        v => (v && /^\d+$/.test(v)) || 'Year must be a number',
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

        this.$emit('airplanes', newAirplane);
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
  