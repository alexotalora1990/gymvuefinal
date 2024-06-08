<template>
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


        <div class="q-flex q-justify-between q-items-center">
          <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }} </h5>

        </div>

        <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">

          <q-input filled v-model="nombre" label="Nombre" :rules="[val => !!val || 'Nombre no puede estar vacio ']" />

          <div>
            <q-input 
          filled
           v-model="password" 
           label="Constrasenia"
           v-show="verPassword"
           :rules="[val => !!val || 'Email no puede estar vacio ']" />
</div>
            

          <q-input filled v-model="telefono" label="Telefono"
            :rules="[val => /^[0-9]+$/.test(val) || 'Telefono no puede estar vacio y solo recibe numeros']" />


          <q-input filled v-model="email" label="Email" :rules="[val => !!val || 'Email no puede estar vacio ']" />


          <q-select filled v-model="sede" label="Seleccione una sede" :options="sedeOptions"
            :rules="[val => !!val || 'Debe seleccionar una sede']" />



          <q-select filled v-model="roll" label="Roll*" :options="rollOptions"
            :rules="[val => !!val || 'Debe seleccionar un rol']" />

          <div class="col-12">
            <q-btn label="Guardar" color="green" type="submit" />
            <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
          </div>


        </q-form>
      </q-page>
    </div>



    <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="nombre">
 <template v-slot:header="props">
          <q-tr :props="props" style="background-color: #F2630D; color: white; font-size: 30px; ">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>


      <template v-slot:body-cell-estado="props">
        <q-td :props="props" >
          <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
            {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
          </p>
        </q-td>
      </template>
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-btn @click="editarUsuario(props.row)">
            🖋️
          </q-btn>
          <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row._id)">❌</q-btn>

          <q-btn v-else @click="activar(props.row._id)">✅</q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useUsuariosStore } from "../store/usuarios.js"
import { useSedesStore } from "../store/sedes.js";
import axios from 'axios';
import { useQuasar,Notify } from 'quasar';
const tituloFormulario = ref('Agregar Usuario')
const useUsuarios = useUsuariosStore()
const useSedes = useSedesStore()
const verFormulario = ref(false)
const verPassword=ref(true)
const nombre = ref()
const telefono = ref()
const email = ref()
const sede = ref()
const roll = ref()
const password = ref()
const rollOptions = ['Administrador', 'Instructor', 'Recepcion'];
const usuarioSeleccionado = ref(null)

const sedeOptions = ref([])

const rows = ref([])
const columns = ref([
  { name: "nombre", label: "Nombre Usuario", field: "nombre", align: "center" },
  { name: "roll", label: "Roll", field: "roll", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "sede", label: "Sede", field: "sede", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
])

async function listarUsuarios() {
  const r = await useUsuarios.getUser()
  console.log(r.data.Usuario);
  rows.value = r.data.Usuario

}

//listar sedes para traer nombre 
async function listarSedes() {
  try {
    const r = await useSedes.getSede();
    if (r && r.sede) {
      sedeOptions.value = r.sede.map(sede => ({
        label: sede.nombre,
        value: sede._id
      }));
      console.log(sedeOptions.value);
    } else {
      console.error("Estructura de respuesta inesperada:", r);
    }
  } catch (error) {
    console.error("Error al obtener las sedes:", error);
  }
}




async function listarUsuariosActivos() {
  const r = await useUsuarios.getUserActivos();
  console.log(r.data.UsuariosActivos);
  rows.value = r.data.UsuariosActivos;
}

async function listarUsuariosInactivos() {
  const r = await useUsuarios.getUserInactivos();
  console.log(r.data.UsuariosInactivos);
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
  listarUsuarios()
  listarSedes()
})

const procesarFormulario = async () => {
  try {
    if (usuarioSeleccionado !== null && usuarioSeleccionado.value !== null) {
      const user = await useUsuarios.putUser(usuarioSeleccionado.value._id, {
        nombre: nombre.value,
        telefono: telefono.value,
        email: email.value,
        sede: sede.value,
        roll: roll.value,

      })
    } else {
      const user = await useUsuarios.postUser({
        nombre: nombre.value,
        telefono: telefono.value,
        email: email.value,
        sede: sede.value,
        roll: roll.value,
        password: password.value
      })
    }
    listarUsuarios()
    cerrarFormulario()
    limpiar()
    usuarioSeleccionado.value = null
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
}
async function agregarUsuario() {
  usuarioSeleccionado.value = null
  verFormulario.value = (true)
  verPassword.value=(true)
  tituloFormulario.value = 'Agregar Usuario'
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
      actions: [{ label: '❌', color: 'black' }]
      
    });
    return;
  }


  verFormulario.value = (true)
  verPassword.value=(false)
  usuarioSeleccionado.value = user
  tituloFormulario.value = 'Editar Usuario'
  nombre.value = user.nombre
  telefono.value = user.telefono
  email.value = user.email
  sede.value = user.sede
  roll.value = user.roll

}

async function activar(id) {

  const r = await useUsuarios.putUserActivar(id)
  listarUsuarios()

}

async function desactivar(id) {
  const r = await useUsuarios.putUserDesactivar(id)
  listarUsuarios()
}



async function cerrarFormulario() {
  verFormulario.value = (false)
  usuarioSeleccionado.value = null
  limpiar()
}

function limpiar() {
  nombre.value = ("")
  telefono.value = ("")
  email.value = ("")
  sede.value = ("")
  roll.value = ("")
  password.value = ("")

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
</style>
