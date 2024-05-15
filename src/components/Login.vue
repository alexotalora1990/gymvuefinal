<template>
  <div class="container">

    <H2>Iniciar Sesion</H2>

    <input type="text" placeholder="email" v-model="email">
    <input type="text" placeholder="password" v-model="password">
    <button type="submit" @click="iniciarSesion()" >Ingresar</button>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const router = useRouter();

const email= ref()
const password= ref()

function iniciarSesion(


){

}

</script>


<style>
.container {
  text-align: center;
}

.container2 {
  text-align: left;
  margin-left: 45%;
  width: 50%;
}
</style>