<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          GYM
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="desktop" >
      <q-tabs vertical class="bg-secondary ">
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

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
              <div >Todos los derechos reservados</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const rightDrawerOpen = ref(false)

    return {
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>
.q-header{
  height: 60px;
}
.q-tab {
  background-color: green; 
  color: #ffff;
    width: 50%;
  border-radius: 8px;
    margin: 2%;
    margin-left: 25%;
}
.q-footer{
  height: 40px;
  text-align: center;
}
</style>
