<template>
  <div>



    <div class="q-pa-md">
      <div class="flex justify-end">

        <!-- <q-input filled v-model="fechaFiltro" label="Filtrar por fecha" type="date" style="width: 30%; margin-left: 16px;" @input="listarPorFecha">
          <template v-slot:append>
            <q-btn icon="search" @click="listarPorFecha" style="background-color:#ffff;" />
          </template>
</q-input> -->

        <div>
          <q-input filled v-model="fechaFiltro" label="Filtrar por fecha" type="date"
            style="width: 100%; margin-left: 16px;" @input="listarPorFecha">
            <template v-slot:append>
              <q-btn icon="search" @click="listarPorFecha" style="background-color:#ffff;" />
            </template>
          </q-input>

          <div v-if="!loading">
            <div v-if="ventas.length">
              <div v-for="venta in ventas" :key="venta._id">
                <!-- Muestra los detalles de cada venta aquí -->
                <p>{{ venta.detalle }}</p>
              </div>
              <div>
                <strong>Total de ventas: {{ totalVentas }}</strong>
              </div>
            </div>
            <!-- <div v-else>
        No hay ventas para la fecha seleccionada.
      </div> -->
          </div>
        </div>

        <q-btn color="green" icon="add" @click="agregarVenta()"
          :loading="loading && loadingList === 'agregar'">agregar</q-btn>
      </div>
      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">

          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{ tituloFormulario }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">

            <div>
              <q-select filled v-model="idcliente" label="Seleccione un cliente" :options="clienteOptions"
                :rules="[val => !!val || 'Debe seleccionar un cliente']" use-input input-debounce="300"
                @filter="filterCliente" />

            </div>
            <div>
              <q-select filled v-model="idproducto" label="Seleccione un producto" :options="productoOptions"
                :rules="[val => !!val || 'Debe seleccionar un Producto']" use-input input-debounce="300"
                @filter="filterProducto" />
            </div>
            <div>
              <q-select filled v-model="idsede" label="Seleccione una sede" :options="sedeOptions"
                :rules="[val => !!val || 'Debe seleccionar una sede']" use-input input-debounce="300"
                @filter="filterSede" />
            </div>
            <div>
              <q-input v-model="cantidad" label="Cantidad"
                :rules="[val => /^[0-9]+$/.test(val) || 'La cantidad no puede estar vacio y solo recibe numeros']" />
            </div>
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


      <q-table title="Ventas" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">


        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px; " class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">
              <q-tooltip class="bg-accent">Editar</q-tooltip>🖋️
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

  </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import { useVentasStore } from "../store/ventas.js"
import { useSedesStore } from '../store/sedes.js';
import { useClientesStore } from '../store/clientes.js';
import { useProductsStore } from "../store/productos.js";

import { format } from 'date-fns';
import axios from 'axios';
import { useQuasar, Notify } from 'quasar';

const verFormulario = ref(false)
const $q = useQuasar();

const ventaSeleccionada = ref(null);
const tituloFormulario = ref('Agregar Venta')

const useVentas = useVentasStore()
const useSedes = useSedesStore();
const useClientes = useClientesStore();
const useProductos = useProductsStore();
const idcliente = ref()
const idproducto = ref()
const idsede = ref()
const cantidad = ref()
let datoSedes={}
let sedes=[]
const sedeOptions = ref(datoSedes);
let datoClientes={}
let clientes=[]
const clienteOptions = ref(datoClientes)
let datoProductos
let productos=[]
const productoOptions = ref(datoProductos)



const fechaFiltro = ref('');
const ventas = ref([]);
const totalVentas = ref(0);
const rows = ref([])
const loading = ref(false);
const loadingList = ref(null);

