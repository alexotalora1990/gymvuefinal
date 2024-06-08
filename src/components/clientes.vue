

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
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">
              {{ tituloFormulario }}
            </h5>
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
            <q-input
              filled
              v-model="nombre"
              label="Nombre"
              :rules="[(val) => !!val || 'Nombre no puede estar vacío']"
            />

            <q-input
              filled
              v-model="documento"
              label="Documento"
              type="number"
              :rules="[(val) => (val && val > 0) || 'Documento debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="email"
              label="Email"
              type="email"
              :rules="[(val) => !!val || 'Email no debe estar vacío']"
            />

            <q-input
              filled
              v-model="direccion"
              label="Dirección"
              type="text"
              :rules="[(val) => !!val || 'Dirección no debe estar vacía']"
            />

            <q-input
              filled
              v-model="telefono"
              label="Teléfono"
              type="number"
              :rules="[(val) => (val && val > 0) || 'Teléfono debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              :rules="[(val) => !!val || 'Fecha de nacimiento no debe estar vacía']"
            />

            <q-input
              filled
              v-model="idPlan"
              label="Id Plan"
              type="text"
              :rules="[(val) => !!val || 'Id Plan no debe estar vacío']"
            />

            <q-input
              filled
              v-model="foto"
              label="Link Foto"
              type="text"
              :rules="[(val) => !!val || 'Foto no debe estar vacía']"
            />

            <q-input
              filled
              v-model="objetivo"
              label="Objetivo"
              type="text"
              :rules="[(val) => !!val || 'Objetivo no debe estar vacío']"
            />

            <q-input
              filled
              v-model="observaciones"
              label="Observaciones"
              type="text"
              :rules="[(val) => !!val || 'Observaciones no deben estar vacías']"
            />

            <q-input
              filled
              v-model="fechaVencimiento"
              label="Fecha de Vencimiento"
              type="date"
              :rules="[(val) => !!val || 'Fecha de vencimiento no debe estar vacía']"
            />

            <div class="q-mt-md">
              <q-btn label="Guardar" color="green" type="submit" />
              <q-btn label="editar" color="green" type="submit" />
              <q-btn label="❌" color="red" outline @click="cerrarFormulario" />
              
            </div>
          </q-form>
        </q-page>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormularioSeguimiento">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
          <div class="q-flex q-justify-between q-items-center">
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">
              {{ tituloFormularioSeguimiento }}
            </h5>
            
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormularioSeguimiento">
            <q-input
              filled
              v-model="seguimiento.fecha"
              label="Fecha"
              type="date"
              :rules="[(val) => !!val || 'Fecha no puede estar vacía']"
            />

            <q-input
              filled
              v-model="seguimiento.peso"
              label="Peso"
              type="number"
              :rules="[(val) => val > 0 || 'Peso debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="seguimiento.IMC"
              label="IMC"
              type="number"
              :rules="[(val) => val > 0 || 'IMC debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="seguimiento.tBrazo"
              label="Talla de Brazo"
              type="number"
              :rules="[(val) => val > 0 || 'Talla de Brazo debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="seguimiento.tPierna"
              label="Talla de Pierna"
              type="number"
              :rules="[(val) => val > 0 || 'Talla de Pierna debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="seguimiento.tCintura"
              label="Talla de Cintura"
              type="number"
              :rules="[(val) => val > 0 || 'Talla de Cintura debe ser un número positivo']"
            />

            <q-input
              filled
              v-model="seguimiento.estatura"
              label="Estatura"
              type="number"
              :rules="[(val) => val > 0 || 'Estatura debe ser un número positivo']"
            />

            <div class="q-mt-md">
              <q-btn label="Guardar" color="green" type="submit" />
              <q-btn icon="edit" @click="editarSeguimiento" class="q-ml-md" />
              <q-btn label="❌" color="red" outline @click="cerrarFormularioSeguimiento" />
            </div>
          </q-form>
        </q-page>
      </div>

    
        <q-table title="Clientes" title-class="table-title" :rows="rows" :columns="columns" row-key="_id">
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
            <q-btn @click="editar(props.row)"> ✍ </q-btn>
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row._id)">❌</q-btn>
            <q-btn v-else @click="activar(props.row._id)">✅</q-btn>
            
            
          </q-td>
        </template>
        <template v-slot:body-cell-seguimiento="props">
          <q-td :props="props">
                        <q-btn @click="agregarSeguimiento(props.row)">➕ </q-btn>
                        <q-btn @click="verSeguimiento()">💫 </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useClientesStore } from '../store/clientes.js';
