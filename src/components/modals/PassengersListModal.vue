<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card class="passengers-list-card">
      <v-card-title class="passengers-list-title">
        {{ selectedLanguage === 'MNE' ? 'Lista putnika' : 'Passengers List' }}
      </v-card-title>
      <v-card-text>
        <v-list class="passengers-list">
          <v-list-item-group v-if="users.length > 0">
            <v-list-item v-for="(passenger, index) in users" :key="index" class="passenger-item">
              <v-list-item-content>
                <v-list-item-title class="passenger-details">
                  <strong>{{ selectedLanguage === 'MNE' ? 'ID korisnika:' : 'User ID:' }}</strong> {{ passenger.id }}<br>
                  <strong>{{ selectedLanguage === 'MNE' ? 'Ime:' : 'Name:' }}</strong> {{ passenger.firstName }}<br>
                  <strong>{{ selectedLanguage === 'MNE' ? 'Prezime:' : 'Last Name:' }}</strong> {{ passenger.lastName }}<br>
                  <strong>{{ selectedLanguage === 'MNE' ? 'Email:' : 'Email:' }}</strong> {{ passenger.email }}<br>
                  <strong>{{ selectedLanguage === 'MNE' ? 'Telefon:' : 'Phone:' }}</strong> {{ passenger.phoneNumber }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-alert v-else :value="true" type="info" class="no-passengers-alert">
            {{ selectedLanguage === 'MNE' ? 'Nema putnika na ovom letu.' : 'No passengers on this flight yet.' }}
          </v-alert>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeModal">
          {{ selectedLanguage === 'MNE' ? 'Zatvori' : 'Close' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { collection, getDocs } from '@firebase/firestore';
import db from '../../firebase';

export default {
  props: {
    selectedLanguage: {
      type: String,
      required: true,
    },
    ticket: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      dialog: false,
      users: [],
    };
  },
  watch: {
    ticket: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.getUsers();
        }
      },
    },
  },
  methods: {
    async getUsers() {
      try {
        if (this.ticket && this.ticket.passengers) {
          const cleanedPassengersId = this.ticket.passengers
            .split(', ')
            .filter(userId => userId && userId !== 'null')
            .map(userId => userId.trim());

          const queryUsers = await getDocs(collection(db, 'users'));
          const matchedUsers = [];

          queryUsers.forEach((doc) => {
            const user = { ...doc.data(), id: doc.id };
            if (cleanedPassengersId.includes(user.userId)) {
              matchedUsers.push(user);
            }
          });
          this.users = matchedUsers;
        } 
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    closeModal() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.passengers-list-card {
  width: 100%;
  max-width: 600px;
}

.passengers-list-title {
  background-color: #2196F3;
  color: white;
  text-align: center;
  font-size: 24px;
  padding: 10px;
}

.passengers-list {
  max-height: 390px;
  overflow-y: auto;
}

.passenger-item {
  border: 1px solid #ccc;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.passenger-details {
  font-size: 16px;
}

.no-passengers-alert {
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
}
</style>
