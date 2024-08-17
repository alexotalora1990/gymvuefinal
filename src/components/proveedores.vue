<template>
  <div>
    <div class="q-pa-md">

      <div class="flex justify-end">

        <q-input filled label="Buscar por nombre"
          style="background-color:#d3d0d0; color: black; width: 30%; border-radius: 5px; margin-right: 1%;"
          v-model="nombreProveedor" @keyup.enter="listarNombre">
          <template v-slot:append>
            <q-btn icon="search" @click="listarNombre" style="background-color:#ffff;" />
          </template>
        </q-input>
        <q-btn color="green" icon="add" @click="agregar()"
          :loading="loading && loadingList === 'agregar'">agregar</q-btn>

        <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
          <q-list>
            <q-item clickable v-ripple @click="listar('todos')"
              :class="{ 'loading-item': loading && loadingList === 'todos' }">
              <q-item-section>Listar Todos</q-item-section>
              <template v-if="loading && loadingList === 'todos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>

            <q-item clickable v-ripple @click="listar('activos')"
              :class="{ 'loading-item': loading && loadingList === 'activos' }">

              <q-item-section>Listar Activos</q-item-section>
              <template v-if="loading && loadingList === 'activos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>
            <q-item clickable v-ripple @click="listar('inactivos')"
              :class="{ 'loading-item': loading && loadingList === 'inactivos' }">
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
            <q-input filled v-model="nombre" label="Nombre" :rules="[
              val => !!val || 'Nombre no puede estar vacío',
              val => /^[a-zA-Z ]+$/.test(val) || 'El nombre solo puede contener letras y espacios',
              val => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres'
            ]" />

            <q-input filled v-model="documento" label="Documento" type="number" :rules="[
              val => !!val || 'Documento no puede estar vacío',
              val => /^[0-9]{5,12}$/.test(val) || 'Documento debe tener entre 5 y 12 dígitos'
            ]" />

            <q-input filled v-model="correo" label="Email" type="email"
              :rules="[(val) => !!val.trim() || 'Email no debe estar vacío']" />

            <q-input filled v-model="direccion" label="Dirección" type="text"
              :rules="[(val) => !!val.trim() || 'Dirección no debe estar vacía']" />

            <q-input filled v-model="telefono" label="Teléfono" type="phone" :rules="[
              val => !!val || 'Teléfono no puede estar vacío',
              val => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos',
              val => !/\s/.test(val) || 'Telefono no puede contener espacios vacíos'
            ]" />

            <div class="q-mt-md q-flex q-justify-end">
              <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
              <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm"
                :loading="loading && loadingList === 'guardar'" />
            </div>
          </q-form>
        </q-page>
      </div>
      </div>
      <div v-if="loading" class="overlay">
        <q-spinner-hourglass color="primary" size="50px" />

      </div>

      <q-table title="Proveedores" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px; " class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table2">{{ col.label }}</q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">{{ props.row.estado === 1 ? 'Activo' :
              'Inactivo' }}</p>
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">✍
              <q-tooltip class="bg-accent">Editar</q-tooltip>
            </q-btn>

            <q-btn :loading="loadingState[props.row._id]" v-if="props.row.estado === 1"
              @click="desactivar(props.row._id)">
              ❌
              <q-tooltip class="bg-accent">Desactivar</q-tooltip>
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>

            <q-btn :loading="loadingState[props.row._id]" v-else @click="activar(props.row._id)">
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
    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProveedorStore } from '../store/proveedor.js';
import axios from 'axios';
import { useQuasar,Notify } from 'quasar';

const useProveedor = useProveedorStore();
  
const verFormulario = ref(false);
const proveedorSeleccionado = ref(null);
const tituloFormulario = ref("Agregar Proveedor");
const nombre = ref('');
const documento = ref('');
const correo = ref('');
const direccion = ref('');
const telefono = ref('');

const nombreProveedor = ref('')


const isEditing = ref(false);

const rows = ref([]);




const loading = ref(false);
const loadingList = ref(null);