import axios from 'axios';
import { useQuasar,Notify } from 'quasar';

const useClientes = useClientesStore();

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

const seguimiento = ref({
  id: null,
  fecha: '',
  peso: 0,
  IMC: 0,
  tBrazo: 0,
  tPierna: 0,
  tCintura: 0,
  estatura: 0,
  createAt: new Date(),
});

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre Usuario", field: "nombre", align: "center" },
  { name: "documento", label: "Número Documento", field: "documento", align: "center" },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "direccion", label: "Dirección", field: "direccion", align: "center" },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "center" },
  { name: "fechaNacimiento", label: "Fecha Nacimiento", field: "fechaNacimiento", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "plan", label: "Tipo de Plan", field: "plan", align: "center" },
  { name: "foto", label: "Foto", field: "foto", align: "center" },
  { name: "objetivo", label: "Objetivo", field: "objetivo", align: "center" },
  { name: "observaciones", label: "Observaciones", field: "observaciones", align: "center" },
  { name: "fechaVencimiento", label: "Fecha Vencimiento", field: "fechaVencimiento", align: "center" },
  { name: "seguimiento", label: "Seguimiento", field: "seguimiento", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

async function listarClientes() {
  const r = await useClientes.getCliente();
  rows.value = r.data.Cliente;
  console.log(r.data.Cliente);
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
});

const procesarFormulario = async () => {
  try {
    if (clienteSeleccionado.value !== null) {
      await useClientes.putClientes(clienteSeleccionado.value._id, {
        nombre: nombre.value,
        documento: documento.value,
        email: email.value,
        direccion: direccion.value,
        telefono: telefono.value,
        fechaNacimiento: fechaNacimiento.value,
        idPlan: idPlan.value,
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
        idPlan: idPlan.value,
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

async function agregarSeguimiento(cliente) {
  clienteSeleccionado.value = cliente;
  tituloFormularioSeguimiento.value = `Agregar Seguimiento para ${cliente.nombre}`;
  verFormularioSeguimiento.value = true;
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

function limpiarSeguimiento() {
  seguimiento.value = {
    fecha: '',
    peso: 0,
    IMC: 0,
    tBrazo: 0,
    tPierna: 0,
    tCintura: 0,
    estatura: 0,
    createAt: new Date(),
  };

}
const editarSeguimiento = () => {
  
  if (!clienteSeleccionado.value || !clienteSeleccionado.value.seguimientoSeleccionado) {
    console.error("No se ha seleccionado ningún seguimiento para editar.");
    return;
  }

  
  const seguimientoSeleccionado = clienteSeleccionado.value.seguimientoSeleccionado;


  seguimiento.value.id = seguimientoSeleccionado.id;
  seguimiento.value.fecha = seguimientoSeleccionado.fecha;
  seguimiento.value.peso = seguimientoSeleccionado.peso;
  seguimiento.value.IMC = seguimientoSeleccionado.IMC;
  seguimiento.value.tBrazo = seguimientoSeleccionado.tBrazo;
  seguimiento.value.tPierna = seguimientoSeleccionado.tPierna;
  seguimiento.value.tCintura = seguimientoSeleccionado.tCintura;
  seguimiento.value.estatura = seguimientoSeleccionado.estatura;

 
  verFormularioSeguimiento.value = true;
};

 function verSeguimiento(){

}
const procesarFormularioSeguimiento = async () => {
  try {
   
    if (!seguimiento.value.id) {
      console.error("No se ha seleccionado ningún seguimiento para editar.");
      return;
    }

    
    await axios.put(`/api/clientes/${clienteSeleccionado.value._id}/seguimiento/${seguimiento.value.id}`, seguimiento.value);

    
    listarClientes();

    
    cerrarFormularioSeguimiento();
  } catch (error) {
    console.error("Error al procesar el formulario de seguimiento:", error);
  }
};

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
.q-ml-md{
  color:aqua
  
}
.table-title {
  text-align: center;
  position: relative;
  z-index: 999;
}
</style>
