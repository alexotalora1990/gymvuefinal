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
            <b> BODY CHAMPION</b>
          </q-toolbar-title>

          <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
          <q-btn dense flat round icon="logout" @click="logout" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="desktop">
        <div class="drawer-content">
          <q-tabs vertical class="bg-secondary">
            <q-route-tab v-for="route in filteredRoutes" :key="route.path" :to="route.path" :label="route.name" />
          </q-tabs>
        </div>
      </q-drawer>

      <q-page-container>
        <div class="usuario">
          <h5> {{ user.roll }} </h5>
        </div>
        <div>
          <router-view />
        </div>
      </q-page-container>

      <q-footer class="bg-secondary text-black">
        <q-toolbar>
          <q-toolbar-title>
            <div><strong>Todos los derechos reservados</strong></div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../store/usuarios.js';
import { routes } from "../routes/routes.js"

const rightDrawerOpen = ref(false);
const router = useRouter();
const usuariosStore = useUsuariosStore();
 
const user = usuariosStore.user;

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const logout = () => {
  usuariosStore.logout();
  router.push('/');
};

const filteredRoutes = computed(() => {
  const userRole = user.roll;
  return routes.find(route => route.path === '/home').children.filter(childRoute => {
    return childRoute.meta.rol.includes(userRole);
  });
});
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

.usuario h5 {
  background-color: #f2650d;
  width: 15%;
  text-align: center;
  margin-left: 2%;
  color: white;
  border-radius: 5px;
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
  background-color: #f2650d;
  color: #ffff;
  width: 50%;
  border-radius: 8px;
  margin: 2%;
  margin-left: 25%;
}

.q-footer {
  height: 40px;
  text-align: center;
  font-family: Edwardian Script ITC, Curlz MT, Brush Script MT, Baskerville Old Face, Algerian, Chiller;
}

.drawer-content {
  overflow-y: auto;
  max-height: 100vh; 
}
</style>
