<template>
  <div>



    <div class="q-pa-md">

      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregarPlan()">Agregar</q-btn>
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
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }}</h5>
          </div>

          <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">

            <div>
              <q-input v-model="descripcion" label="Descripción"
                :rules="[val => !!val || 'El plan no puede estar vacio ']" />
            </div>
            <div>
              <q-input v-model="valor" label="Valor"
                :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
            </div>

            <div>
              <q-input v-model="dias" label="Dias"
                :rules="[val => /^[0-9]+$/.test(val) || 'Los dias no puede estar vacio y solo recibe numeros']" />
            </div>
            <div class="col-12">
              <q-btn label="Guardar" color="green" type="submit" />
              <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
            </div>

          </q-form>

        </q-page>
      </div>

      
      <q-table title="Planes" title-class="table-title" :rows="rows" :columns="columns" row-key="_id">
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
            <q-btn @click="editar(props.row)">
              🖋️
            </q-btn>
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row._id)">❌</q-btn>
            <q-btn v-else @click="activar(props.row._id)">✅</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

  </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import { usePlanesStore } from "../store/planes.js"
import axios from 'axios';
import { useQuasar,Notify } from 'quasar';

const verFormulario = ref(false)

const planSeleccionado = ref(null);
const tituloFormulario = ref('Agregar Plan')

const usePlanes = usePlanesStore()
const descripcion = ref()
const valor = ref()

const dias = ref()

const rows = ref([])
const columns = ref([
  { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
  { name: "valor", label: "Precio", field: "valor", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "dias", label: "Dias", field: "dias", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function listarPlanes() {

  const r = await usePlanes.getPlanes()
  console.log(r.data.plan);
  rows.value = r.data.plan
}
async function listarPlanesActivos() {
  const r = await usePlanes.getPlanesActivos();
  console.log(r.data.planActivo);
  rows.value = r.data.planActivo;
}

async function listarPlanesInactivos() {
  const r = await usePlanes.getPlanesInactivos();
  console.log(r.data.planInactivo);
  rows.value = r.data.planInactivo;
}
  



onMounted(() => {
  listarPlanes()
})

const procesarFormulario = async () => {
  try {
    if (planSeleccionado.value !== null) {

      const plan = await usePlanes.putPlanes(planSeleccionado.value._id, {
        descripcion: descripcion.value,
        valor: valor.value,
        dias: dias.value

      });
      Notify.create({
        type: 'positive',
        message: 'Plan editado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {


      const plan = await usePlanes.postPlanes({
        descripcion: descripcion.value,
        valor: valor.value,
      
        dias: dias.value

      });
      Notify.create({
        type: 'positive',
        message: 'Plan agregado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    }

    listarPlanes();
    cerrarFormulario();
    limpiar();
    planSeleccionado.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
};



function editar(plan) {
  if (plan.estado !== 1) {
    Notify.create({
      type: 'warning',
      message: 'Para editar un plan debe estar activo',
      classes: 'customNotify',
      icon: 'warning',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black' }]

    });
    return;
  }

  planSeleccionado.value = plan
  tituloFormulario.value = 'Editar Plan'

  descripcion.value = plan.descripcion;
  valor.value = plan.valor;
 
  dias.value = plan.dias

  verFormulario.value = (true)

}

function agregarPlan() {
  planSeleccionado.value = null
  verFormulario.value = (true)
  tituloFormulario.value = 'Agregar Plan'
  limpiar()

}
async function activar(id) {
  await usePlanes.putPlanesActivar(id);
  listarPlanes();
}

async function desactivar(id) {
  await usePlanes.putPlanesInactivar(id);
  listarPlanes();
}

function cerrarFormulario() {
  verFormulario.value = (false)
  planSeleccionado.value = null;
  limpiar()
}

function listar(tipo) {
  if (tipo === 'activos') {
    listarPlanesActivos();
  } else if (tipo === 'inactivos') {
    listarPlanesInactivos();
  } else {
    listarPlanes();
  }
}
function limpiar() {

  descripcion.value = ("")
  valor.value = ("")
  
  dias.value = ("")
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
.customNotify {
  font-size: 18px;
  background-color: red; /* Cambia el color de fondo a rojo */
  color: white;
  padding: 10px;
  border-radius: 8px;
}
</style>

