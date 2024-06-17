<template>
  <div>
    <div class="q-pa-md">

      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregar()">agregar</q-btn>
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
            <div class="cerrar"><q-btn label="❌" color="red" outline @click="cerrarFormulario" /></div>

            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">
              {{ tituloFormulario }}
            </h5>
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
            <q-input filled v-model="nombre" label="Nombre" :rules="[
          val => !!val || 'Nombre no puede estar vacío',
          val => /^[a-zA-Z ]+$/.test(val) || 'El nombre solo puede contener letras y espacios',
          val => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres'
        ]" />

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

            <q-select filled v-model="idPlan" label="Seleccione un plan" :options="planOptions"
              :rules="[val => !!val || 'Debe seleccionar un plan']" />

            <q-input filled v-model="foto" label="Link Foto" type="text"
              :rules="[(val) => !!val || 'Foto no debe estar vacía']" />

            <q-input filled v-model="objetivo" label="Objetivo" type="textarea"
              :rules="[(val) => !!val || 'Objetivo no debe estar vacío']" />

            <q-input filled v-model="observaciones" label="Observaciones" type="textarea"
              :rules="[(val) => !!val || 'Observaciones no deben estar vacías']" />

            <q-input filled v-model="fechaVencimiento" label="Fecha de Vencimiento" type="date" @input="validateDate"
              :rules="[
          val => !!val || 'Fecha de vencimiento no debe estar vacía',
          val => new Date(val) > new Date() || 'La fecha de vencimiento debe ser mayor a la fecha actual'
        ]" />

            <div class="cerrar">
              <q-btn label="Guardar" color="green" type="submit" />
              <q-tooltip class="bg-accent">Guardar</q-tooltip>

              <q-btn label="Cerrar" color="red" outline @click="cerrarFormulario" />
              <q-tooltip class="bg-accent">Cerrar</q-tooltip>

            </div>
          </q-form>
        </q-page>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormularioSeguimiento">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
          <div class="q-flex q-justify-between q-items-center">
            <div class="cerrar"><q-btn label="❌" color="red" outline @click="cerrarFormularioSeguimiento" /></div>
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">
              {{ tituloFormularioSeguimiento }}
            </h5>

          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarSeguimiento">

            <q-input filled v-model="fecha" label="Fecha" type="text"
              :rules="[(val) => !!val || 'Fecha no puede estar vacía']" />

            <q-input filled v-model="peso" label="Peso" type="number"
              :rules="[(val) => val > 0 || 'Peso debe ser un número positivo']" />



            <q-input filled v-model="tBrazo" label="Talla de Brazo" type="number"
              :rules="[(val) => val > 0 || 'Talla de Brazo debe ser un número positivo']" />

            <q-input filled v-model="tPierna" label="Talla de Pierna" type="number"
              :rules="[(val) => val > 0 || 'Talla de Pierna debe ser un número positivo']" />

            <q-input filled v-model="tCintura" label="Talla de Cintura" type="number"
              :rules="[(val) => val > 0 || 'Talla de Cintura debe ser un número positivo']" />

            <q-input filled v-model="estatura" label="Estatura" type="number"
              :rules="[(val) => val > 0 || 'Estatura debe ser un número positivo']" />

            <div class="cerrar">

              <q-btn icon="edit" @click="editarSeguimiento" class="q-ml-md" />
              <q-tooltip class="bg-accent">Editar</q-tooltip>
              <q-btn label="Cerrar" color="red" outline @click="cerrarFormularioSeguimiento" />
              <q-tooltip class="bg-accent">Cerrar</q-tooltip>
              <q-btn label="Guardar" color="green" @click="agregarSeguimiento(clienteSeleccionado.value)" />
              <q-tooltip class="bg-accent">Guardar</q-tooltip>
            </div>
          </q-form>
        </q-page>
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
            <q-btn @click="editar(props.row)"> ✍
              <q-tooltip class="bg-accent">Editar</q-tooltip> </q-btn>

            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row._id)">❌
              <q-tooltip class="bg-accent">Desactivar</q-tooltip></q-btn>

            <q-btn v-else @click="activar(props.row._id)">✅
              <q-tooltip class="bg-accent">Activar</q-tooltip>
            </q-btn>



          </q-td>
        </template>
        <template v-slot:body-cell-seguimiento="props">
          <q-td :props="props">
            <q-btn @click="agregarSeguimiento(props.row)">➕
              <q-tooltip class="bg-accent">Agregar Seguimiento</q-tooltip>
            </q-btn>
            <q-btn @click="verSeguimiento(props.row)">💫
              <q-tooltip class="bg-accent">Ver Seguimiento</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <div v-if="clienteSeleccionado" class="seguimiento">
        <div class="cerrar"><q-btn label="❌" color="red" outline @click="cerrarSeguimiento" /></div>
        <h3 class="seguimiento-title">Seguimiento de {{ clienteSeleccionado.nombre }}</h3>

        <q-table :rows="selectedClienteSeguimiento" :columns="columnsSeguimiento" row-key="fecha" class="table">
          <template #body-cell-IMC="props">
            <q-td :props="props">
              {{ props.row.IMC.toFixed(2) }}
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

