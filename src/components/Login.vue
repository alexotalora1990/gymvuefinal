<template>
  <div class="form-container">
    <h2 class="form-title">Iniciar Sesión</h2>

    <div class="form-content">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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

        <q-select
          filled
          v-model="role"
          label="Roll*"
          :options="rollOptions"
          :rules="[val => !!val || 'Debe seleccionar un rol']"
        />

        <div class="q-mt-md">
          <q-btn label="Ingresar" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const role = ref('');
const rollOptions = ['Administrador', 'Instructor', 'Recepción'];


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
