<template>
  <div>


    <div class="q-pa-md">

      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregarPago()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>
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

            <q-select filled v-model="idplan" label="Seleccione un plan" :options="planOptions"
            :rules="[val => !!val || 'Debe seleccionar un plan']" />

            <q-select filled v-model="idcliente" label="Seleccione un cliente" :options="clienteOptions"
              :rules="[val => !!val || 'Debe seleccionar un cliente']" />
              <q-input filled v-model="fechaVencimiento" label="Fecha de Vencimiento" type="date"
              :rules="[
                val => !!val || 'Fecha de vencimiento no debe estar vacía',
                val => new Date(val) > new Date() || 'La fecha de vencimiento debe ser mayor a la fecha actual'
              ]" />

              <div class="q-mt-md q-flex q-justify-end">
              
                <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" :loading="loading && loadingList === 'guardar'" />
              </div>
          </q-form>
        </q-page>
      </div>

      <div v-if="loading" class="overlay">
        <q-spinner-hourglass  color="primary" size="50px"  />
      </div>

      <q-table title="Pagos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px; " class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
            {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
          </p>
        </q-td>
      </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">✍
              <q-tooltip class="bg-accent">Editar</q-tooltip>
            </q-btn>

            
        
            <q-btn 
              :loading="loadingState[props.row]" 
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
import { ref, onMounted } from "vue"
import { usePagosStore } from "../store/pagos.js"
import { useClientesStore } from '../store/clientes.js';
import { usePlanesStore } from "../store/planes.js"
import axios from 'axios';
import { useQuasar, Notify } from 'quasar';

const verFormulario = ref(false)

const pagoSeleccionado = ref(null);
const tituloFormulario = ref('Agregar Pagos')

const usePagos = usePagosStore();
const useClientes = useClientesStore();
const usePlanes = usePlanesStore();
const idcliente = ref()
const idplan = ref()
const fechaVencimiento = ref()
const clienteOptions = ref([])
const planOptions = ref([])
const rows = ref([])
const loading = ref(false); 
const loadingList = ref(null); 

const columns = ref([
  {
    name: "idcliente", label: "Cliente",
    field: (row) => row.idcliente?.nombre, align: "center"
  },
  {
    name: "idplan", label: "Plan",
    field: (row) => row.idplan?.descripcion,
    align: "center"
  },
  { name: "valor", label: "Precio", field: row => puntosMil(row.valor), align: "center" },
  { name: "fechaVencimiento", label: "Fecha Vencimiento", field: "fechaVencimiento", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

const loadingState = ref({});

async function listarpagos()  {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await usePagos.getPagos()
  console.log(r.data.pago);
  rows.value = r.data.pago.map(pago=>({
    ...pago,
    fechaVencimiento: new Date(pago.fechaVencimiento).toLocaleDateString('es-ES')
  }))
  
  } catch (error) {
    console.error('Error al listar todos los pagos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}




async function listarClientes() {
  try {
    const r = await useClientes.getCliente();
    console.log(r.data.Cliente);
    if (r && r.data.Cliente) {

      clienteOptions.value = r.data.Cliente.map(idcliente => ({
        label: idcliente.nombre,
        value: idcliente._id
      }));
      console.log(clienteOptions.value);
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.cliente);
    }
  } catch (error) {
    console.error("Error al obtener las clientes:", error);
  }

}

async function listarPlanes() {
  try {
    const r = await usePlanes.getPlanes();
    console.log(r.data.plan);
    if (r && r.data.plan) {

      planOptions.value = r.data.plan.map(idplan => ({
        label: idplan.descripcion,
        value: idplan._id
      }));
      console.log(planOptions.value); 
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.plan);
    }
  } catch (error) {
    console.error("Error al obtener los planes:", error);
  }

}


async function listarPagosActivos() {
  loading.value = true;
  loadingList.value = 'activos';
  try {
   const r = await usePagos.getPagosActivos();
  console.log(r.data.pagoActivo);
  rows.value = r.data.pagoActivo;
  } catch (error) {
    console.error('Error al listar pagos activos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarPagosInactivos() {
  loading.value = true;
  loadingList.value = 'inactivos';
  try {
  const r = await usePagos.getPagosInactios();
  console.log(r.data.pagoInactivo);
  rows.value = r.data.pagoInactivo;
  } catch (error) {
    console.error('Error al listar pagos inactivos:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null; 
  }
}


onMounted(() => {
  listarpagos()
  listarClientes()
  listarPlanes()
})

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
  try {

    console.log(idcliente.value.value);
    const idpagoSeleccionado = idcliente.value.value
    console.log(idplan.value.value);
    const idpagoSeleccionado2 = idplan.value.value

    const pago ={
      idcliente:idpagoSeleccionado,
      idplan:idpagoSeleccionado2,
      fechaVencimiento:fechaVencimiento.value
    }



    if (pagoSeleccionado.value !== null) {

       await usePagos.putPagos(pagoSeleccionado.value._id,pago);
      Notify.create({
        type: 'positive',
        message: 'Pago editado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {


      await usePagos.postPagos(pago);
      Notify.create({
        type: 'positive',
        message: 'Pago agregado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    }

    listarpagos();
    cerrarFormulario();
    limpiar();
    pagoSeleccionado.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }finally {
    loading.value = false;
    loadingList.value = null;
  }
};



function editar(pago) {
  if (pago.estado !== 1) {
    Notify.create({
      type: 'warning',
      message: 'Para editar un pago debe estar activo',
      classes: 'customNotify',
      icon: 'warning',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black' }]

    });
    return;
  }
else{
  pagoSeleccionado.value = pago
  tituloFormulario.value = 'Editar Pago'
 
  idcliente.value =pago.idcliente.nombre;
  idplan.value = pago.idplan.descripcion;
  fechaVencimiento.value=formatDates(pago.fechaVencimiento);
  verFormulario.value = (true)
}
  

}

async function agregarPago()  {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
  pagoSeleccionado.value = null
  verFormulario.value = (true)
  tituloFormulario.value = 'Agregar PAgo'
  
    
  } 
  catch (error) {
    console.error('Error al agregar pago:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function activar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando activar pago con ID: ${id}`);
    const response = await usePagos.putPagosActivar(id);
    console.log('Respuesta de activación:', response);
    await listarpagos();
    Notify.create({
      type: 'positive',
      message: 'Pago activado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al activar Pago:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar Pago',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}

async function desactivar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando desactivar Pago con ID: ${id}`);
    const response = await usePagos.putPagosInactivar(id);
    console.log('Respuesta de desactivación:', response);
    await listarpagos();
    Notify.create({
      type: 'positive',
      message: 'Pago desactivado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al desactivar Pago:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar Pago',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}
function cerrarFormulario() {
  verFormulario.value = (false)
  pagoSeleccionado.value = null;
  limpiar()
}

function listar(tipo) {
  loading.value = true;
  loadingList.value = tipo;
  if (tipo === 'activos') {
    listarPagosActivos();
  } else if (tipo === 'inactivos') {
    listarPagosInactivos();
  } else {
    listarpagos();
  }
}
function limpiar() {

  idcliente.value = ("")
  idplan.value = ("")

}
const puntosMil = (num) => {
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return '';
};

const formatDates = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().substr(0,10);
};
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
