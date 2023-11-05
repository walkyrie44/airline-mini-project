import Vue from 'vue';
import Vuex from 'vuex';
import authModule from './modules/auth';
import language from './modules/language';

Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        auth: authModule,
        language: language,
    },
});