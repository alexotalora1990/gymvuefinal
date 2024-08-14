<template>
  <div class="q-pa-md">

    <div class="flex justify-end">

      <q-input filled label="Buscar por nombre"
        style="background-color:#d3d0d0; color: black; width: 30%; border-radius: 5px; margin-right: 1%;"
        v-model="nombreUsuario" @keyup.enter="listarNombre">
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
          <h5 class="form-title">{{ accion == 1 ? "Crear Usuario" : "Editar Usuario" }}</h5>
          <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
        </div>

        <q-form class="q-gutter-md" @submit.prevent="procesar">
          <q-input filled v-model="nombre" label="Nombre"
            :rules="[val => !!val.trim() || 'Nombre no puede estar vacío']" />
          <q-input filled v-model="password" label="Contraseña" v-if="accion === 1"
            :rules="[val => !!val.trim() || 'Contraseña no puede estar vacía']" />
          <q-input filled v-model="telefono" label="Teléfono"
            :rules="[val => /^[0-9]+$/.test(val) || 'Teléfono no puede estar vacío y solo recibe números']" />
          <q-input filled v-model="email" label="Email"
            :rules="[val => !!val.trim() || 'Email no puede estar vacío']" />
          <q-select filled v-model="idsedes" label="Seleccione una sede" :options="sedeOptions" @filter="filterFn"
            :rules="[val => !!val || 'Debe seleccionar una sede']" />
          <q-select filled v-model="roll" label="Rol*" :options="rollOptions"
            :rules="[val => !!val.trim() || 'Debe seleccionar un rol']" />
          <div class="q-mt-md q-flex q-justify-end">
            <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
            <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm"
              :loading="loading && loadingList === 'guardar'" />
          </div>
        </q-form>

      </q-page>
    </div>
    <div v-if="loading" class="overlay">
      <q-spinner-hourglass color="primary" size="50px" />
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
          <q-btn @click="traer(props.row)">
            <q-tooltip class="bg-accent">Editar</q-tooltip>🖋️
          </q-btn>

          <q-btn :loading="loadingState[props.row._id]" v-if="props.row.estado === 1" @click="desactivar(props.row)">❌
            <q-tooltip class="bg-accent">Desactivar</q-tooltip>
            <template v-slot:loading>
              <q-spinner-hourglass color="primary" size="10em" />
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

const nombre = ref('');
const telefono = ref('');
const email = ref('');
const idsede = ref('');
const idsedes=ref('')
const roll = ref('');
const password = ref('');
let id = ref("")
const rollOptions = ['Administrador', 'Instructor', 'Recepcion'];
const usuarioSeleccionado = ref(null);
let datos={}
let sedes=[]
const sedeOptions = ref(sedes);
const rows = ref([]);
let accion = ref(1);
const nombreUsuario = ref('')

const loading = ref(false);
const loadingList = ref(null);
const loadingState = ref({});

