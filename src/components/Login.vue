

<template>
  <div class="container">
    <div class="form-container">
      <h2 class="form-title">Iniciar Sesión</h2>
      <img src="./imagenes/loginlogo-removebg-preview.png" class="logo" />

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
            <q-btn label="Ingresar" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from "../store/usuarios.js";

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const usuariosStore = useUsuariosStore();
const router = useRouter();

const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'));
const passwordIcon = computed(() => (showPassword.value ? 'visibility_off' : 'visibility'));

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function onSubmit() {
  try {
    let r = await usuariosStore.login(email.value, password.value);
    console.log(r);
    router.push('/home');
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
  }
}

function onReset() {
  email.value = '';
  password.value = '';
}
</script>


<style scoped>
html, body, .container {
  
  font-weight: bold;
  width: 100%;
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./imagenes/fondo2.jpg");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
}

.logo {
  display: flex;
 margin-left: 20%;
  width: 250px;
}
.form-container {
  max-width: 400px;
  margin: auto;
}

.form-title {
  text-align: center;
  font-size: 300%;
  color: white;
  background-color:#F2630D;
  }

.form-content {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 2px 4px 4px 4px rgba(0, 0, 0, 0.1);
}
</style>
