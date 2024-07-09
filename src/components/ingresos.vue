<template>
  <div>
    <div class="q-pa-md">
      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregar()" :loading="loading && loadingList === 'agregar'">Agregar</q-btn>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{ tituloFormulario }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
            <q-select 
              filled 
              v-model="idsede"
              label="Seleccione una sede" 
              :options="sedeOptions"
              :rules="[val => !!val || 'Debe seleccionar una sede']" 
            />

            <q-select 
              filled
              v-model="idcliente"
              label="Seleccione un cliente"
              :options="filteredClienteOptions"
              :rules="[val => !!val || 'Debe seleccionar un cliente']" 
              use-input
              input-debounce="300"
              @filter="filterClienteOptions"
            />

            <div class="q-mt-md q-flex q-justify-end">
              <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" :loading="loading && loadingList === 'guardar'" />
            </div>
          </q-form>
        </q-page>
      </div>

      <q-table title="Ingresos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px;" class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">
              🖋️<q-tooltip class="bg-accent">Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useIncomeStore } from "../store/ingresos.js";
import { useClientesStore } from '../store/clientes.js';
import { useSedesStore } from "../store/sedes.js";
import { Notify } from "quasar";

const useIngresos = useIncomeStore();
const useClientes = useClientesStore();
const useSedes = useSedesStore();

const tituloFormulario = ref('Agregar Ingreso');
const verFormulario = ref(false);
const ingresoSeleccionado = ref(null);
const idsede = ref(null);
const idcliente = ref(null);

const sedeOptions = ref([]);
const clienteOptions = ref([]);
const filteredClienteOptions = ref([]);

const loading = ref(false); 
const loadingList = ref(null); 

const rows = ref([]);
const columns = ref([
  { name: "idsede", label: "Sede", field:  (row) => row.idsede?.nombre || 'Sin nombre', align: "center" },
  { name: "idcliente", label: "Cliente", field:  (row) => row.idcliente?.nombre || 'Sin nombre', align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" }
]);

const filterClienteOptions = (val, update) => {
  if (val === '') {
    update(() => {
      filteredClienteOptions.value = clienteOptions.value;
    });
    return;
  }
  
  const needle = val.toLowerCase();
  update(() => {
    filteredClienteOptions.value = clienteOptions.value.filter(v => v.label.toLowerCase().includes(needle));
  });
};

const listarIngresos = async () => {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useIngresos.getIncome();
    rows.value = r.data.Ingreso;
  } catch (error) {
    console.error('Error al listar todos los ingresos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};

const listarSedes = async () => {
  try {
    const r = await useSedes.getSede();
    sedeOptions.value = r.sede.map(sede => ({ label: sede.nombre, value: sede._id }));
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
};

const listarClientes = async () => {
  try {
    const r = await useClientes.getCliente();
    clienteOptions.value = r.data.Cliente.map(cliente => ({ value: cliente._id, label: cliente.nombre }));
    filteredClienteOptions.value = clienteOptions.value;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
  }
};

onMounted(() => {
  listarIngresos();
  listarSedes();
  listarClientes();
});

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
  try {
    const Ingreso = {
      idsede: idsede.value.value,
      idcliente: idcliente.value.value
    };

    if (ingresoSeleccionado.value !== null) {
      await useIngresos.putIncome(ingresoSeleccionado.value._id, Ingreso);
      Notify.create({ type: 'positive', message: 'Ingreso Actualizado Exitosamente', icon: 'check', position: 'top' });
    } else {
      await useIngresos.postIncome(Ingreso);
      Notify.create({ type: 'positive', message: 'Ingreso Creado Exitosamente', icon: 'check', position: 'top' });
    }

    listarIngresos();
    cerrarFormulario();
    limpiar();
    ingresoSeleccionado.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    Notify.create({ type: 'negative', message: 'Error al procesar el formulario', icon: 'error' });
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};

const agregar = async () => {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
    verFormulario.value = true;
    tituloFormulario.value = 'Agregar Ingreso';
    ingresoSeleccionado.value = null;
    idsede.value = null;
    idcliente.value = null;
  } catch (error) {
    console.error('Error al agregar ingreso:', error);
    Notify.create({ type: 'negative', message: 'Error al agregar ingreso', icon: 'error' });
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};

const editar = async (ingreso) => {
  ingresoSeleccionado.value = ingreso;
  tituloFormulario.value = 'Editar Ingreso';
  idsede.value = ingreso.idsede.nombre;
  idcliente.value = ingreso.idcliente.nombre;
  verFormulario.value = true;
};

const cerrarFormulario = () => {
  verFormulario.value = false;
  ingresoSeleccionado.value = null;
  limpiar();
};

const limpiar = () => {
  idsede.value = "";
  idcliente.value = "";
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