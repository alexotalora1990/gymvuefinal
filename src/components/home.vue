
<template>
  <div class="container">
    <img src="./imagenes/fondo-removebg-preview.png" class="background-image">
    
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="./imagenes/logo-removebg-preview.png">
          </q-avatar>
          BODY CHAMPION
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
        <q-btn dense flat round icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="desktop">
      <q-tabs vertical class="bg-secondary">
        <q-route-tab to="/" label="inicio" />
        <q-route-tab to="/productos" label="productos" />
        <q-route-tab to="/usuarios" label="usuarios" />
        <q-route-tab to="/clientes" label="clientes" />
        <q-route-tab to="/ingresos" label="ingresos" />
        <q-route-tab to="/sedes" label="sedes" />
        <q-route-tab to="/mantenimientos" label="mantenimientos" />
        <q-route-tab to="/maquinas" label="maquinas" />
        <q-route-tab to="/pagos" label="pagos" />
        <q-route-tab to="/planes" label="planes" />
        <q-route-tab to="/ventas" label="ventas" />
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-secondary text-black">
      <q-toolbar>
        <q-toolbar-title>
          <div>Todos los derechos reservados</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../store/usuarios.js';

const rightDrawerOpen = ref(false);
const router = useRouter();
const usuariosStore = useUsuariosStore();

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const logout = () => {
  usuariosStore.logout();
  router.push('/');
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
}

.content {
  position: relative;
  z-index: 1;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%; 
  object-fit: cover;
}

.q-header {
  height: 60px;
}

.q-tab {
  background-color: #f2630d;
  color: #ffff;
  width: 50%;
  border-radius: 8px;
  margin: 2%;
  margin-left: 25%;
}

.q-footer {
  height: 40px;
  text-align: center;
}
</style>

