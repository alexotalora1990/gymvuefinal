<template>
  <div>
    <div class="q-pa-md">

     
      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregar()">Agregar</q-btn>
        <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
          <q-list>
            <q-item clickable v-ripple @click="listar('todos')">
              <q-item-section>Listar Todos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listar('activos')">
              <q-item-section>Listar Activos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listar('inactivos')">
              <q-item-section>Listar Inactivos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">


          <div class="q-flex q-justify-between q-items-center">
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }}</h5>

          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">

            <q-input filled v-model="nombre" label="Nombre" type="text"
              :rules="[val => !!val || 'Nombre no puede estar vacía']" />


            <q-input filled v-model="direccion" label="Dirección" type="text"
              :rules="[val => !!val || 'Dirección debe ser un número positivo']" />

            <q-input filled v-model="horario" label="Horario" type="text"
              :rules="[val => !!val || 'Horario no debe estar vacio']" />

            <q-input filled v-model="telefono" label="Telefono" type="number"
              :rules="[val => val && val > 0 || 'telefono debe ser un número positivo']" />

            <q-input filled v-model="ciudad" label="Ciudad" type="text"
              :rules="[val => !!val || 'Ciudad no debe estar vacio']" />

            <div class="q-mt-md">
              <q-btn label="Agregar" color="green" type="submit" />
              <q-btn label="❌" color="red" outline @click="cerrarFormulario()" />
            </div>
          </q-form>
        </q-page>
      </div>



      <q-table title="Sedes" title-class="table-title" :rows="rows" :columns="columns" row-key="_id">
        <template v-slot:header="props">
          <q-tr :props="props" style="background-color: #F2630D; color: white; font-size: 24px; ">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">{{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">
              🖋️
            </q-btn>
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row._id)">❌</q-btn>

            <q-btn v-else @click="activar(props.row._id)">✅</q-btn>

          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSedesStore } from "../store/sedes.js";
import axios from 'axios';
import { useQuasar,Notify } from 'quasar';

const useSedes = useSedesStore();

const verFormulario = ref(false)
const sedeSeleccionada = ref(null)
const tituloFormulario = ref('Agregar Sede')

const nombre = ref()
const direccion = ref()
const horario = ref()
const telefono = ref()
const ciudad = ref()

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre Sede", field: "nombre", align: "center" },
  { name: "direccion", label: "Direccion", field: "direccion", align: "center" },
  { name: "horario", label: "Horarios", field: "horario", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

async function listarSedes() {
  try {
    const r = await useSedes.getSede();
    console.log(r.sede)
    rows.value = r.sede;
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
}async function listarSedesActivas() {
  const r = await useSedes.getSedesActivas();
  console.log(r.data.sedeActiva);
  rows.value = r.data.sedeActiva;
}

async function listarSedesInactivas() {
  const r = await useSedes.getSedesInactivas();
  console.log(r.data.sedeInactiva);
  rows.value = r.data.sedeInactiva;
}



onMounted(() => {
  listarSedes();
});

function listar(tipo) {
  if (tipo === 'activos') {
    listarSedesActivas();
  } else if (tipo === 'inactivos') {
    listarSedesInactivas();
  } else {
    listarSedes();
  }
}

const procesarFormulario = async () => {
  try {
    if (  sedeSeleccionada !== null && sedeSeleccionada.value !== null) {
     const sede= await useSedes.putSede(sedeSeleccionada.value._id, {
        nombre: nombre.value,
        direccion: direccion.value,
        horario: horario.value,
        telefono: telefono.value,
        ciudad: ciudad.value
      });
      Notify.create({
        type: 'positive',
        message: 'Sede editada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {
     const sede= await useSedes.postSede({
        nombre: nombre.value,
        direccion: direccion.value,
        horario: horario.value,
        telefono: telefono.value,
        ciudad: ciudad.value

      });
      Notify.create({
        type: 'positive',
        message: 'Sede agregada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
         }

    listarSedes()
    cerrarFormulario()
    limpiar()
    sedeSeleccionada.value = null


  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
}

async function editar(sede) {



  if (sede.estado !== 1) {
    Notify.create({
      type: 'negative',
      message: 'Para editar una sede debe estar activa',
      classes: 'customNotify',
      icon: 'warning',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black'  }]
      
    });
    return;
  }
  tituloFormulario.value = 'Editar Sede'
  sedeSeleccionada.value = sede

  nombre.value = sede.nombre
  direccion.value = sede.direccion
  horario.value = sede.horario
  telefono.value = sede.telefono
  ciudad.value = sede.ciudad

  verFormulario.value = (true)
}


async function agregar() {
  sedeSeleccionada.value = null
  verFormulario.value = true
  tituloFormulario.value = 'Agregar Sede'

}

async function activar(id) {

  const route = await useSedes.putSedeActivar(id)
  listarSedes()

}

async function desactivar(id) {
  const route = await useSedes.putSedeDesactivar(id)
  listarSedes()
}

async function cerrarFormulario() {
  verFormulario.value = (false)
  sedeSeleccionada.value = null
  limpiar()
}

function limpiar() {
  nombre.value = ("")
  direccion.value = ("")
  horario.value = ("")
  telefono.value = ("")
  ciudad.value = ("")
}
</script>


<style scoped>
.form-container {
  min-width: 60%;
  position: absolute;
  z-index: 1000;
  margin-left: 20%;



}

.form-content {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 10%;
}

.form-title {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.shadow-2 {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.rounded-borders {
  border-radius: 8px;
}

.table-title {
  text-align: center;
  position: relative;
  z-index: 999;
}


</style>
