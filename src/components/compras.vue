<template>
    <div>

      

        <div class="q-pa-md">
      <div class="flex justify-end">
       
        <q-input filled v-model="fechaFiltro" label="Filtrar por fecha" type="date" style="width: 30%; margin-left: 16px;" @input="listarPorFecha">
          <template v-slot:append>
            <q-btn icon="search" @click="listarPorFecha" style="background-color:#ffff;" />
          </template>
        </q-input>
        <q-btn color="green" icon="add" @click="agregarCompra()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>
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
                  v-model="idProveedor"
                   label="Seleccione un proveedor"
                    :options="proveedorOptions"
                :rules="[val => !!val || 'Debe seleccionar un proveedor']" 
                use-input
              input-debounce="300"
              @filter="filterProveedorOptions"
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
  import { useCompraStore } from "../store/compras.js"
  import { useSedesStore } from '../store/sedes.js';
  import { useProveedorStore } from '../store/proveedor.js';
  import { useProductsStore } from "../store/productos.js";
  import { format } from 'date-fns';
  import axios from 'axios';
  import { useQuasar,Notify } from 'quasar';
  
  const verFormulario = ref(false)
  const $q = useQuasar();
  
  const compraSeleccionada = ref(null);
  const tituloFormulario = ref('Agregar Compra') 
  
  const useCompra = useCompraStore()
  const useSedes = useSedesStore();
  const useProveedor = useProveedorStore();
  const useProductos = useProductsStore();
  const idProveedor = ref()
  const idproducto = ref ()
  const idsede = ref()
  const cantidad = ref()
  
  const sedeOptions = ref([]);
  const proveedorOptions = ref([])
  const productoOptions = ref([])
  const filteredProveedorOptions = ref([]);
  const filteredProductoOptions = ref([]);
  const filteredSedeOptions = ref([]);
  const fechaFiltro = ref('');
  
  const rows = ref([])
  const loading = ref(false); 
  const loadingList = ref(null); 

  const columns = ref([
    { name: "idProveedor", label: "Proveedor",
     field:  (row) => row.idproveedor?.nombre,    
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
     { name: "createAt", label: "Fecha de Compra", field: (row) => format(new Date(row.createAt), 'dd/MM/yyyy'), align: "center" },
     { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  const loadingState = ref({});

  const filterProveedorOptions = (val, update) => {
  if (val === '') {
    update(() => {
      filteredProveedorOptions.value = proveedorOptions.value;
    });
    return;
  }
  
  const needle = val.toLowerCase();
  update(() => {
    filteredSedeOptions.value = clienteOptions.value.filter(v => v.label.toLowerCase().includes(needle));
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

  async function listarCompras()  {
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useCompra.getCompras()
    // console.log(r.data.Compra);
    rows.value = r.data.Compra
  } catch (error) {
    console.error('Error al listar todos las Compra :', error);
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

const listarProveedores = async () => {
  try {
    const r = await useProveedor.getProveedor();
    proveedorOptions.value = r.data.Proveedor.map(proveedor => ({ value: proveedor._id, label: proveedor.nombre }));
    filteredSedeOptions.value = proveedorOptions.value;
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
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
    const r = await useCompra.getVentasPorFecha(fechaFiltro.value);
    if (r.data.ComprasPorFecha) {
      rows.value = r.data.createAt
      ;
    } else {
      console.error('Error: La respuesta no contiene Compra Por Fecha');
    }
  } catch (error) {
    console.error('Error al listar Compras por fecha:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
};
  
  
  onMounted(() => {
    listarCompras()
    listarSedes()
    listarProveedores()
    listarProductos()
  })
  
  const procesarFormulario = async () => {
    loading.value = true;
  loadingList.value = 'guardar';
    try {
      const Compra={
        idProveedor: idProveedor.value.value,
          idproducto: idproducto.value.value,
          idsede: idsede.value.value,         
          cantidad: cantidad.value, 
      }
      if (compraSeleccionada.value !== null) {
        
       const compra= await useCompra.putCompras(compraSeleccionada.value._id, Compra);
        Notify.create({
        type: 'positive',
        message: 'Compra editada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
      } else {
        
  
     const compra=   await useCompra.postCompras(Compra);
        Notify.create({
        type: 'positive',
        message: 'Compra creada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
      }
  
      listarCompras();
      cerrarFormulario();
      limpiar();
      compraSeleccionada.value = null;
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }finally {
    loading.value = false;
    loadingList.value = null;
  }
  };
  
  
  
  function editar(compra) {
    
    compraSeleccionada.value = compra
    tituloFormulario.value = 'Editar Compra'
   
  
    idProveedor.value = compra.idProveedor.nombre;
    idproducto.value = compra.idproducto.nombre;
    idsede.value = compra.idsede.nombre;
    cantidad.value = compra.cantidad;
    verFormulario.value = (true)
   
  
  }
  
  async function agregarCompra() {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
    compraSeleccionada.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar Compra'
    idProveedor.value=null;
   idproducto.value=null;
  idsede.value=null;         
  cantidad.value=null    
  } 
  catch (error) {
    console.error('Error al agregar compra:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}
  
  function cerrarFormulario() {
    verFormulario.value = (false)
    compraSeleccionada.value = null;
    limpiar()
  }
  function limpiar() {
    
    idproveedor.value = ("")
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