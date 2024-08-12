
<template>
  <div>
    <div class="q-pa-md">
      <div class="flex justify-end">

        <q-input filled label="Buscar por nombre"
          style="background-color:#d3d0d0; color: black; width: 30%; border-radius: 5px; margin-right: 1%;"
          v-model="nombreMaquina" @keyup.enter="listarNombre">
          <template v-slot:append>
            <q-btn icon="search" @click="listarNombre" style="background-color:#ffff;" />
          </template>
        </q-input>


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
            <q-input filled v-model="descripcion" label="Descripción" type="text"
              :rules="[(val) => !!val.trim() || 'Descripción no puede estar vacía']" />

              <q-select
                 filled 
                 v-model="idSede"
                  label="Seleccione una sede"
                   :options="sedeOptions"
                    :rules="[val => !!val || 'Debe seleccionar una sede']"
                    use-input
              input-debounce="300"
              @filter="filterSedeOptions"
               />

            <q-input filled v-model="fechaUltimoMant" label="Último Mantenimiento" type="date"
              :rules="[(val) => !!val || 'Fecha último mantenimiento no debe estar vacía']" />

              <div class="q-mt-md q-flex q-justify-end">
                <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
                <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" :loading="loading && loadingList === 'guardar'" />
              </div>
          </q-form>
        </q-page>
      </div>

      <div v-if="loading" class="overlay">
        <q-spinner-hourglass  color="primary" size="50px"  />
      </div>

      <q-table title="Maquinas" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px;" class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p style="color: green" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red" v-else>Inactivo</p>
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
import { ref, onMounted } from 'vue';
import { useMaquinaStore } from '../store/maquinas.js';
import { useSedesStore } from '../store/sedes.js';
import axios from 'axios';
import { useQuasar,Notify } from 'quasar';

const verFormulario = ref(false);

const maquinaSeleccionada = ref(null);
const tituloFormulario = ref('Agregar Maquina');

const useMaquina = useMaquinaStore();
const useSedes = useSedesStore();
const idSede = ref();
const descripcion = ref();
const fechaUltimoMant = ref();
const sedeOptions = ref([]);
const filteredSedeOptions = ref([]);
const nombreMaquina=ref('')

const rows = ref([]);
const loading = ref(false); 
const loadingList = ref(null); 