// Listar Tabla..............................
const columns = ref([
  { name: 'nombre', label: 'Nombre Usuario', field: 'nombre', align: 'center' },
  { name: 'roll', label: 'Roll', field: 'roll', align: 'center' },
  { name: 'telefono', label: 'Telefono', field: 'telefono', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'idsede', label: 'Sede', field: (row) => row.idsede?.nombre, align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' },
]);

// listar .........................................................

async function listarUsuarios() {
  loading.value = true;

  try {
    const r = await useUsuarios.getUser();
    rows.value = r.data.Usuario;
    console.log(r.data.Usuario);
  } catch (error) {
    console.error('Error al listar todos los usuarios:', error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);

  }
}

async function listarSedes() {

  try {
    const r = await useSedes.getSedesActivas();
    r.data.sedeActiva.forEach(item=>{
      datos={
        label:item.nombre,
        value:item._id
      }
      sedes.push(datos)
    })
    

    
    console.log(sedeOptions);
    
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
}
function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    sedeOptions.value = sedes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
async function listarUsuariosActivos() {
  loading.value = true;
  loadingList.value = 'activos';
  try {
    const r = await useUsuarios.getUserActivos();
    rows.value = r.data.UsuariosActivos;

    Notify.create({
      type: 'positive',
      message: 'Usuarios Activos Listados Correctamente',
      position: 'top'
    })
  } catch (error) {
    console.error('Error al listar usuarios activos:', error);
    Notify.create({
      type: 'negative',
      message: "No hay Usuarios activos"
    })
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
    const usuarioActivo = r.data.UsuariosInactivos;
    if (usuarioActivo.length === 0) {
      Notify.create({
        type: 'negative',
        message: "No hay Usuarios Inactivos"
      })
    }
    else {
      rows.value = usuarioActivo
      Notify.create({
        type: 'positive',
        message: 'Usuarios Inactivos Listados Correctamente',
        position: 'top'
      })
    }
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

async function listarNombre() {
  if (!nombreUsuario.value || nombreUsuario.value.trim() === "") {
    Notify.create({
      type: 'negative',
      message: 'Digite el nombre de un usuario'
    });
    return;
  }

  try {
    const r = await useUsuarios.getUser();
    if (!r.data || !r.data.Usuario) {
      throw new Error('No se encontraron usuarios en la respuesta');
    }

    const usuarioFiltrado = r.data?.Usuario?.filter(usuario =>
      usuario.nombre && usuario.nombre?.toLowerCase().includes(nombreUsuario.value.toLowerCase())
    );

    if (usuarioFiltrado.length === 0) {
      Notify.create({
        type: 'negative',
        message: 'Usuario no existe'
      });
    } else {
      rows.value = usuarioFiltrado;
    }
  } catch (error) {
    console.error('Error al listar nombre:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al listar usuarios'
    });
  } finally {
    nombreUsuario.value = "";
  }
}

onMounted(() => {
  listarUsuarios();
  listarSedes();
});



// agregar editar ..........................................

async function agregar() {
  loading.value = true;
    loadingList.value = 'agregar';
    
  try {
  
    const user= await useUsuarios.postUser({
      idsede:idsedes.value.value,
      nombre: nombre.value,
      telefono: telefono.value,
      email: email.value,
      roll: roll.value,
      password: password.value

    })
    Notify.create({
      type: "positive",
      message: "Usuario creado exitosamente",
      icon: "check_circle",
      position:"top",
    });
    listarUsuarios()
    limpiar()
    verFormulario.value=false
    return user
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    Notify.create({
      type: "negative",
      message: "Error al agregar usuario",
      icon: "error",
    });
  }

}

async function traer(user) {
  verFormulario.value=true
  accion.value=2;
  idsedes.value={
    label:user.idsede.nombre,
    value:user.idsede._id
  }
  id.value=user._id,
  nombre.value=user.nombre,
  telefono.value=user.telefono,
  email.value=user.email,
  roll.value=user.roll,
  password.value=user.password
}
async function editar() {
  try {
    await useUsuarios.putUser(id.value,{
      idsede:idsedes.value.value,
      nombre:nombre.value,
      telefono:telefono.value,
      email:email.value,
      roll:roll.value,
      password:password.value
    })
    Notify.create({
            message: 'Usuario actualizado correctamente!', 
            position: "top",
            color: "green"
        });
  } catch (error) {
    Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el usuario',
        });
        console.log('Error al modificar el usuario', error);  
    
  }
  listarUsuarios()
    limpiar()
    verFormulario.value=false
}

async function activar(id) {
  loadingState.value[id] = true;
  try {
    await useUsuarios.putUserActivar(id);
    listarUsuarios();
    Notify.create({
      type: 'positive',
      message: 'Usuario activado exitosamente',
      icon: 'check',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error('Error al activar usuario:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar Usuario',
      icon: 'error',

    });
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
    Notify.create({
      color: 'orange',
      message: 'Usuario desactivado exitosamente',
      icon: 'check',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar Usuario',
      icon: 'error',
    });
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
  margin-bottom: 5%;
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
