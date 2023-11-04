<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-card-title class="headline">Add Crew</v-card-title>
        <v-form ref="form">
          <v-text-field v-model="name" label="Name" required :rules="nameRules"></v-text-field>
      <v-text-field v-model="lastName" label="Last Name" type="text" required :rules="lastNameRules"></v-text-field>
      <v-select label="Position" v-model="position" :items="['Pilot', 'Co-pilot', 'Flight Attendant']" required :rules="positionRules"></v-select>
      <v-text-field v-model="email" label="Email" type="email" required :rules="emailRules"></v-text-field>
      <v-text-field v-model="phone" label="Phone number" type="number" required :rules="phoneRules"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveCrew">Save</v-btn>
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
  name: 'AddCrewModal',
  data() {
    return {
      dialog: false,
      name: '',
      lastName: '',
      position: '',
      email: '',
      phone: null,
      nameRules: [
        (v) => !!v || 'Name is required',
      ],
      lastNameRules: [
        (v) => !!v || 'Last Name is required',
      ],
      positionRules: [
        (v) => !!v || 'Position is required',
      ],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+/.test(v) || 'Email must be valid',
      ],
      phoneRules: [
        (v) => !!v || 'Phone number is required',
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
        const colRef = collection(db, 'crew')
        const docRef = await addDoc(colRef, newCrew)

        this.$emit('crewAdded', newCrew);
        this.closeModal();
      }
    },
    closeModal() {
      this.dialog = false,
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
  