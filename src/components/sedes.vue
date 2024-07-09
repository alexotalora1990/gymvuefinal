<template>
  <div>
    <div class="q-pa-md">

      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregar()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>

        <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
          <q-list>
            <q-item clickable v-ripple @click="listar('todos')" :class="{ 'loading-item': loading && loadingList === 'todos' }">
              <q-item-section>Listar Todos</q-item-section>
              <template v-if="loading && loadingList === 'todos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>
            <q-item clickable v-ripple @click="listar('activos')" ::class="{ 'loading-item': loading && loadingList === 'activos' }">
              <q-item-section>Listar Activos</q-item-section>
              <template v-if="loading && loadingList === 'activos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>
            <q-item clickable v-ripple @click="listar('inactivos')" :class="{ 'loading-item': loading && loadingList === 'inactivos' }">
              <q-item-section>Listar Inactivos</q-item-section>
              <template v-if="loading && loadingList === 'inactivos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">

          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{ tituloFormulario }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
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

              <div class="q-mt-md q-flex q-justify-end">
                <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
                <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" :loading="loading && loadingList === 'guardar'" />
              </div>
          </q-form>
        </q-page>
      </div>



      <q-table title="Sedes" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px; " class="table1">
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
            <q-btn @click="editar(props.row)">✍
              <q-tooltip class="bg-accent">Editar</q-tooltip>
            </q-btn>
        
            <q-btn 
              :loading="loadingState[props.row._id]" 
              v-if="props.row.estado === 1" 
              @click="desactivar(props.row._id)">
              ❌
              <q-tooltip class="bg-accent">Desactivar</q-tooltip>
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
        
            <q-btn 
              :loading="loadingState[props.row._id]" 
              v-else 
              @click="activar(props.row._id)">
              ✅
              <q-tooltip class="bg-accent">Activar</q-tooltip>
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
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
const loading = ref(false); 
const loadingList = ref(null); 

const columns = ref([
  { name: "nombre", label: "Nombre Sede", field: "nombre", align: "center" },
  { name: "direccion", label: "Direccion", field: "direccion", align: "center" },
  { name: "horario", label: "Horarios", field: "horario", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const loadingState = ref({});

async function listarSedes() {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useSedes.getSede();
    console.log(r.sede)
    rows.value = r.sede;
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }finally {
    loading.value = false;
    loadingList.value = null;
  }
}
async function listarSedesActivas() {
  loading.value = true;
  loadingList.value = 'activos';
  try {
   const r = await useSedes.getSedesActivas();
  console.log(r.data.sedeActiva);
  rows.value = r.data.sedeActiva;
  } catch (error) {
    console.error('Error al listar sedes activos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarSedesInactivas() {
  loading.value = true;
  loadingList.value = 'inactivos';
  try {
  const r = await useSedes.getSedesInactivas();
  console.log(r.data.sedeInactiva);
  rows.value = r.data.sedeInactiva;
  } catch (error) {
    console.error('Error al listar sedes inactivos:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null; 
  }
}



onMounted(() => {
  listarSedes();
});

function listar(tipo) {

  loading.value = true;
  loadingList.value = tipo;
  if (tipo === 'activos') {
    listarSedesActivas();
  } else if (tipo === 'inactivos') {
    listarSedesInactivas();
  } else {
    listarSedes();
  }
}

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
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
  }finally {
    loading.value = false;
    loadingList.value = null;
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
  loading.value = true;
  loadingList.value = 'agregar';
  try {
   sedeSeleccionada.value = null
  verFormulario.value = true
  tituloFormulario.value = 'Agregar Sede'
    
  } 
  catch (error) {
    console.error('Error al agregar sede:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}


async function activar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando activar sede con ID: ${id}`);
    const response = await useSedes.putSedeActivar(id);
    console.log('Respuesta de activación:', response);
    await listarSedes();
    Notify.create({
      type: 'positive',
      message: 'sede activado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al activar sede:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar sede',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}

async function desactivar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando desactivar sede con ID: ${id}`);
    const response = await useSedes.putSedeDesactivar(id);
    console.log('Respuesta de desactivación:', response);
    await listarSedes();
    Notify.create({
      type: 'positive',
      message: 'Sede desactivada exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al desactivar sede:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar sede',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
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

.customNotify {
  font-size: 18px;
  background-color: red;

  color: white;
  padding: 10px;
  border-radius: 8px;
}

.table1 {
  background-color: #f2650da9;
  color: white;
}

.table {
  background-color: rgba(255, 255, 255, 0.9);

}

.q-mt-md {
  text-align: right;
 margin: 0;

}


.form-container {
  min-width: 60%;
  position: absolute;
  z-index: 1000;
  margin-left: 20%;
}

.form-content {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #e6e5e5;
  margin-bottom: 10%;
}

.form-header {
  background-color: #F2630D;
  padding: 0.5rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title {
  color: white;
  margin: 0;
  text-align: center;
  font-weight: bold;
  margin-left: 35%;
}

.close-btn {
  color: white;
}
</style>