const useClientes = useClientesStore();
const usePlanes = usePlanesStore()


const verFormulario = ref(false);
const verFormularioSeguimiento = ref(false);
const clienteSeleccionado = ref(null);
const tituloFormulario = ref("Agregar Cliente");
const tituloFormularioSeguimiento = ref("Agregar Seguimiento");
const nombre = ref('');
const documento = ref('');
const email = ref('');
const direccion = ref('');
const telefono = ref('');
const fechaNacimiento = ref('');
const idPlan = ref('');
const foto = ref('');
const objetivo = ref('');
const observaciones = ref('');
const fechaVencimiento = ref('');

const planOptions = ref([])

const fecha = ref('');
const peso = ref('');

const tBrazo = ref('');
const tPierna = ref('');
const tCintura = ref('');
const estatura = ref('');

const rowsSeguimiento = ref([])
const rows = ref([]);
const selectedClienteSeguimiento = ref([]);
const clienteSeleccionado1 = ref(null);


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
    fechaNacimiento.value = ''; // Reset the value if age is less than 14
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
    age--;
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
  { name: "plan", label: "Tipo de Plan", field: "plan", align: "center" },

  { name: "objetivo", label: "Objetivo", field: "objetivo", align: "center" },
  { name: "observaciones", label: "Observaciones", field: "observaciones", align: "center" },
  { name: "fechaVencimiento", label: "Fecha Vencimiento", field: "fechaVencimiento", align: "center" },
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
]);


function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function listarClientes() {
  const r = await useClientes.getCliente();
  const clientes = r.data.Cliente;

  rows.value = clientes.map(cliente => ({
    ...cliente,
    fechaNacimiento: formatDate(cliente.fechaNacimiento),
    fechaVencimiento: formatDate(cliente.fechaVencimiento),
  }));

  console.log(rows.value);
}

async function listarPlanes() {
  try {
    const r = await usePlanes.getPlanes();
    if (r && r.data.plan) {
      planOptions.value = r.data.plan.map(idplan => ({
        label: idplan.descripcion,
        value: idplan._id
      }));
      console.log(planOptions.value); // Mostrar contenido real del array
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.plan);
    }
  } catch (error) {
    console.error("Error al obtener los planes:", error);
  }
}




function verSeguimiento(cliente) {
  clienteSeleccionado.value = cliente;
  selectedClienteSeguimiento.value = cliente.seguimiento.map(seg => ({
    ...seg,
    fecha: formatDate(seg.fecha),
    createAt: formatDate(seg.createAt),
  }));
}

function cerrarSeguimiento() {
  clienteSeleccionado.value = false
}




async function listarClientesActivos() {
  const r = await useClientes.getClientesActivos();
  console.log(r.data.clientesActivos);
  rows.value = r.data.clientesActivos;
}

async function listarClientesInactivos() {
  const r = await useClientes.getClientesInactivos();
  console.log(r.data.clientesInactivos);
  rows.value = r.data.clientesInactivos;
}

function listar(tipo) {
  if (tipo === 'activos') {
    listarClientesActivos();
  } else if (tipo === 'inactivos') {
    listarClientesInactivos();
  } else {
    listarClientes();
  }
}



onMounted(() => {
  listarClientes();
  listarPlanes();

});

