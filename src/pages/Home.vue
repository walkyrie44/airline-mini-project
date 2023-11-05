<template>
    <div>
        <AddFlightModal :selectedLanguage="selectedLanguage" @flightAdded="handleFlightAdded" ref="flightModal" />
        <UpdateFlightsModal :selectedLanguage="selectedLanguage" @flightUpdated="handleFlightUpdate" :id="updateId"
            ref="UpdateflightModal" />
        <PassengersListModal :selectedLanguage="selectedLanguage" :ticket="ticketData" ref="passengersListModal" />
        <v-alert xs12 class="text-center my-2" v-if="alert" :type="messageType" dismissible @input="closeAlert">
            {{ message }}
        </v-alert>
        <v-container class="mt-12">
            <v-row>
                <v-col cols="12">
                    <v-btn v-if="roleId === '2'" color="primary" @click="openModal">
                        {{ selectedLanguage === 'MNE' ? 'Dodaj Let' : 'Add Flight' }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="searchQuery"
                        :label="selectedLanguage === 'MNE' ? 'Pretraži letove' : 'Search Flights'"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-for="(flight, index) in filteredFlights" :key="index" cols="12" sm="6" md="4" lg="3"
                    class="custom-card">
                    <v-card class="mb-4" :class="{ 'height-card': roleId === '2', 'custom-height-card': roleId !== '2' }">
                        <v-card-title class="headline">
                            {{ formatDate(flight.date) }}
                        </v-card-title>

                        <div v-if="roleId === '2'">
                            <v-row class="ml-1">
                                <v-col cols="6">
                                    <div class="text-space"><strong>{{ selectedLanguage === 'MNE' ? 'Avioni:' : 'Airplane:'
                                    }}</strong> {{
    flight.airplaneModel }}</div>
                                    <div><strong>{{ selectedLanguage === 'MNE' ? 'Stjuardese:' : 'Flight Attendants:'
                                    }}</strong> {{ flight.selectedFlightAttendants.join(' ') }}
                                    </div>

                                </v-col>
                                <v-col cols="6">
                                    <div class="text-space"><strong>Pilot:</strong> {{ flight.pilot }}</div>
                                    <div><strong>{{ selectedLanguage === 'MNE' ? 'Kopilot:' : 'Co-pilot:' }}</strong> {{
                                        flight.coPilot }}</div>
                                </v-col>
                            </v-row>
                        </div>

                        <div v-if="roleId === '2'" class="passengers-list">
                            <label @click="passengersList(flight)" style="cursor: pointer;">{{ selectedLanguage === 'MNE' ?
                                'Vidi listu putnika na ovom letu' : 'See list of passengers on this flight' }}</label>
                        </div>
                        <v-row class="ml-1">
                            <v-col cols="6">
                                <div class="text-space"><strong>{{ selectedLanguage === 'MNE' ? 'Iz:' : 'From:' }}</strong>
                                    {{ flight.from }}
                                </div>
                                <div><strong>{{ selectedLanguage === 'MNE' ? 'Vrijeme Polaska:' : 'Departure Time:'
                                }}</strong> {{ flight.fromTime }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-space"><strong>{{ selectedLanguage === 'MNE' ? 'Do:' : 'To:' }}</strong> {{
                                    flight.to }}</div>
                                <div><strong>{{ selectedLanguage === 'MNE' ? 'Vrijeme Dolaska:' : 'Arrival Time:'
                                }}</strong> {{ flight.toTime }}</div>
                            </v-col>
                        </v-row>
                        <v-card-text><strong>{{ selectedLanguage === 'MNE' ? 'Cijena Karte:' : 'Ticket Price:' }}</strong>
                            {{ flight.price }} &euro;</v-card-text>
                        <v-card-actions class="button-position">
                            <v-btn v-if="roleId !== '2'" color="primary" @click="buyTicket(flight)">{{ selectedLanguage ===
                                'MNE' ? 'Kupi Kartu' : 'Buy Ticket' }}</v-btn>
                            <v-btn v-if="roleId === '2'" color="error" @click="deleteFlight(flight)">{{ selectedLanguage ===
                                'MNE' ? 'Izbriši' : 'Delete' }}</v-btn>
                            <v-btn v-if="roleId === '2'" color="primary" @click="updateFlightId(flight)"> {{
                                selectedLanguage === 'MNE' ? 'Izmijeni' : 'Edit' }}</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AddFlightModal from "../components/modals/AddFlightModal.vue";
