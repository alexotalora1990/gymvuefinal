<template>
  <div>
    <div class="q-pa-md">

      <div class="flex justify-end">

        <q-input filled label="Buscar por nombre"
          style="background-color:#d3d0d0; color: black; width: 30%; border-radius: 5px; margin-right: 1%;"
          v-model="nombreCliente" @keyup.enter="listarNombre">
          <template v-slot:append>
            <q-btn icon="search" @click="listarNombre" style="background-color:#ffff;" />
          </template>
        </q-input>



        <q-btn color="green" icon="add" @click="abrir()"
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
            <h5 class="form-title">{{ accion == 1 ? "Crear Cliente" : "Editar Cliente"}}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />

          </div>


          <q-form class="q-gutter-md" @submit.prevent="procesar">
            <q-input filled v-model="nombre" label="Nombre" :rules="[
              val => !!val || 'Nombre no puede estar vacío',
              val => /^[a-zA-Z ]+$/.test(val) || 'El nombre solo puede contener letras y espacios',
              val => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres'
            ]"  />

            <q-input filled v-model="documento" label="Documento" type="number" :rules="[
              val => !!val || 'Documento no puede estar vacío',
              val => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos'
            ]" />

            <q-input filled v-model="email" label="Email" type="email"
              :rules="[(val) => !!val || 'Email no debe estar vacío']" />

            <q-input filled v-model="direccion" label="Dirección" type="text"
              :rules="[(val) => !!val || 'Dirección no debe estar vacía']" />

            <q-input filled v-model="telefono" label="Teléfono" type="number" :rules="[
              val => !!val || 'Teléfono no puede estar vacío',
              val => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos',
              val => !/\s/.test(val) || 'Telefono no puede contener espacios vacíos'
            ]" />

            <q-input filled v-model="fechaNacimiento" label="Fecha de Nacimiento" type="date"
              input="validateDateOfBirth" :rules="[
                val => !!val || 'Fecha de nacimiento no debe estar vacía',
                val => isOverFourteen(val) || 'Debe ser mayor de 14 años'
              ]" />

            <q-select filled v-model="idplanes" label="Seleccione un plan" :options="planOptions" @filter="filterFn"
              :rules="[val => !!val || 'Debe seleccionar un plan']" />

            <q-input filled v-model="foto" label="Link Foto" type="text"
              :rules="[(val) => !!val || 'Foto no debe estar vacía']" />

            <q-input filled v-model="objetivo" label="Objetivo" type="textarea"
              :rules="[(val) => !!val || 'Objetivo no debe estar vacío']" />

            <q-input filled v-model="observaciones" label="Observaciones" type="textarea"
              :rules="[(val) => !!val || 'Observaciones no deben estar vacías']" />



            <div class="q-mt-md q-flex q-justify-end">
              <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
              <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm"
                :loading="loading && loadingList === 'guardar'" />
            </div>
          </q-form>
        </q-page>
      </div>




      <div class="form-container q-pa-md q-mx-auto" v-show="verFormularioSeguimiento">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
          <div class="q-flex q-justify-between q-items-center form-header">
            <h5  class="form-title">{{ accionSeguimiento == 1 ? "Crear Seguimiento" : "Editar Seguimiento"}}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormularioSeguimiento" class="close-btn" />
          </div>

          <q-form class="q-gutter-md">
            <q-input filled v-model="fecha" label="Fecha" type="date"
              :rules="[(val) => !!val || 'Fecha no puede estar vacía']" />
            <q-input filled v-model="peso" label="Peso" type="number"
              :rules="[(val) => val > 0 || 'Peso debe ser un número positivo']" />
            <q-input filled v-model="tBrazo" label="Talla de Brazo" type="number"
              :rules="[(val) => val > 0 || 'Talla de Brazo debe ser un número positivo']" />
            <q-input filled v-model="tPierna" label="Talla de Pierna" type="number"
              :rules="[(val) => val > 0 || 'Talla de Pierna debe ser un número positivo']" />
            <q-input filled v-model="tCintura" label="Talla de Cintura" type="number"
              :rules="[(val) => val > 0 || 'Talla de Cintura debe ser un número positivo']" />
            <q-input filled v-model="estatura" label="Estatura en centimetros ej.(180)" type="number"
              :rules="[(val) => val > 0 || 'Estatura debe ser un número positivo']" />

            <div class="q-mt-md">
              <q-btn label="Guardar" color="green" type="submit" @click="accionSeguimiento === 1 ? agregarSeguimiento() :editarSeguimiento()" />
              <q-tooltip class="bg-accent">Guardar</q-tooltip>
            </div>
          </q-form>
        </q-page>
      </div>
      <div v-if="loading" class="overlay">
        <q-spinner-hourglass color="primary" size="50px" />

      </div>

      <q-table title="Clientes" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
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
            <q-btn @click="traer(props.row)">✍
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

        <template v-slot:body-cell-seguimiento="props">
          <q-td :props="props">
            <q-btn @click="abrirSeguimiento(props.row._id)">➕
              <q-tooltip class="bg-accent">Agregar Seguimiento</q-tooltip>
            </q-btn>
            <q-btn @click="verSeguimiento(props.row)">👁️
              <q-tooltip class="bg-accent">Ver Seguimiento</q-tooltip>
            </q-btn>


          </q-td>
        </template>


      </q-table>
      <div v-if="clienteSeleccionado" class="seguimiento">

        <div class="q-flex q-justify-between q-items-center form-header">
          <h5 class="seg-title">Seguimiento de {{ clienteSeleccionado.nombre }}</h5>
          <q-btn flat icon="close" color="white" @click="cerrarSeguimiento" class="close-btn" />
        </div>


       
        <q-table :rows="selectedClienteSeguimiento" :columns="columnsSeguimiento" row-key="fecha" class="table">
          <template v-slot:body-cell-opciones="props">
    <q-td :props="props">
        <q-btn icon="edit" @click="mostrarSeguimiento(props.row, clienteSeleccionado)" />
    </q-td>