const columns = ref([
  {
    name: "idcliente", label: "Cliente",
    field: (row) => row.idcliente?.nombre,
    align: "center"
  },

  {
    name: "idproducto", label: "Producto",
    field: (row) => row.idproducto?.nombre,
    align: "center"
  },
  {
    name: "issede", label: "Sede",
    field: (row) => row.idsede?.nombre,
    align: "center"
  },

  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  { name: "valorUnidad", label: "Precio", field: row => puntosMil(row.valorUnidad), align: "center" },
  { name: "total", label: "Total", field: row => puntosMil(row.total), align: "center" },
  { name: "createAt", label: "Fecha de Venta", field: (row) => format(new Date(row.createAt), 'dd/MM/yyyy'), align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

const loadingState = ref({});


const filterProductoOptions = (val, update) => {
  if (val === '') {
    update(() => {
      filteredProductoOptions.value = productoOptions.value;
    });
    return;
  }

  const needle = val.toLowerCase();
  update(() => {
    filteredProductoOptions.value = productoOptions.value.filter(v => v.label.toLowerCase().includes(needle));
  });
};



async function listarVentas() {

  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useVentas.getVentas()
   
    rows.value = r.data.Venta
    console.log(r.data.Venta);
    
  } catch (error) {
    console.error('Error al listar todos las Compras :', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function listarSedes() {

try {
  const r = await useSedes.getSedesActivas();
  r.data.sedeActiva.forEach(item=>{
    datoSedes={
      label:item.nombre,
      value:item._id
    }
    sedes.push(datoSedes)
  })
  

  
  console.log(sedeOptions);
  
} catch (error) {
  console.error('Error al obtener las sedes:', error);
}
}

function filterSede(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    sedeOptions.value = sedes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}

async function listarClientes() {

try {
  const r = await useClientes.getClientesActivos();
  console.log();
  
  r.data.clientesActivos.forEach(item=>{
    datoClientes={
      label:item.nombre,
      value:item._id
    }
    clientes.push(datoClientes)
  })
  

  
  console.log(clienteOptions);
  
} catch (error) {
  console.error('Error al obtener las sedes:', error);
}
}

function filterCliente(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    clienteOptions.value = clientes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}

async function listarProductos() {

try {
  const r = await useProductos.getProductsActivos();
  console.log();
  
  r.data.productosActivos.forEach(item=>{
    datoProductos={
      label:item.nombre,
      value:item._id
    }
    productos.push(datoProductos)
  })
  

  
  console.log(productoOptions);
  
} catch (error) {
  console.error('Error al obtener los productos:', error);
}
}

function filterProducto(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    productoOptions.value = productos.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}






const listarPorFecha = async () => {
  if (!fechaFiltro.value) {
    $q.notify({
      type: 'negative',
      message: 'Seleccione una fecha para filtrar'
    });
    return;
  }

  loading.value = true;
  try {
    const r = await useVentas.getVentasPorDia(fechaFiltro.value);
    if (r.data.ventasPorDia) {
      ventas.value = r.data.ventasPorDia[0]?.ventas || [];
      totalVentas.value = r.data.ventasPorDia[0]?.totalVentas || 0;
      console.log(r.data.ventasPorDia);
    } else {
      console.error('Error: La respuesta no contiene ventasPorFecha');
    }
  } catch (error) {
    console.error('Error al listar ventas por fecha:', error);
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  listarVentas()
  listarSedes()
  listarClientes()
  listarProductos()
})

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
  try {
    const Venta = {
      idcliente: idcliente.value.value,
      idproducto: idproducto.value.value,
      idsede: idsede.value.value,
      cantidad: cantidad.value,
    }
    if (ventaSeleccionada.value !== null) {

      const venta = await useVentas.putVentas(ventaSeleccionada.value._id, Venta);
      Notify.create({
        type: 'positive',
        message: 'Venta editada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {


      const venta = await useVentas.postVentas(Venta);
      Notify.create({
        type: 'positive',
        message: 'Venta editada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    }

    listarVentas();
    cerrarFormulario();
    limpiar();
    ventaSeleccionada.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};



function editar(venta) {

  ventaSeleccionada.value = venta
  tituloFormulario.value = 'Editar Venta'


  idcliente.value = venta.idcliente.nombre;
  idproducto.value = venta.idproducto.nombre;
  idsede.value = venta.idsede.nombre;
  cantidad.value = venta.cantidad;
  verFormulario.value = (true)


}

async function agregarVenta() {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
    ventaSeleccionada.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar Venta'
    idcliente.value = null;
    idproducto.value = null;
    idsede.value = null;
    cantidad.value = null
  }
  catch (error) {
    console.error('Error al agregar venta:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

function cerrarFormulario() {
  verFormulario.value = (false)
  ventaSeleccionada.value = null;
  limpiar()
}
function limpiar() {

  idcliente.value = ("")
  idproducto.value = ("")
  idsede.value = ("")

  cantidad.value = ("")


}
const puntosMil = (num) => {
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return '';
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
  margin-bottom: 7%;
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