import UpdateFlightsModal from "@/components/modals/UpdateFlightsModal.vue";
import PassengersListModal from "@/components/modals/PassengersListModal.vue";
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from '@firebase/firestore';
import db from '../firebase';
import { mapGetters } from 'vuex';

export default {
    components: {
        AddFlightModal,
        UpdateFlightsModal,
        PassengersListModal,
    },
    data() {
        return {
            flightList: [],
            roleId: null,
            searchQuery: "",
            updateId: "",
            alert: false,
            message: "",
            messageType: "error",
            ticketData: {},
        };
    },
    created() {
        this.getTickets();
        this.roleId = localStorage.getItem('roleId');
        this.userId = localStorage.getItem('userId');
    },
    computed: {
        ...mapGetters('language', {
            selectedLanguage: 'selectedLanguage',
        }),
        filteredFlights() {
            const query = this.searchQuery.toLowerCase();
            return this.flightList.filter(
                (flight) =>
                    flight.from.toLowerCase().includes(query) ||
                    flight.to.toLowerCase().includes(query)
            );
        }
    },
    methods: {
        openModal() {
            this.$refs.flightModal.dialog = true;
        },
        handleFlightAdded(newFlight) {
            this.flightList.push(newFlight);
        },
        handleFlightUpdate(updatedFlight) {
            const index = this.flightList.findIndex(flight => flight.id === updatedFlight.id);
            if (index !== -1) {
                this.$set(this.flightList, index, updatedFlight);
            }
        },
        updateFlightId(flight) {
            this.updateId = flight.id;
            this.$refs.UpdateflightModal.dialog = true;
        },
        async getTickets() {
            try {
                const queryTickets = await getDocs(collection(db, 'tickets'));
                queryTickets.forEach((doc) => {
                    this.flightList.push({ ...doc.data(), id: doc.id });
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async deleteFlight(flight) {
            try {
                const index = this.flightList.findIndex(item => item.id === flight.id);
                if (index !== -1) {
                    this.flightList.splice(index, 1);
                }
                const flightRef = doc(db, 'tickets', flight.id);
                await deleteDoc(flightRef);
            } catch (error) {
                console.error('Error deleting flight:', error);
            }
        },
        formatDate(dateTimeString) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            return new Date(dateTimeString).toLocaleDateString(undefined, options);
        },
        async buyTicket(flight) {
            if (this.roleId === "1") {
                const documentId = flight.id;

                const docRef = doc(db, 'tickets', documentId);
                try {
                    const docSnapshot = await getDoc(docRef);
                    const currentPassengers = docSnapshot.data().passengers || [];
                    if (!currentPassengers.includes(this.userId)) {
                        const updatedPassengers = currentPassengers + (currentPassengers ? ', ' : '') + this.userId;
                        await setDoc(docRef, { passengers: updatedPassengers }, { merge: true });
                        this.messageType = "success";
                        this.alert = true;
                        if (this.selectedLanguage === 'MNE') {
                            this.message = "Karta uspješno kupljena!";
                        } else {
                            this.message = "Ticket bought successfully!";
                        }
                    } else {
                        this.alert = true;
                        this.messageType = "error";
                        if (this.selectedLanguage === 'MNE') {
                            this.message = "Već ste kupili kartu za ovaj let!";
                        } else {
                            this.message = "You already bought a ticket for this flight!";
                        }
                    }
                } catch (error) {
                    console.error('Error updating document: ', error);
                }
            } else {
                this.alert = true;
                if (this.selectedLanguage === 'MNE') {
                    this.message = "Morate se prvo prijaviti da biste kupili kartu!";
                } else {
                    this.message = "You need to login first to buy a ticket!";
                }
            }
        },
        passengersList(flight) {
            this.$refs.passengersListModal.dialog = true;
            this.ticketData = flight;
        },
        closeAlert() {
            this.alert = false;
            this.message = "";
            this.messageType = "error";
        },
    },
};
</script>

<style scoped>
.height-card {
    height: 470px;
}

.custom-height-card {
    min-height: 260px;
}

.button-position {
    position: absolute;
    bottom: 12px;
    left: 10px;
}

.custom-card {
    min-width: 50%;

}

.passengers-list {
    margin-top: 14px;
    margin-left: 14px;
    margin-bottom: 14px;
    color: blue;
    cursor: pointer;
}

.text-space {
    margin-bottom: 5px;
}
</style>
