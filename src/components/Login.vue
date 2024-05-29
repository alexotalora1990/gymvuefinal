<template>
  <div class="form-container">
    <h2 class="form-title">Iniciar Sesión</h2>

    <div class="form-content">
      <q-form @submit="onSubmit()" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          type="email"
          v-model="email"
          label="Email*"
          hint="Digite su email de cuenta"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Email no puede estar vacío, debe ser un email válido']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Contraseña*"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Contraseña no puede estar vacía']"
        />

        <!-- <q-select
          filled
          v-model="roll"
          label="Roll*"
          :options="rollOptions"
          :rules="[val => !!val || 'Debe seleccionar un rol']"
        /> -->

        <div class="q-mt-md">
          <q-btn label="Ingresar" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>


import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from "../store/usuarios.js";

const email = ref('');
const password = ref('');

const usuariosStore = useUsuariosStore();
const router = useRouter();

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
.form-container {
  max-width: 400px;
  margin: auto;
}

.form-title {
  text-align: center;
  font-size: 300%;
}

.form-content {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 2px 4px 4px 4px rgba(0, 0, 0, 0.1);
}
</style>
