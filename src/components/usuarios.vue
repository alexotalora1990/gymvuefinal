<template>
  <div class="q-pa-md">

    <div class="flex justify-end">
        <q-btn color="green" icon="add" >Agregar</q-btn>
      </div>

      <div class="formulario" >
        <q-page>

          <h5>{{ tituloFormulario }}</h5>

          <q-form class="row q-col-gutter-md">

            <div>
              <q-input v-model="nombre" label="Nombre"
                :rules="[val => !!val || 'Nombre no puede estar vacio ']" />
            </div>
            <div>
              <q-input v-model="telefono" label="Telefono"
                :rules="[val => /^[0-9]+$/.test(val) || 'Telefono no puede estar vacio y solo recibe numeros']" />
            </div>
            <div>
              <q-input v-model="email" label="Email"
                :rules="[val => /^[0-9]+$/.test(val) || 'Email no puede estar vacio y solo recibe numeros']" />
            </div>
            <div>
              <q-input v-model="IdSede" label="IdSede"
                :rules="[val => /^[0-9]+$/.test(val) || 'sede no puede estar vacio y solo recibe numeros']" />
            </div>
            <div class="col-12">
              <q-btn label="Guardar" color="green" type="submit" />
              <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
            </div>

          </q-form>

        </q-page>
      </div>



    <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="nombre">
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
            🖋️
          </q-btn>
          <q-btn @click="cambiarEstadoUsuario(props.row)">
            {{ props.row.estado === 1 ? '❌' : '✅' }}
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useUsuariosStore } from "../store/usuarios.js"
const tituloFormulario= ref('Agregar')

const useUsuarios = useUsuariosStore()
const nombre=ref()
const telefono =ref()
const email = ref()
const sede= ref()

const rows = ref([])
const columns = ref([
  { name:"nombre", label:"Nombre Usuario", field:"nombre", align: "center"},
  { name:"roll", label:"Roll", field:"roll", align: "center"},
  { name:"telefono", label:"Telefono", field:"telefono", align: "center"},
  { name:"email", label:"Email", field:"email", align: "center"},
  { name:"sede", label:"Sede", field:"sede", align: "center"},
  { name:"estado", label:"Estado", field:"estado", align: "center"},
  { name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarUsuarios() {
  const r = await useUsuarios.getUser()
  console.log(r.data.Usuario);
  rows.value = r.data.Usuario
}

async function editarUsuario(usuario) {
  // Aquí podrías implementar la lógica para editar un usuario
  console.log("Editando usuario:", usuario)
}

async function cambiarEstadoUsuario(usuario) {
  try {
    const id = usuario.id;
    const nuevoEstado = usuario.estado === 1 ? 0 : 1;
    const response = await useUsuarios.putUsuariosActivar(id, nuevoEstado);
    const usuarioActualizado = response.data.usuarioActivo;
    console.log(id)
    // Actualizar el estado del usuario en la tabla
    const index = rows.value.findIndex(u => u.id === usuarioActualizado.id);
    if (index !== -1) {
      rows.value[index] = usuarioActualizado;
    }
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
  }
}

onMounted(() => {
  listarUsuarios()
})

</script>