const columns = ref([
  { name: "nombre", label: "Nombre Usuario", field: "nombre", align: "center" },
  { name: "documento", label: "Número Documento", field: "documento", align: "center" },
  { name: "correo", label: "Email", field: "correo", align: "center" },
  { name: "direccion", label: "Dirección", field: "direccion", align: "center" },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const loadingState = ref({});



async function listarProveedores() {
loading.value = true;
loadingList.value = 'todos';
try {
  const r = await useProveedor.getProveedor();
  rows.value = r.data.proveedor;
  console.log(r.data.proveedor);
} catch (error) {
  console.error('Error al listar todos los Proveedores:', error);
} finally {
  loading.value = false;
  loadingList.value = null;
}
}




async function listarProveedoresActivos() {
  loading.value = true;
  loadingList.value = 'activos';
  try {
    const r = await useProveedor.getProveedoresActivos();
    console.log(r.data.proveedorActivo);
    rows.value = r.data.proveedorActivo;
  } catch (error) {
    console.error('Error al listar Proveedores activos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarProveedoresInactivos() {
  loading.value = true;
  loadingList.value = 'inactivos';
  try {
    const r = await useProveedor.getProveedoresInactivos();
    console.log(r.data.proveedorInactivo);
    rows.value = r.data.proveedorInactivo;
  } catch (error) {
    console.error('Error al listar Proveedores inactivos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

function listar(tipo) {
  loading.value = true;
  loadingList.value = tipo;
  if (tipo === 'activos') {
    listarProveedoresActivos();
  } else if (tipo === 'inactivos') {
    listarProveedoresInactivos();
  } else {
    listarProveedores();
  }
}

async function listarNombre() {
  if (!nombreProveedor.value || nombreProveedor.value.trim() === "") {
    Notify.create({
      type: 'negative',
      message: 'Digite el nombre de un Proveedor'
    });
    return;
  }

  try {
    const r = await useProveedor.getProveedor()
    console.log(r.data.proveedor);
    if (!r.data || !r.data.proveedor) {
      throw new Error('No se encontraron Proveedores en la respuesta');
    }

    const proveedorFiltrado = r.data.proveedor.filter(Proveedor =>
    Proveedor.nombre && Proveedor.nombre.toLowerCase().includes(nombreProveedor.value.toLowerCase())
    );

    if (proveedorFiltrado.length === 0) {
      Notify.create({
        type: 'negative',
        message: 'Proveedor no existe'
      });
    } else {
      rows.value = proveedorFiltrado;
    }
  } catch (error) {
    console.error('Error al listar nombre:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al listar Proveedores'
    });
  } finally {
    nombreProveedor.value = "";
  }
}



onMounted(() => {
  listarProveedores();
  

});

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
  try {
    if (proveedorSeleccionado.value !== null) {
      await useProveedor.putProveedores(proveedorSeleccionado.value._id, {
        nombre: nombre.value,
        documento: documento.value,
        correo: correo.value,
        direccion: direccion.value,
        telefono: telefono.value,
       
      });
      Notify.create({
        type: 'positive',
        message: 'Proveedor editado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {
      await useProveedor.postProveedor({
        nombre: nombre.value,
        documento: documento.value,
        correo: correo.value,
        direccion: direccion.value,
        telefono: telefono.value,
        
      });
      Notify.create({
        type: 'positive',
        message: 'Proveedor agregado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    }

    listarProveedores();
    cerrarFormulario();
    limpiar();
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};

async function editar(proveedor) {
  proveedorSeleccionado.value = proveedor;
  tituloFormulario.value = "Editar Proveedor";

  nombre.value = proveedor.nombre;
  documento.value = proveedor.documento;
  correo.value = proveedor.correo;
  direccion.value = proveedor.direccion;
  telefono.value = proveedor.telefono;
  verFormulario.value = true;
}


async function agregar() {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
      proveedorSeleccionado.value = null;
    verFormulario.value = true;
    tituloFormulario.value = "Agregar proveedor";

  }
  catch (error) {
    console.error('Error al agregar proveedor:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}


async function activar(id) {
  loadingState.value[id] = true;
  try {
        const response = await useProveedor.putProveedoresActivar(id);
    console.log('Respuesta de activación:', response);
     listarProveedores();
    Notify.create({
      type: 'positive',
      message: 'Proveedor activado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al activar Proveedor:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar Proveedor',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}

async function desactivar(id) {
  loadingState.value[id] = true;
  try {
    
    const response = await useProveedor.putProveedoresDesactivar(id);
    console.log('Respuesta de desactivación:', response);
    await listarProveedores();
    Notify.create({
      type: 'positive',
      message: 'Proveedor desactivado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al desactivar Proveedor:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar Proveedor',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}


function cerrarFormulario() {
  verFormulario.value = false;
  proveedorSeleccionado.value = null;
  limpiar();
}

function limpiar() {
  nombre.value = "";
  documento.value = "";
  correo.value = "";
  direccion.value = "";
  telefono.value = "";
 
}

//   onMounted(() => {
//     listarProveedores();
  

//   });

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

.form-title2 {
  color: white;
  margin: 0;
  text-align: center;
  font-weight: bold;
  margin-left: 5%;
}

.close-btn {
  color: white;
}

.seg-title {
  color: white;
  margin: 0;
  text-align: center;
  font-weight: bold;

  margin-left: 15%;
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


