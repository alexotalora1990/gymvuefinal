

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router  from './routes/routes.js'; // Ajusta la importación aquí

import { Quasar, Notify } from 'quasar';
// Importa icon libraries
import '@quasar/extras/material-icons/material-icons.css';
// Importa Quasar css
import 'quasar/src/css/index.sass';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Notify
  },
});

myApp.use(router); // Usa el objeto router importado correctamente

myApp.use(pinia);
myApp.mount('#app');
