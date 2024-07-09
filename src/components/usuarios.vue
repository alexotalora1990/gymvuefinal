<template>
  <div class="q-pa-md">
  
    <div class="flex justify-end">
      <q-btn color="green" icon="add" @click="agregarUsuario()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>
      <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listar('todos')" :class="{ 'loading-item': loading && loadingList === 'todos' }">
            <q-item-section>Listar Todos</q-item-section>
            <template v-if="loading && loadingList === 'todos'">
              <q-spinner color="primary" size="2em" />
            </template>
          </q-item>
          <q-item clickable v-ripple @click="listar('activos')" :class="{ 'loading-item': loading && loadingList === 'activos' }">
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
        <q-input filled label="nombre"/>
      </q-btn-dropdown>
    </div>

    <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
      <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
        <div class="q-flex q-justify-between q-items-center form-header">
          <h5 class="form-title">{{ tituloFormulario }}</h5>
          <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
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
            <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" :loading="loading && loadingList === 'guardar'" />
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
          
          <q-btn :loading="loadingState[props.row._id]" v-if="props.row.estado === 1" @click="desactivar(props.row)">❌
            <q-tooltip class="bg-accent">Desactivar</q-tooltip>
            <template v-slot:loading>
              <q-spinner color="primary" size="1em" />
            </template>
          </q-btn>

          <q-btn v-else @click="activar(props.row._id)" :loading="loadingState[props.row._id]">✅
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

const loading = ref(false); // Variable para controlar el estado de carga
const loadingList = ref(null); // Lista actualmente en proceso

const columns = ref([
  { name: 'nombre', label: 'Nombre Usuario', field: 'nombre', align: 'center' },
  { name: 'roll', label: 'Roll', field: 'roll', align: 'center' },
  { name: 'telefono', label: 'Telefono', field: 'telefono', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'sede', label: 'Sede', field: 'sede', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' },
]);

const loadingState = ref({}); // Estado de carga para cada fila

async function listarUsuarios()  {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useUsuarios.getUser();
    rows.value = r.data.Usuario;
    console.log(r.data.Usuario);
  } catch (error) {
    console.error('Error al listar todos los usuarios:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
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
  loading.value = true;
  loadingList.value = 'activos';
  try {
    const r = await useUsuarios.getUserActivos();
    rows.value = r.data.UsuariosActivos;
  } catch (error) {
    console.error('Error al listar usuarios activos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarUsuariosInactivos() {
  loading.value = true;
  loadingList.value = 'inactivos';
  try {
    const r = await useUsuarios.getUserInactivos();
    rows.value = r.data.UsuariosInactivos;
  } catch (error) {
    console.error('Error al listar usuarios inactivos:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null; 
  }
}

function listar(tipo) {
  loading.value = true;
  loadingList.value = tipo;
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

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
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
      await useUsuarios.putUser(usuarioSeleccionado.value._id, user);
    } else {
      await useUsuarios.postUser(user);
    }
    
    listarUsuarios();
    cerrarFormulario();
    limpiar();
    usuarioSeleccionado.value = null;

  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};

async function agregarUsuario() {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
    usuarioSeleccionado.value = null;
    verFormulario.value = true;
    verPassword.value = true;
    tituloFormulario.value = 'Agregar Usuario';
    
  } 
  catch (error) {
    console.error('Error al agregar usuario:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function editarUsuario(user) {
  console.log(user);
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

else{
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
}

async function activar(id) {
  loadingState.value[id] = true;
  try {
    await useUsuarios.putUserActivar(id);
    listarUsuarios();
  } catch (error) {
    console.error('Error al activar usuario:', error);
  } finally {
    loadingState.value[id] = false;
  }
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

  loadingState.value[user._id] = true;
  try {
    await useUsuarios.putUserDesactivar(user._id);
    listarUsuarios();
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
  } finally {
    loadingState.value[user._id] = false;
  }
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
.loading-item {
  pointer-events: none; /* Evita que se hagan clics en los elementos mientras se está cargando */
  opacity: 0.6; /* Opacidad reducida para indicar que está en proceso */
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