const columns = ref([
  { name: 'idSede', label: 'Sede', field: (row)=>row.idSede?.nombre || 'Sin Nombre', align: 'center' },
  { name: 'descripcion', label: 'Nombre', field: 'descripcion', align: 'center' },
  { name: 'fechaUltimoMant', label: 'Fecha Último Mantenimiento', field: 'fechaUltimoMant', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' },
]);

const loadingState = ref({});
const filterSedeOptions = (val, update) => {
  if (val === '') {
    update(() => {
      filteredSedeOptions.value = sedeOptions.value;
    });
    return;
  }
  
  const needle = val.toLowerCase();
  update(() => {
    filteredSedeOptions.value = sedeOptions.value.filter(v => v.label.toLowerCase().includes(needle));
  });
};

async function listarMaquina()  {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useMaquina.getMaquina();
  rows.value = r.data.maquina.map(maquina => {
    const sede = sedeOptions.value.find(s => s.value === maquina.idSede);
    return {
      ...maquina,
      idSede: sede ? sede.label : maquina.idSede,
      fechaUltimoMant: new Date(maquina.fechaUltimoMant).toLocaleDateString('es-ES'),
    };
  });
  } catch (error) {
    console.error('Error al listar todos las maquinas:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}


const listarSedes = async () => {
  try {
    const r = await useSedes.getSede();
    sedeOptions.value = r.sede.map(sede => ({ label: sede.nombre, value: sede._id }));
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
};

async function listarMaquinasActivas() {
  loading.value = true;
  loadingList.value = 'activos';
  try {
   const r = await useMaquina.getMaquinasActivas();
  rows.value = r.data.maquinasActivas.map(maquina => {
    const sede = sedeOptions.value.find(s => s.value === maquina.idSede);
    return {
      ...maquina,
      idSede: sede ? sede.label : maquina.idSede,
      fechaUltimoMant: new Date(maquina.fechaUltimoMant).toLocaleDateString('es-ES'),
    };
  });
  } catch (error) {
    console.error('Error al listar clientes activos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}
const formatDates = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().substr(0,10);
};

async function listarMaquinasInactivas() {
  loading.value = true;
  loadingList.value = 'inactivos';
  try {
     const r = await useMaquina.getMaquinasInactivas();
  rows.value = r.data.maquinasInactivas.map(maquina => {
    const sede = sedeOptions.value.find(s => s.value === maquina.idSede);
    return {
      ...maquina,
      idSede: sede ? sede.label : maquina.idSede,
      fechaUltimoMant: new Date(maquina.fechaUltimoMant).toLocaleDateString('es-ES'),
    };
  }); 
  } finally {
    loading.value = false;
    loadingList.value = null; 
  }
}

async function listarNombre() {
  if (nombreMaquina.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Digite el nombre de un producto'
    });
  }
  const r = await useMaquina.getMaquina();
  const maquinaFiltrada = r.data.maquina.filter(maquina =>
    maquina.descripcion.toLowerCase().includes(nombreMaquina.value.toLowerCase())
  );
  if (maquinaFiltrada.length === 0) {
    Notify.create({
      type: 'negative',
      message: 'Producto no existe'
    });
  }
  else {
    rows.value = maquinaFiltrada
  }
  nombreMaquina.value = ("")
}


onMounted(async () => {
  await listarSedes();
  listarMaquina();
});

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
  try {

    const Maquina={
      idSede: idSede.value.value,
        descripcion: descripcion.value,
        fechaUltimoMant: fechaUltimoMant.value,
    }
    if (maquinaSeleccionada !== null && maquinaSeleccionada.value !== null) {
      await useMaquina.putMaquina(maquinaSeleccionada.value._id, Maquina);
      Notify.create({
        type: 'positive',
        message: 'Maquina editada exitosamente',
             icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {
      await useMaquina.postMaquina(Maquina);
      Notify.create({
        type: 'positive',
        message: 'Maquina agregada exitosamente',
       
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    }

    listarMaquina();
    cerrarFormulario();
    limpiar();
    maquinaSeleccionada.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }finally {
    loading.value = false;
    loadingList.value = null;
  }
};

async function editar(maquina) {
  maquinaSeleccionada.value = maquina;
  tituloFormulario.value = 'Editar Maquina';
console.log(maquina.idSede.nombre);
  idSede.value = maquina.idSede.nombre;
  descripcion.value = maquina.descripcion;
  fechaUltimoMant.value = formatDates(maquina.fechaUltimoMant);
  
  

  verFormulario.value = true;
}



async function agregar() {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
     maquinaSeleccionada.value = null;
  verFormulario.value = true;
  tituloFormulario.value = 'Agregar Maquina';
  idSede.value = null;
  descripcion.value = null;
  fechaUltimoMant.value = null;
    
  } 
  catch (error) {
    console.error('Error al agregar maquina:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

function cerrarFormulario() {
  verFormulario.value = false;
  maquinaSeleccionada.value = null;
  limpiar();
}

async function activar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando activar cliente con ID: ${id}`);
    const response = await useMaquina.putMaquinaActivar(id);;
    console.log('Respuesta de activación:', response);
    await listarMaquina();
    Notify.create({
      type: 'positive',
      message: 'Maquina activada exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al activar maquina:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar maquina',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}

async function desactivar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando desactivar cliente con ID: ${id}`);
    const response =  await useMaquina.putMaquinaDesactivar(id);
    console.log('Respuesta de desactivación:', response);
    await listarMaquina();
    Notify.create({
      type: 'positive',
      message: 'Maquina desactivado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al desactivar maquina:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar maquina',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}

function limpiar() {
  idSede.value = '';
  descripcion.value = '';
  fechaUltimoMant.value = '';
}

function listar(tipo) {
  loading.value = true;
  loadingList.value = tipo;
  if (tipo === 'activos') {
    listarMaquinasActivas();
  } else if (tipo === 'inactivos') {
    listarMaquinasInactivas();
  } else {
    listarMaquina();
  }
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
  margin-bottom: 7%;
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}
</style>
