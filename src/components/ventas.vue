<template>
    <div>

      

        <div class="q-pa-md">
      <div class="flex justify-end">
       
        <q-input filled v-model="fechaFiltro" label="Filtrar por fecha" type="date" style="width: 30%; margin-left: 16px;" @input="listarPorFecha">
          <template v-slot:append>
            <q-btn icon="search" @click="listarPorFecha" style="background-color:#ffff;" />
          </template>
        </q-input>
        <q-btn color="green" icon="add" @click="agregarVenta()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>
      </div>
        <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
  
          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{ tituloFormulario }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
          </div>
  
            <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
  
              <div>
                <q-select
                 filled
                  v-model="idcliente"
                   label="Seleccione un cliente"
                    :options="clienteOptions"
                :rules="[val => !!val || 'Debe seleccionar un cliente']" 
                use-input
              input-debounce="300"
              @filter="filterClienteOptions"
              />
                
              </div>
              <div>
                <q-select 
                filled 
                v-model="idproducto" 
                label="Seleccione un producto" 
                :options="productoOptions"
                :rules="[val => !!val || 'Debe seleccionar un Producto']"
                use-input
              input-debounce="300"
              @filter="filterProductoOptions"
               />
              </div>
              <div>
                <q-select
                 filled 
                 v-model="idsede"
                  label="Seleccione una sede"
                   :options="sedeOptions"
                    :rules="[val => !!val || 'Debe seleccionar una sede']"
                    use-input
              input-debounce="300"
              @filter="filterSedeOptions"
               />
              </div>
              <div>
                <q-input v-model="cantidad" label="Cantidad"
                  :rules="[val => /^[0-9]+$/.test(val) || 'La cantidad no puede estar vacio y solo recibe numeros']" />
              </div>
              <div class="q-mt-md q-flex q-justify-end">
                <q-btn label="Cerrar" color="grey" outline class="q-mr-sm" @click="cerrarFormulario()" />
                <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" :loading="loading && loadingList === 'guardar'" />
              </div>
            </q-form>
  
          </q-page>
        </div>

        <div v-if="loading" class="overlay">
        <q-spinner-hourglass  color="primary" size="50px"  />
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
  import { useQuasar,Notify } from 'quasar';
  
  const verFormulario = ref(false)
  const $q = useQuasar();
  
  const ventaSeleccionada = ref(null);
  const tituloFormulario = ref('Agregar Venta') 
  
  const useVentas = useVentasStore()
  const useSedes = useSedesStore();
  const useClientes = useClientesStore();
  const useProductos = useProductsStore();
  const idcliente = ref()
  const idproducto = ref ()
  const idsede = ref()
  const cantidad = ref()
  
  const sedeOptions = ref([]);
  const clienteOptions = ref([])
  const productoOptions = ref([])
  const filteredClienteOptions = ref([]);
  const filteredProductoOptions = ref([]);
  const filteredSedeOptions = ref([]);
  const fechaFiltro = ref('');
  
  const rows = ref([])
  const loading = ref(false); 
  const loadingList = ref(null); 

  const columns = ref([
    { name: "idcliente", label: "Cliente",
     field:  (row) => row.idcliente?.nombre,    
    align: "center" },
   
    { name: "idproducto", label: "Producto",
     field: (row) => row.idproducto?.nombre,
      align: "center" },
    { name: "issede", label: "Sede",
    field: (row) => row.idsede?.nombre,
    align: "center"
  },
     
    { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
    { name: "valorUnidad", label: "Precio", field: row =>puntosMil(row.valorUnidad), align: "center" },
    { name: "total", label: "Total", field: row =>puntosMil(row.total), align: "center" },
    
     { name: "createAt", label: "Fecha de Venta", field: (row) => format(new Date(row.createAt), 'dd/MM/yyyy'), align: "center" },
     { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  const loadingState = ref({});

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

const filterSedeOptions = (val, update) => {
  if (val === '') {
    update(() => {
      filteredSedeOptions.value = sedeOptions.value;
    });
    return;
  }
  
  const needle = val.toLowerCase();
  update(() => {
    filteredSedeOptions.value = sedeOptions.value.filter(v => v.label.toLowerCase().includes(needle));
  });
};

  async function listarVentas()  {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useVentas.getVentas()
    // console.log(r.data.Venta);
    rows.value = r.data.Venta
  } catch (error) {
    console.error('Error al listar todos las ventas :', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

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


const listarProductos = async () => {
  try {
    const r = await useProductos.getProducts();
    console.log(r.data._id
    );
    productoOptions.value = r.data.producto.map(producto => ({ value: producto._id, label: producto.nombre }));
    filteredProductoOptions.value = productoOptions.value;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
  }
};

const listarPorFecha = async () => {
  if (!fechaFiltro.value) {
    $q.notify({
      type: 'negative',
      message: 'Seleccione una fecha para filtrar'
    });
    return;
  }

  loading.value = true;
  loadingList.value = 'fecha';
  try {
    const r = await useVentas.getVentasPorFecha(fechaFiltro.value);
    if (r.data.ventasPorFecha) {
      rows.value = r.data.createAt
      ;
    } else {
      console.error('Error: La respuesta no contiene ventasPorFecha');
    }
  } catch (error) {
    console.error('Error al listar ventas por fecha:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
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
      const Venta={
        idcliente: idcliente.value.value,
          idproducto: idproducto.value.value,
          idsede: idsede.value.value,         
          cantidad: cantidad.value, 
      }
      if (ventaSeleccionada.value !== null) {
        
       const venta= await useVentas.putVentas(ventaSeleccionada.value._id, Venta);
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
        
  
     const venta=   await useVentas.postVentas(Venta);
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
    }finally {
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
    idcliente.value=null;
   idproducto.value=null;
  idsede.value=null;         
  cantidad.value=null    
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