</template>
  <template #body-cell-IMC="props">
    <q-td :props="props" :style="{ backgroundColor: getIMCColor(props.row.IMC).color }">
      {{ props.row.IMC.toFixed(2) }} - {{ getIMCColor(props.row.IMC).description }}
    </q-td>
  </template>
</q-table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useClientesStore } from '../store/clientes.js';
import { usePlanesStore } from "../store/planes.js"
import axios from 'axios';
import { useQuasar, Notify } from 'quasar';
import { mdiNull } from '@quasar/extras/mdi-v5';

const useClientes = useClientesStore();
const usePlanes = usePlanesStore()
let id = ref("")
const verFormulario = ref(false);

const clienteSeleccionado = ref(null);
const nombre = ref('');
const documento = ref('');
const email = ref('');
const direccion = ref('');
const telefono = ref('');
const fechaNacimiento = ref('');
const idPlan = ref('');
const idplanes=ref('')
const foto = ref('');
const objetivo = ref('');
const observaciones = ref('');


const nombreCliente = ref('')
let datos={}
let planes =[]
const planOptions = ref(planes)
let accion = ref(1);
let accionSeguimiento=ref(1)
const fecha = ref('');
const peso = ref('');
const tBrazo = ref('');
const tPierna = ref('');
const tCintura = ref('');
const estatura = ref('');
const clienteId=ref(null)
const clienteId1= ref(mdiNull)
const segumientoid =ref (null)


const rows = ref([]);


const verFormularioSeguimiento = ref(false);
const selectedClienteSeguimiento = ref([]);
const clienteSeleccionado1 = ref(null);
const rowsSeguimiento = ref([])
const isEditing = ref(false);
const seguimientoSeleccionado = ref(null);
const idseguimiento =ref(null)

const loading = ref(false);
const loadingList = ref(null);

const validateDateOfBirth = () => {
  if (!fechaNacimiento.value) return;

  const today = new Date();
  const birthDate = new Date(fechaNacimiento.value);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 14) {
    fechaNacimiento.value = '';
    $q.notify({
      type: 'negative',
      message: 'Debe ser mayor de 14 años'
    });
  }
};

