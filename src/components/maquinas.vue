
<template>
  <div>
    <div class="q-pa-md">
      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregar()">Agregar</q-btn>
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
            <q-input filled v-model="descripcion" label="Descripción" type="text"
              :rules="[(val) => !!val || 'Descripción no puede estar vacía']" />

            <q-select filled v-model="idSede" label="Seleccione una sede" :options="sedeOptions"
              :rules="[val => !!val || 'Debe seleccionar una sede']" />

            <q-input filled v-model="fechaUltimoMant" label="Último Mantenimiento" type="date"
              :rules="[(val) => !!val || 'Fecha último mantenimiento no debe estar vacía']" />

            <div class="q-mt-md">
              <q-btn label="Guardar" color="green" type="submit" />
              <q-btn label="❌" color="red" outline @click="cerrarFormulario()" />
            </div>
          </q-form>
        </q-page>
      </div>

      <q-table title="Productos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id">
        <template v-slot:header="props">
          <q-tr :props="props" style="background-color: #F2630D; color: white; font-size: 24px; ">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p style="color: green" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red" v-else>Inactivo</p>
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
import { ref, onMounted } from 'vue';
import { useMaquinaStore } from '../store/maquinas.js';
import { useSedesStore } from '../store/sedes.js';
import axios from 'axios';

const verFormulario = ref(false);

const maquinaSeleccionada = ref(null);
const tituloFormulario = ref('Agregar Maquina');

const useMaquina = useMaquinaStore();
const useSedes = useSedesStore();
const idSede = ref();
const descripcion = ref();
const fechaUltimoMant = ref();
const sedeOptions = ref([]);

const rows = ref([]);
const columns = ref([
  { name: 'idSede', label: 'Sede', field: 'idSede', align: 'center' },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'center' },
  { name: 'fechaUltimoMant', label: 'Fecha Último Mantenimiento', field: 'fechaUltimoMant', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' },
]);

async function listarMaquina() {
  const r = await useMaquina.getMaquina();
  rows.value = r.data.maquina.map(maquina => {
    const sede = sedeOptions.value.find(s => s.value === maquina.idSede);
    return {
      ...maquina,
      idSede: sede ? sede.label : maquina.idSede,
      fechaUltimoMant: new Date(maquina.fechaUltimoMant).toLocaleDateString('es-ES'),
    };
  });
}

async function listarSedes() {
  try {
    const r = await useSedes.getSede();
    if (r && r.sede) {
      sedeOptions.value = r.sede.map(sede => ({
        label: sede.nombre,
        value: sede._id,
      }));
      console.log(sedeOptions.value);
    } else {
      console.error('Estructura de respuesta inesperada:', r);
    }
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
}

async function listarMaquinasActivas() {
  const r = await useMaquina.getMaquinasActivas();
  rows.value = r.data.maquinasActivas.map(maquina => {
    const sede = sedeOptions.value.find(s => s.value === maquina.idSede);
    return {
      ...maquina,
      idSede: sede ? sede.label : maquina.idSede,
      fechaUltimoMant: new Date(maquina.fechaUltimoMant).toLocaleDateString('es-ES'),
    };
  });
}

async function listarMaquinasInactivas() {
  const r = await useMaquina.getMaquinasInactivas();
  rows.value = r.data.maquinasInactivas.map(maquina => {
    const sede = sedeOptions.value.find(s => s.value === maquina.idSede);
    return {
      ...maquina,
      idSede: sede ? sede.label : maquina.idSede,
      fechaUltimoMant: new Date(maquina.fechaUltimoMant).toLocaleDateString('es-ES'),
    };
  });
}

onMounted(async () => {
  await listarSedes();
  listarMaquina();
});

const procesarFormulario = async () => {
  try {
    if (maquinaSeleccionada !== null && maquinaSeleccionada.value !== null) {
      await useMaquina.putMaquina(maquinaSeleccionada.value._id, {
        idSede: idSede.value,
        descripcion: descripcion.value,
        fechaUltimoMant: fechaUltimoMant.value,
      });
    } else {
      await useMaquina.postMaquina({
        idSede: idSede.value,
        descripcion: descripcion.value,
        fechaUltimoMant: fechaUltimoMant.value,
      });
    }

    listarMaquina();
    cerrarFormulario();
    limpiar();
    maquinaSeleccionada.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
};

async function editar(maquina) {
  maquinaSeleccionada.value = maquina;
  tituloFormulario.value = 'Editar Maquina';

  idSede.value = maquina.idSede;
  descripcion.value = maquina.descripcion;
  fechaUltimoMant.value = maquina.fechaUltimoMant.split('/').reverse().join('-');

  verFormulario.value = true;
}

function agregar() {
  maquinaSeleccionada.value = null;
  verFormulario.value = true;
  tituloFormulario.value = 'Agregar Maquina';
}

function cerrarFormulario() {
  verFormulario.value = false;
  maquinaSeleccionada.value = null;
  limpiar();
}

async function activar(id) {
  await useMaquina.putMaquinaActivar(id);
  listarMaquina();
}

async function desactivar(id) {
  await useMaquina.putMaquinaDesactivar(id);
  listarMaquina();
}

function limpiar() {
  idSede.value = '';
  descripcion.value = '';
  fechaUltimoMant.value = '';
}

function listar(tipo) {
  if (tipo === 'activos') {
    listarMaquinasActivas();
  } else if (tipo === 'inactivos') {
    listarMaquinasInactivas();
  } else {
    listarMaquina();
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

.table-title {
  text-align: center;
  position: relative;
  z-index: 999;
}
</style>