const procesarFormulario = async (option) => {
  try {
    console.log(idPlan.value);
    const idplanseleccionado=idPlan.value

    if (clienteSeleccionado.value !== null) {
      await useClientes.putClientes(clienteSeleccionado.value._id, {
        nombre: nombre.value,
        documento: documento.value,
        email: email.value,
        direccion: direccion.value,
        telefono: telefono.value,
        fechaNacimiento: fechaNacimiento.value,
        idPlan: idplanseleccionado.value,
        foto: foto.value,
        objetivo: objetivo.value,
        observaciones: observaciones.value,
        fechaVencimiento: fechaVencimiento.value,
      });
    } else {
      await useClientes.postClientes({
        nombre: nombre.value,
        documento: documento.value,
        email: email.value,
        direccion: direccion.value,
        telefono: telefono.value,
        fechaNacimiento: fechaNacimiento.value,
        idPlan: idplanseleccionado.value,
        foto: foto.value,
        objetivo: objetivo.value,
        observaciones: observaciones.value,
        fechaVencimiento: fechaVencimiento.value,
      });
    }

    listarClientes();
    cerrarFormulario();
    limpiar();
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
  }
};

async function editar(cliente) {
  clienteSeleccionado.value = cliente;
  tituloFormulario.value = "Editar Cliente";

  nombre.value = cliente.nombre;
  documento.value = cliente.documento;
  email.value = cliente.email;
  direccion.value = cliente.direccion;
  telefono.value = cliente.telefono;
  fechaNacimiento.value = cliente.fechaNacimiento;
  idPlan.value = cliente.idPlan;
  foto.value = cliente.foto;
  objetivo.value = cliente.objetivo;
  observaciones.value = cliente.observaciones;
  fechaVencimiento.value = cliente.fechaVencimiento;

  verFormulario.value = true;
}

async function agregar() {
  clienteSeleccionado.value = null;
  verFormulario.value = true;
  tituloFormulario.value = "Agregar Cliente";
}






const activar = async (id) => {
  await useClientes.putClientesActivar(id);
  listarClientes();
};

const desactivar = async (id) => {
  await useClientes.putClientesDesactivar(id);
  listarClientes();
};

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
  fechaVencimiento.value = "";
}

function cerrarFormularioSeguimiento() {
  verFormularioSeguimiento.value = false;
}

function editarSeguimiento() { }

async function agregarSeguimiento(cliente) {
  try {
    if (!cliente || !cliente.nombre) {
      throw new Error('El cliente seleccionado es inválido');
    }

    // Resto del código para agregar el seguimiento
    clienteSeleccionado.value = cliente;
    tituloFormularioSeguimiento.value = `Agregar Seguimiento para ${cliente.nombre}`;
    verFormularioSeguimiento.value = true;

  } catch (error) {
    console.error('Error al agregar seguimiento:', error);
    Notify.create({
      type: 'negative',
      message: error.message, // Mostrar el mensaje de error específico
      icon: 'error',
    });
  }
}





async function procesarSeguimiento(idCliente) {
  const seguimiento = {
    fecha: fecha.value,
    peso: peso.value,
    tBrazo: tBrazo.value,
    tPierna: tPierna.value,
    tCintura: tCintura.value,
    estatura: estatura.value,
  };

  try {
    // Llamada al backend para guardar el seguimiento
    const response = await useClientes.postSeguimiento(idCliente, seguimiento);

    // Verificar la respuesta del backend y mostrar notificación de éxito
    if (response && response.data && response.data.seguimiento) {
      Notify.create({
        type: 'positive',
        message: 'Seguimiento agregado exitosamente',
        icon: 'check_circle',
      });

     
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al agregar seguimiento',
        icon: 'error',
      });
    }

    // Cerrar el formulario de seguimiento después de procesar
    cerrarFormularioSeguimiento();
  } catch (error) {
    console.error('Error al procesar seguimiento:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al agregar seguimiento',
      icon: 'error',
    });
  }
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

.q-ml-md {
  color: aqua
}

.table-title {
  text-align: center;
  position: relative;
  z-index: 999;
}

.seguimiento-title {
  background-color: #f2650dab;
  padding: 10px;
  border-radius: 5px;
  color: white;
  text-align: center;

}

.seguimiento {
  padding: 1%;
  background-color: rgb(223, 233, 233, 0.600);
  margin-top: 1%;
  border-radius: 10px;
}

.table1 {
  background-color: #f2650d8f;
  color: white;
}

.table {
  background-color: rgba(255, 255, 255, 0.596);

}

.cerrar {
  text-align: right;
}
</style>