const isOverFourteen = (val) => {
  if (!val) return false;

  const today = new Date();
  const birthDate = new Date(val);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age;
  }

  return age >= 14;
};
const columns = ref([
  { name: "nombre", label: "Nombre Usuario", field: "nombre", align: "center" },
  { name: "documento", label: "Número Documento", field: "documento", align: "center" },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "direccion", label: "Dirección", field: "direccion", align: "center" },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "center" },
  { name: "fechaNacimiento", label: "Fecha Nacimiento", field: "fechaNacimiento", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  // { name: "idPlan", label: "Tipo de Plan", field:(row)=>row.idPlan?.descripcion, align: "center" },

  { name: "objetivo", label: "Objetivo", field: "objetivo", align: "center" },
  { name: "observaciones", label: "Observaciones", field: "observaciones", align: "center" },

  { name: "seguimiento", label: "Seguimiento", field: "seguimiento", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);


const columnsSeguimiento = ref([
  { name: "fecha", label: "Fecha", field: "fecha", align: "center" },
  { name: "IMC", label: "IMC", field: "IMC", align: "center" },
  { name: "estatura", label: "Estatura", field: "estatura", align: "center" },
  { name: "peso", label: "Peso", field: "peso", align: "center" },
  { name: "tBrazo", label: "Tamaño Brazo", field: "tBrazo", align: "center" },
  { name: "tCintura", label: "Tamaño Cintura", field: "tCintura", align: "center" },
  { name: "tPierna", label: "Tamaño Pierna", field: "tPierna", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);
const loadingState = ref({});


function getIMCColor(IMC) {
  if (IMC < 18.5) {
    return { color: 'blue', description: 'peso insuficiente' };
  } else if (IMC >= 18.5 && IMC <= 24.9) {
    return { color: 'green', description: 'saludable' };
  } else if (IMC >= 25 && IMC <= 29.9) {
    return { color: 'orange', description: 'sobrepeso' };
  } else if (IMC >= 30 && IMC <= 34.9) {
    return { color: 'darkorange', description: 'obesidad' };
  } else if (IMC >= 35 && IMC <= 39.9) {
    return { color: 'lightcoral', description: 'obesidad' };
  } else {
    return { color: 'red', description: 'obesidad extrema' };
  }
}


function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function listarClientes() {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useClientes.getCliente();
    const clientes = r.data.Cliente;
    rows.value = clientes.map(cliente => ({
      ...cliente,
      fechaNacimiento: formatDate(cliente.fechaNacimiento),
      fechaVencimiento: formatDate(cliente.fechaVencimiento),
    }));
    console.log(r.data.Cliente);
  } catch (error) {
    console.error('Error al listar todos los clientes:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarPlanes() {
  try {
    const r = await usePlanes.getPlanesActivos();
    r.data.planActivo.forEach(item => {
      datos={
        label:item.descripcion,
        value:item._id
      }
      planes.push(datos)
    });
    console.log(planes);  
    


  } catch (error) {
    console.error("Error al obtener los planes:", error);
  }
}

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    planOptions.value = planes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}



async function listarClientesActivos() {
  loading.value = true;
  loadingList.value = 'activos';
  try {
    const r = await useClientes.getClientesActivos();
    console.log(r.data.clientesActivos);
    rows.value = r.data.clientesActivos;
  } catch (error) {
    console.error('Error al listar clientes activos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarClientesInactivos() {
  loading.value = true;
  loadingList.value = 'inactivos';
  try {
    const r = await useClientes.getClientesInactivos();
    console.log(r.data.clientesInactivos);
    rows.value = r.data.clientesInactivos;
  } catch (error) {
    console.error('Error al listar clientes inactivos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

function listar(tipo) {
  loading.value = true;
  loadingList.value = tipo;
  if (tipo === 'activos') {
    listarClientesActivos();
  } else if (tipo === 'inactivos') {
    listarClientesInactivos();
  } else {
    listarClientes();
  }
}

async function listarNombre() {
  if (!nombreCliente.value || nombreCliente.value.trim() === "") {
    Notify.create({
      type: 'negative',
      message: 'Digite el nombre de un Cliente'
    });
    return;
  }

  try {
    const r = await useClientes.getCliente()
    console.log(r.data.Cliente);
    if (!r.data || !r.data.Cliente) {
      throw new Error('No se encontraron clientes en la respuesta');
    }

    const clienteFiltrado = r.data.Cliente.filter(cliente =>
      cliente.nombre && cliente.nombre.toLowerCase().includes(nombreCliente.value.toLowerCase())
    );

    if (clienteFiltrado.length === 0) {
      Notify.create({
        type: 'negative', 
        message: 'Cliente no existe'
      });
    } else {
      rows.value = clienteFiltrado;
    }
  } catch (error) {
    console.error('Error al listar nombre:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al listar clientes'
    });
  } finally {
    nombreCliente.value = "";
  }
}



onMounted(() => {
  listarClientes();
  listarPlanes();

});

async function agregar() {
    loading.value = true;
    loadingList.value = 'agregar';

    try {
        
        const cliente = await useClientes.postClientes({
            idplanes: idPlan.value.value,
            nombre: nombre.value,
            documento: documento.value,
            email: email.value,
            direccion: direccion.value,
            telefono: telefono.value,
            fechaNacimiento:fechaNacimiento.value,
            foto: foto.value,
            objetivo: objetivo.value,
            observaciones: observaciones.value,
        });

        Notify.create({
            type: "positive",
            message: "Cliente creado exitosamente",
            icon: "check_circle",
            position: "top",
        });

        listar();
        limpiar();
        verFormulario.value = false;
        return cliente;

    } catch (error) {
        console.error("Error al agregar cliente:", error);
        Notify.create({
            type: "negative",
            message: error.response?.data?.errors?.[0]?.msg || "Error al agregar cliente",
            icon: "error",
        });
    } finally {
        loading.value = false;
        loadingList.value = null;
    }
}

async function traer(cliente) {
  verFormulario.value=true;
  accion.value=2;
  idplanes.value={
    label:cliente.idPlan.descripcion,
    value:cliente.idPlan_id
  }
  id.value=cliente._id,
  nombre.value=cliente.nombre,
  telefono.value=cliente.telefono,
  email.value=cliente.email,
  documento.value=cliente.documento,
  direccion.value=cliente.direccion,
  fechaNacimiento.value=cliente.fechaNacimiento,
 
  foto.value=cliente.foto,
  observaciones.value=cliente.observaciones,
  objetivo.value=cliente.objetivo
  
}

async function editar() {
    try {
        

        await useClientes.putClientes(id.value, {
            idPlan: idplanes.value.value,
            nombre: nombre.value,
            telefono: telefono.value,
            email: email.value,
            documento: documento.value,
            direccion: direccion.value,
            fechaNacimiento: fechaNacimiento.value,
            observaciones: observaciones.value,
            objetivo: objetivo.value
        });

        Notify.create({
            message: 'Cliente actualizado correctamente!',
            position: "top",
            color: "green"
        });

    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el cliente',
        });
        console.log('Error al modificar el cliente', error);
    } finally {
        listarClientes();
        limpiar();
        verFormulario.value = false;
    }
}
function abrir() {
    verFormulario.value = true;
    limpiar();
    accion.value = 1;
}

function procesar(){
    if(accion.value===1){
        agregar()
    } else{
        editar()
    }
}




async function activar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando activar cliente con ID: ${id}`);
    const response = await useClientes.putClientesActivar(id);
    console.log('Respuesta de activación:', response);
    await listarClientes();
    Notify.create({
      type: 'positive',
      message: 'Cliente activado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al activar Cliente:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar cliente',
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
    const response = await useClientes.putClientesDesactivar(id);
    console.log('Respuesta de desactivación:', response);
    await listarClientes();
    Notify.create({
      type: 'positive',
      message: 'Cliente desactivado exitosamente',
      icon: 'check',
    });
  } catch (error) {
    console.error('Error al desactivar cliente:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar cliente',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
}


function cerrarFormulario() {
  verFormulario.value = false;
  clienteSeleccionado.value = null;
  limpiar();
}

function limpiar() {
  nombre.value = "";
  documento.value = "";
  email.value = "";
  direccion.value = "";
  telefono.value = "";
  fechaNacimiento.value = "";
  idPlan.value = "";
  foto.value = "";
  objetivo.value = "";
  observaciones.value = "";
 
}






// seguimiento
function verSeguimiento(cliente) {
    
    clienteSeleccionado.value = cliente;
    selectedClienteSeguimiento.value = cliente.seguimiento.map(seg => ({
        ...seg,
        fecha: formatDate(seg.fecha),
        createAt: formatDate(seg.createAt),
    }));
}



function abrirSeguimiento(clienteId) {
 clienteId1.value=clienteId
  console.log("Cliente ID:", clienteId);
    verFormularioSeguimiento.value = true;
    limpiarFormularioSeguimiento();
    accionSeguimiento.value = 1;
}

async function agregarSeguimiento() {
 
 
  
    loading.value = true;
    loadingList.value = 'agregar';
    verFormularioSeguimiento.value = true;
let seguimiento ={
  fecha: fecha.value,
            peso: peso.value,
            tBrazo: tBrazo.value,
            tPierna: tPierna.value,
            tCintura: tCintura.value,
            estatura: estatura.value,
}
console.log(seguimiento);
    try {
        const cliente = await useClientes.postSeguimiento(clienteId1.value,seguimiento);
        console.log("Cliente ID:", clienteId1.value);

        Notify.create({
            type: "positive",
            message: "Seguimiento creado exitosamente",
            icon: "check_circle",
            position: "top",
        });

        
        limpiarFormularioSeguimiento();
        verFormularioSeguimiento.value= false
       listarClientes()

        return cliente;

    } catch (error) {
        console.error("Error al agregar cliente:", error);
        Notify.create({
            type: "negative",
            message: "Error al agregar cliente",
            icon: "error",
        });
    } finally {
        loading.value = false;
    }
}

function mostrarSeguimiento(seguimiento, cliente) {

  console.log(seguimiento);
console.log(cliente);

  
  peso.value = seguimiento.peso;
fecha.value=formatDate(seguimiento.fecha)
  tBrazo.value = seguimiento.tBrazo;
  tCintura.value = seguimiento.tCintura;
  tPierna.value = seguimiento.tPierna;
  estatura.value = seguimiento.estatura;

  clienteId.value = cliente._id;
 seguimientoSeleccionado.value = seguimiento._id;

  verFormularioSeguimiento.value=true;
  accionSeguimiento.value = 2;
}

async function editarSeguimiento() {
  loading.value = true;

  try {
    let seguimiento ={
             fecha: fecha.value,
            peso: peso.value,
            tBrazo: tBrazo.value,
            tPierna: tPierna.value,
            tCintura: tCintura.value,
            estatura: estatura.value,
}

    await useClientes.putSeguimiento(
      clienteId.value,
      seguimientoSeleccionado.value,
      seguimiento
    );



    Notify.create({
            type: "positive",
            message: "Seguimiento editado exitosamente",
            icon: "check_circle",
            position: "top",
        });

    cerrarSeguimiento();
   listarClientes()
    limpiarFormularioSeguimiento()
    verFormularioSeguimiento.value= false
  
  } catch (error) {
    console.error("Error al actualizar seguimiento:", error);
  } finally {
    loading.value=false;
}
}


function limpiarFormularioSeguimiento() {
  fecha.value = '';
  peso.value = '';
  tBrazo.value = '';
  tPierna.value = '';
  tCintura.value = '';
  estatura.value = '';
}



function cerrarSeguimiento() {
  clienteSeleccionado.value = false
}
function cerrarFormularioSeguimiento() {
  verFormularioSeguimiento.value = false;
}

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
