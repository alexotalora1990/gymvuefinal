1<template>
  <div class="q-pa-md">
    <div class="flex justify-end">
      <q-btn color="green" icon="add" @click="agregarUsuario()">agregar</q-btn>
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
        <div class="q-mt-md q-flex q-justify-end">
          <q-btn label="❌" color="red" outline class="q-mr-md" @click="cerrarFormulario()" />
        </div>
        <div class="q-flex q-justify-between q-items-center">
          <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }}</h5>
        </div>
        <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
          <q-input filled v-model="nombre" label="Nombre" :rules="[val => !!val || 'Nombre no puede estar vacío']" />
          <q-input filled v-model="password" label="Contraseña" v-show="verPassword" :rules="[val => !!val || 'Contraseña no puede estar vacía']" />
          <q-input filled v-model="telefono" label="Teléfono" :rules="[val => /^[0-9]+$/.test(val) || 'Teléfono no puede estar vacío y solo recibe números']" />
          <q-input filled v-model="email" label="Email" :rules="[val => !!val || 'Email no puede estar vacío']" />
          <q-select filled v-model="idsede" label="Seleccione una sede" :options="sedeOptions" :rules="[val => !!val || 'Debe seleccionar una sede']" />
          <q-select filled v-model="roll" label="Rol*" :options="rollOptions" :rules="[val => !!val || 'Debe seleccionar un rol']" />
          <div class="q-mt-md q-flex q-justify-end">
            <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
            <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" />
          </div>
        </q-form>
      </q-page>
    </div>

    <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="nombre" class="table">
      <template v-slot:header="props">
        <q-tr :props="props" style="font-size: 30px;" class="table1">
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
          <q-btn @click="editarUsuario(props.row)">
            <q-tooltip class="bg-accent">Editar</q-tooltip>🖋️
          </q-btn>
          <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row)"><q-tooltip class="bg-accent">Desactivar</q-tooltip>❌</q-btn>
          <q-btn v-else @click="activar(props.row._id)"><q-tooltip class="bg-accent">Activar</q-tooltip>✅</q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsuariosStore } from '../store/usuarios.js';
import { useSedesStore } from '../store/sedes.js';
import { useQuasar, Notify } from 'quasar';

const tituloFormulario = ref('Agregar Usuario');
const useUsuarios = useUsuariosStore();
const useSedes = useSedesStore();
const verFormulario = ref(false);
const verPassword = ref(true);
const nombre = ref('');
const telefono = ref('');
const email = ref('');
const idsede = ref(null);
const roll = ref('');
const password = ref('');
const rollOptions = ['Administrador', 'Instructor', 'Recepcion'];
const usuarioSeleccionado = ref(null);
const sedeOptions = ref([]);
const rows = ref([]);
const columns = ref([
  { name: 'nombre', label: 'Nombre Usuario', field: 'nombre', align: 'center' },
  { name: 'roll', label: 'Roll', field: 'roll', align: 'center' },
  { name: 'telefono', label: 'Telefono', field: 'telefono', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'sede', label: 'Sede', field: 'sede', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' },
]);

async function listarUsuarios() {
  const r = await useUsuarios.getUser();
  rows.value = r.data.Usuario;
}

async function listarSedes() {
  try {
    const r = await useSedes.getSede();
    if (r && r.sede) {
      sedeOptions.value = r.sede.map((sede) => ({
        label: sede.nombre,
        value: sede._id,
      }));
    } else {
      console.error('Estructura de respuesta inesperada:', r);
    }
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
}

async function listarUsuariosActivos() {
  const r = await useUsuarios.getUserActivos();
  rows.value = r.data.UsuariosActivos;
}

async function listarUsuariosInactivos() {
  const r = await useUsuarios.getUserInactivos();
  rows.value = r.data.UsuariosInactivos;
}

function listar(tipo) {
  if (tipo === 'activos') {
    listarUsuariosActivos();
  } else if (tipo === 'inactivos') {
    listarUsuariosInactivos();
  } else {
    listarUsuarios();
  }
}

onMounted(() => {
  listarUsuarios();
  listarSedes();
});

const procesarFormulario = async (Option) => {
  try {
    console.log(idsede.value.value);
    const sedeSeleccionada = idsede.value.value;

    const user = {
      idsede: sedeSeleccionada,
      nombre: nombre.value,
      telefono: telefono.value,
      email: email.value,
      roll: roll.value,
      password: usuarioSeleccionado.value === null ? password.value : undefined, // Solo enviar el password si es un nuevo usuario
    };

    console.log('Datos enviados:', user);

    if (usuarioSeleccionado.value !== null) {
      await useUsuarios.putUser(usuarioSeleccionado.value._id,usr);
    } else {
      await useUsuarios.postUser(user);
    }
    
    listarUsuarios();
    cerrarFormulario();
    limpiar();
    usuarioSeleccionado.value = null;

  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
};

async function agregarUsuario() {
  usuarioSeleccionado.value = null;
  verFormulario.value = true;
  verPassword.value = true;
  tituloFormulario.value = 'Agregar Usuario';
}

async function editarUsuario(user) {
  if (user.estado !== 1) {
    Notify.create({
      type: 'warning',
      message: 'Para editar un usuario debe estar activo',
      classes: 'customNotify',
      icon: 'warning',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black' }],
    });
    return;
  }

  verFormulario.value = true;
  usuarioSeleccionado.value = user;
  verPassword.value = false;
  tituloFormulario.value = 'Editar Usuario';
  
  // Encuentra la sede correspondiente
  const sede = sedeOptions.value.find(option => option.value === user.idsede);
  
  // Asigna los valores al formulario
  nombre.value = user.nombre;
  telefono.value = user.telefono;
  email.value = user.email;
  idsede.value = sede ? sede.label : '';
  roll.value = user.roll;
}

async function activar(id) {
  await useUsuarios.putUserActivar(id);
  listarUsuarios();
}

async function desactivar(user) {
  if (user.email === useUsuarios.user.email && user.roll === 'Administrador' && user.estado === 1) {
    Notify.create({
      type: 'negative',
      message: 'No puedes desactivar tu propio registro si eres un administrador activo.',
      classes: 'customNotify',
      icon: 'error',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black' }],
    });
    return;
  }

  await useUsuarios.putUserDesactivar(user._id);
  listarUsuarios();
}

async function cerrarFormulario() {
  verFormulario.value = false;

  usuarioSeleccionado.value = null;
  limpiar();
}

function limpiar() {
  nombre.value = '';
  telefono.value = '';
  email.value = '';
  idsede.value = null;
  roll.value = '';
  password.value = '';
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

.table1 {
  background-color: #f2650da9;
  color: white;
}

.table {
  background-color: rgba(255, 255, 255, 0.527);
}

.q-mt-md {
  text-align: right;
}
</style>
