<!-- 
<template>
  <div class="container">
    <div class="welcome-container">
      <h1 class="welcome-text">Body Champion</h1>
    </div>
    <div class="form-container">
      <img src="./imagenes/loginlogo.png" class="logo" />
      <h2 class="form-title">Iniciar Sesión</h2>
      <div class="form-content">
        <q-form @submit="onSubmit()" @reset="onReset" class="q-gutter-md">
          <q-input filled type="email" v-model="email" label="Email*" hint="Digite su email de cuenta" lazy-rules
            :rules="[val => val && val.length > 0 || 'Email no puede estar vacío, debe ser un email válido']" />
          <q-input filled :type="passwordFieldType" v-model="password" label="Contraseña*" lazy-rules
            :rules="[val => val && val.length > 0 || 'Contraseña no puede estar vacía']">
            <template v-slot:append>
              <q-icon :name="passwordIcon" @click="togglePasswordVisibility" class="cursor-pointer" />
            </template>
          </q-input>
          <div class="q-mt-md">
            <q-btn label="Ingresar" type="submit" color="primary" :disable="loading"  />
          </div>
          <div class="forgot-password">
            <router-link to="/recuperar-password">¿Olvidaste tu contraseña?</router-link>
          </div>
        </q-form>
        <q-spinner v-if="loading" size="lg" color="primary" class="loading-spinner" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from "../store/usuarios.js";
import { useQuasar, Notify } from 'quasar';

const email = ref('alex@gmail.com');
const password = ref('Alex12345$');    
const showPassword = ref(false);

const usuariosStore = useUsuariosStore();
const router = useRouter();
const loading = ref(false);
const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'));
const passwordIcon = computed(() => (showPassword.value ? 'visibility_off' : 'visibility'));

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

const loadingState = ref({});

async function onSubmit() {
  loading.value = true;
  try {
    let r = await usuariosStore.login(email.value, password.value);
    console.log(r);
    router.push('/home');
    Notify.create({
      type: 'positive',
      message: 'Ingreso exitoso',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    Notify.create({
      type: 'negative',
      message: 'Usuario o Contraseña invalidos',
      icon: 'error',
      position: 'top',
      timeout: 3000,
    });
  }finally {
    loading.value = false;
    loadingList.value = null; 
}
}
function onReset() {
  email.value = '';
  password.value = '';
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  background-image: url("./imagenes/fondo.jpg");
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-image: url("./imagenes/fondo.jpg");
}

.welcome-container {
  flex: 1;
  text-align: left;
  padding: 20px;
  color: white;
}

.welcome-text {
  font-size: 6rem;
  font-weight: bold;
  color: #f5f5f5;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(247, 92, 2, 0.9);
}

.form-container {
  max-width: 400px;
  width: 100%;
  background-color: rgba(212, 212, 212, 0.89);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 2% 3%;
}

.logo {
  display: block;
  margin: 0 auto 20px auto;
  width: 150px;
}

.form-title {
  text-align: center;
  font-size: 2rem;
  color: #ffffff;
  background-color: #F2630D;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-content {
  padding: 20px;
  background-color: transparent;
}

.q-input,
.q-btn {
  font-size: 1.2rem;
}

.q-btn {
  width: 100%;
  margin-top: 20px;
}

.q-icon {
  cursor: pointer;
}



.forgot-password {
  text-align: center;
  margin-top: 20px;
}
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style> -->



<template>
  <div class="container">
    <div class="welcome-container">
      <h1 class="welcome-text">Body Champion</h1>
    </div>
    <div class="form-container">
      <img src="./imagenes/loginlogo.png" class="logo" />
      <h2 class="form-title">Iniciar Sesión</h2>
      <div class="form-content">
        <q-form @submit="onSubmit()" @reset="onReset" class="q-gutter-md">
          <q-input filled type="email" v-model="email" label="Email*" hint="Digite su email de cuenta" lazy-rules
            :rules="[val => val && val.length > 0 || 'Email no puede estar vacío, debe ser un email válido']" />
          <q-input filled :type="passwordFieldType" v-model="password" label="Contraseña*" lazy-rules
            :rules="[val => val && val.length > 0 || 'Contraseña no puede estar vacía']">
            <template v-slot:append>
              <q-icon :name="passwordIcon" @click="togglePasswordVisibility" class="cursor-pointer" />
            </template>
          </q-input>
          <div class="q-mt-md">
            <q-btn label="Ingresar" type="submit" color="primary" :disable="loading" />
          </div>
          <div class="forgot-password">
            <router-link to="/recuperar-password">¿Olvidaste tu contraseña?</router-link>
          </div>
        </q-form>
        <div v-if="loading" class="loading-overlay">
          <q-spinner-hourglass  color="primary"  size="10em"/>
         
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from "../store/usuarios.js";
import { useQuasar, Notify } from 'quasar';

const email = ref('alex@gmail.com');
const password = ref('Alex12345$');    
const showPassword = ref(false);

const usuariosStore = useUsuariosStore();
const router = useRouter();
const loading = ref(false);
const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'));
const passwordIcon = computed(() => (showPassword.value ? 'visibility_off' : 'visibility'));

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

const loadingState = ref({});

async function onSubmit() {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    let r = await usuariosStore.login(email.value, password.value);
    console.log(r);
    router.push('/home');
    Notify.create({
      type: 'positive',
      message: 'Ingreso exitoso',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    Notify.create({
      type: 'negative',
      message: 'Usuario o Contraseña invalidos',
      icon: 'error',
      position: 'top',
      timeout: 3000,
    });
  } finally {
    loading.value = false;
  }
}

function onReset() {
  email.value = '';
  password.value = '';
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  background-image: url("./imagenes/fondo.jpg");
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-image: url("./imagenes/fondo.jpg");
}

.welcome-container {
  flex: 1;
  text-align: left;
  padding: 20px;
  color: white;
}

.welcome-text {
  font-size: 6rem;
  font-weight: bold;
  color: #f5f5f5;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(247, 92, 2, 0.9);
}

.form-container {
  max-width: 400px;
  width: 100%;
  background-color: rgba(212, 212, 212, 0.89);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 2% 3%;
  position: relative; /* Added */
}

.logo {
  display: block;
  margin: 0 auto 20px auto;
  width: 150px;
}

.form-title {
  text-align: center;
  font-size: 2rem;
  color: #ffffff;
  background-color: #F2630D;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-content {
  padding: 20px;
  background-color: transparent;
}

.q-input,
.q-btn {
  font-size: 1.2rem;
}

.q-btn {
  width: 100%;
  margin-top: 20px;
}

.q-icon {
  cursor: pointer;
}

.forgot-password {
  text-align: center;
  margin-top: 20px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8); /* Add a slight background to make the spinner more visible */
  z-index: 999; /* Ensure it is on top of other elements */
}
</style>
