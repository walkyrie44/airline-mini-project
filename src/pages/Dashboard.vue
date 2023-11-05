<template>
  <div>
    <AddAirplaneModal @airplaneAdded="handleAirplaneAdded" ref="airplaneModal" />
    <AddCrewModal @crewAdded="handleCrewAdded" ref="crewModal" />
    <div class="segment-container">
      <v-btn class="segmented-button" @click="handleButtonClick('crew')" :class="{ 'active': activeButton === 'crew' }">
        {{ selectedLanguage === 'MNE' ? 'Posada' : 'Crew' }}
      </v-btn>
      <v-btn class="segmented-button" @click="handleButtonClick('airplanes')" :class="{ 'active': activeButton === 'airplanes' }">
        {{ selectedLanguage === 'MNE' ? 'Avioni' : 'Airplanes' }}
      </v-btn>
    </div>
    <v-app v-if="activeButton === 'crew'">
      <div>
        <v-row>
          <v-col cols="12">
            <v-btn color="primary ml-4 mt-6" @click="openCrewModal">
              {{ selectedLanguage === 'MNE' ? 'Dodaj Posadu' : 'Add Crew' }}
            </v-btn>
          </v-col>
        </v-row>
        <v-card class="ma-4">
          <v-data-table :items="crewData" :headers="headers" hide-default-footer>
            <template v-slot:item.action="{ item }">
              <td>
                <v-btn color="primary" @click="deleteCrew(item)">
                  {{ selectedLanguage === 'MNE' ? 'Obriši' : 'Delete' }}
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-app>
    <v-app v-if="activeButton === 'airplanes'">
      <div>
        <v-row>
          <v-col cols="12">
            <v-btn color="primary ml-4 mt-6" @click="openAirplaneModal">
              {{ selectedLanguage === 'MNE' ? 'Dodaj Avion' : 'Add Airplane' }}
            </v-btn>
          </v-col>
        </v-row>
        <v-card class="ma-4">
          <v-data-table :items="airplaneData" :headers="headersAirplane" hide-default-footer>
            <template v-slot:item.action="{ item }">
              <td>
                <v-btn color="primary" @click="deleteAirplane(item)">
                  {{ selectedLanguage === 'MNE' ? 'Obriši' : 'Delete' }}
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-app>
  </div>
</template>


<script>
import AddCrewModal from '../components/modals/AddCrewModal.vue';
import AddAirplaneModal from '@/components/modals/AddAirplaneModal.vue';
import { collection, getDocs, deleteDoc, doc } from '@firebase/firestore';
import db from '../firebase';
import { mapGetters } from 'vuex';

export default {
  components: {
    AddCrewModal,
    AddAirplaneModal,
  },
  computed: {
    ...mapGetters('language', {
      selectedLanguage: 'selectedLanguage',
    }),
  },
  data() {
    return {
      roleId: null,
      activeButton: 'crew',
      headers: [
        { text: "Name", value: "name" },
        { text: "Last Name", value: "lastName" },
        { text: "Position", value: "position" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phone" },
        { text: "Delete", value: "action" },

      ],
      headersAirplane: [
        { text: "Serial number", value: "id" },
        { text: "Model", value: "model" },
        { text: "Type", value: "type" },
        { text: "Year", value: "year" },
        { text: "Delete", value: "action" },
      ],
      crewData: [],
      airplaneData: [],
    };
  },
  created() {
    this.getCrewList();
    this.getAirplaneList();
    this.roleId = localStorage.getItem('roleId');
  },
  methods: {
    async getCrewList() {
      try {
        const crewList = await getDocs(collection(db, 'crew'));
        crewList.forEach((doc) => {
          this.crewData.push({ ...doc.data(), id: doc.id });
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getAirplaneList() {
      try {
        const airplaneList = await getDocs(collection(db, 'airplanes'));
        airplaneList.forEach((doc) => {
          this.airplaneData.push({ ...doc.data(), id: doc.id });
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteCrew(crew) {
      try {
        const index = this.crewData.findIndex(item => item.id === crew.id);
        if (index !== -1) {
          this.crewData.splice(index, 1);
        }
        const crewRef = doc(db, 'crew', crew.id);
        await deleteDoc(crewRef);
      } catch (error) {
        console.error('Error deleting crew:', error);
      }
    },
    async deleteAirplane(airplane) {
      try {
        const index = this.airplaneData.findIndex(item => item.id === airplane.id);
        if (index !== -1) {
          this.airplaneData.splice(index, 1);
        }
        const airplaneRef = doc(db, 'airplanes', airplane.id);
        await deleteDoc(airplaneRef);
      } catch (error) {
        console.error('Error deleting airplane:', error);
      }
    },
    openCrewModal() {
      this.$refs.crewModal.dialog = true;
    },
    openAirplaneModal() {
      this.$refs.airplaneModal.dialog = true;
    },
    handleCrewAdded(newCrew) {
      this.crewData.push(newCrew);
    },
    handleAirplaneAdded(newAirplane) {
      this.airplaneData.push(newAirplane);
    },
    handleButtonClick(option) {
      this.activeButton = option;
    },
  }
};
</script>

<style scoped>
.segmented-button {
  border-radius: 0;
  border: 1px solid #ccc;
  min-width: 120px !important;
}

.segmented-button.active {
  background-color: #2196F3;
  color: white;
  min-width: 120px;
}

.segment-container {
  display: flex;
  justify-content: center;
  min-width: 120px;
  margin-top: 20px;
}
</style>
