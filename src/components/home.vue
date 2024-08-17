<template>
  <div class="container">
    <img src="./imagenes/fondo-removebg-preview.png" class="background-image">
    
    <q-layout view="hHh lpR fFf">
      <q-header class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
          
          <q-toolbar-title class="q-toolbar-title-center">
            <q-avatar>
              <img src="./imagenes/logo-removebg-preview.png">
            </q-avatar>
            <b>BODY CHAMPION</b>
          </q-toolbar-title>

          <q-btn dense flat round icon="home" @click="goHome" />
          <q-btn dense flat round icon="logout" @click="logout" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="rightDrawerOpen" side="left" overlay behavior="desktop">
        <div class="drawer-content">
          <q-tabs vertical class="bg-secondary">
            <q-route-tab 
              v-for="route in filteredRoutes" 
              :key="route.path" 
              :to="route.path" 
              :label="route.name" 
              @click="handleNavigation(route)" 
            />
          </q-tabs>
        </div>
      </q-drawer>

      <q-page-container>
        <div class="usuario">
          <h5>{{ user.roll }}</h5>
        </div>
        <div class="q-pa-md">
          <div v-if="!selectedCard" class="row">
            <div v-for="route in filteredRoutes" :key="route.path" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-mb-md">
              <q-card @click="handleNavigation(route)" class="q-hoverabl" style="cursor: pointer;">
                <q-card-section>
                  <div class="text-h6">{{ route.name }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div v-else>
            
            <q-card class="q-mb-md">
              <q-card-section>
                <router-view />
              </q-card-section>
            </q-card>
          </div>
          <q-btn flat label="Volver" icon="arrow_back" @click="deselectCard" />
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../store/usuarios.js';
import { routes } from "../routes/routes.js";

const rightDrawerOpen = ref(false);
const router = useRouter();
const usuariosStore = useUsuariosStore();
const user = usuariosStore.user;

const selectedCard = ref(null);


onMounted(() => {
  const savedRoute = localStorage.getItem('selectedRoute');
  if (savedRoute) {
    selectedCard.value = JSON.parse(savedRoute);
    router.push(selectedCard.value.path);
  }
});

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const logout = () => {
  usuariosStore.logout();
  localStorage.removeItem('selectedRoute'); 
  router.push('/');
};

const goHome = () => {
  selectedCard.value = null;
  localStorage.removeItem('selectedRoute'); 
  router.push('/home');
};

const handleNavigation = (route) => {
  selectedCard.value = route;
  localStorage.setItem('selectedRoute', JSON.stringify(route)); 
  router.push(route.path);
};

const deselectCard = () => {
  selectedCard.value = null;
  localStorage.removeItem('selectedRoute'); 
  router.push('/home');
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

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-xs-12 {
  flex: 0 0 100%;
}

.col-sm-6 {
  flex: 0 0 50%;
}

.col-md-4 {
  flex: 0 0 33.33%;
}

.col-lg-3 {
  flex: 0 0 25%;
}

.q-hoverabl {
  background-color: rgba(203, 210, 217, 0.8); 
  margin: 3%;
  text-align: center;
  border-radius: 8px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.6); 
  transition: box-shadow 0.3s ease, transform 0.3s ease; 
  text-transform: uppercase;
}

.q-hoverabl:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.9); 
  transform: translateY(-2px); 
}

.q-toolbar-title-center {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-toolbar-title-center q-avatar {
  margin-right: 8px;
}
</style>
