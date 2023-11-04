<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-text>
                <v-card-title class="headline">Update Flight</v-card-title>
                <v-form ref="form">
                    <v-select v-model="airplaneModel" label="Airplane model" :items="airplaneData.map(item => item.model)"
                        required></v-select>
                    <v-select v-model="pilot" label="Pilot" :items="pilots" required></v-select>
                    <v-select v-model="coPilot" label="Co pilot" :items="coPilots" required></v-select>
                    <v-select v-model="selectedFlightAttendants" label="Flight Attendants" :items="flightAttendant" multiple
                        chips required></v-select>
                    <v-text-field v-model="from" label="From" :rules="nameRules" required></v-text-field>
                    <v-text-field v-model="fromTime" label="Departure Time" type="time" required></v-text-field>
                    <v-text-field v-model="date" label="Date" type="date" required></v-text-field>
                    <v-text-field v-model="to" label="To" :rules="nameRules" required></v-text-field>
                    <v-text-field v-model="toTime" label="Arrival Time" type="time" required></v-text-field>
                    <v-text-field v-model="price" label="Ticket Price" type="number" :rules="priceRules"
                        required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="updateFlight">Update</v-btn>
                <v-btn color="error" @click="closeModal">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script>
import { collection, getDoc, doc, updateDoc, getDocs } from '@firebase/firestore';
import db from '../../firebase';

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            airplaneModel: '',
            from: '',
            fromTime: '12:00',
            date: null,
            to: '',
            toTime: '12:00',
            price: null,
            pilot: '',
            coPilot: '',
            selectedFlightAttendants: [],
            airplaneData: [],
            crewData: [],
            nameRules: [
                v => !!v || 'Field is required',
                v => (v && v.length <= 50) || 'Max 50 characters',
            ],
            priceRules: [
                v => !!v || 'Field is required',
                v => (!isNaN(parseFloat(v)) && isFinite(v)) || 'Invalid price',
                v => (v >= 0) || 'Price must be non-negative',
            ],
        };
    },
    watch: {
        id: {
            immediate: true,
            handler(newId) {
                if (newId) {
                    this.dialog = true;
                    this.getDocumentById(newId);
                    this.getAirplaneList();
                    this.getCrewList();
                }
            }
        }
    },
    computed: {
        nameRules() {
            return [
                (v) => !!v || "Field is required",
                (v) => (v && v.length <= 50) || "Max 50 characters",
            ];
        },
        priceRules() {
            return [
                (v) => !!v || "Field is required",
                (v) => (!isNaN(parseFloat(v)) && isFinite(v)) || "Invalid price",
                (v) => v >= 0 || "Price must be non-negative",
            ];
        },
        pilots() {
            return this.crewData
                .filter(item => item.position === "Pilot")
                .map(item => `${item.name} ${item.lastName} , id: ${item.id.substring(0, 8)}`);
        },
        coPilots() {
            return this.crewData
                .filter(item => item.position === "Co-pilot")
                .map(item => `${item.name} ${item.lastName} , id: ${item.id.substring(0, 8)}`);
        },
        flightAttendant() {
            return this.crewData
                .filter(item => item.position === "Flight Attendant")
                .map(item => `${item.name} ${item.lastName} , id: ${item.id.substring(0, 8)}`);
        },
    },
    methods: {
        async getDocumentById(documentId) {
            const docRef = doc(db, 'tickets', documentId);
            try {
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const documentData = docSnapshot.data();
                    this.airplaneModel = documentData.airplaneModel;
                    this.pilot = documentData.pilot;
                    this.coPilot = documentData.coPilot;
                    this.selectedFlightAttendants = documentData.selectedFlightAttendants;
                    this.from = documentData.from;
                    this.fromTime = documentData.fromTime;
                    this.date = documentData.date;
                    this.to = documentData.to;
                    this.toTime = documentData.toTime;
                    this.price = documentData.price;

                    return documentData;
                } else {
                    console.log('No such document!');
                    return null;
                }
            } catch (error) {
                console.error('Error getting document:', error);
                throw error;
            }
        },
        async updateFlight() {
            if (this.$refs.form.validate()) {
                const updatedFlight = {
                    id: this.id,
                    pilot: this.pilot,
                    coPilot: this.coPilot,
                    selectedFlightAttendants: this.selectedFlightAttendants,
                    airplaneModel: this.airplaneModel,
                    from: this.from,
                    fromTime: this.fromTime,
                    date: this.date,
                    to: this.to,
                    toTime: this.toTime,
                    price: parseFloat(this.price),
                };

                const flightDocRef = doc(db, 'tickets', this.id);
                await updateDoc(flightDocRef, updatedFlight);

                this.$emit('flightUpdated', updatedFlight);
                this.closeModal();
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
        closeModal() {
            this.dialog = false;
            this.$refs.form.resetValidation();
        },
    },
};
</script>
  
<style scoped>

</style>
  