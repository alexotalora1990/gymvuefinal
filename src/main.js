

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router  from './routes/routes.js';
import axios from "axios"

import { Quasar, Notify,Loading } from 'quasar';
// Importa icon libraries
import '@quasar/extras/material-icons/material-icons.css';
// Importa Quasar css
import 'quasar/src/css/index.sass';

  
  axios.defaults.baseURL="https://gymapp-lgjb.onrender.com/api/";
  // axios.defaults.baseURL="http://localhost:4000/api/"

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const myApp = createApp(App);
  plugins: {
    Notify,
    Loading
  },
});

myApp.use(router); // Usa el objeto router importado correctamente

myApp.use(pinia);
myApp.mount('#app');


