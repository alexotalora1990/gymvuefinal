<template>
    <div>
  
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarVenta()">Agregar</q-btn>
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
                :rules="[val => !!val || 'Debe seleccionar un cliente']" />
              </div>
              <div>
                <q-select filled v-model="idproducto" label="Seleccione un producto" :options="productoOptions"
                :rules="[val => !!val || 'Debe seleccionar un Producto']" />
              </div>
              <div>
                <q-select filled v-model="idsede" label="Seleccione una sede" :options="sedeOptions" :rules="[val => !!val || 'Debe seleccionar una sede']" />
              </div>
              <div>
                <q-input v-model="cantidad" label="Cantidad"
                  :rules="[val => /^[0-9]+$/.test(val) || 'La cantidad no puede estar vacio y solo recibe numeros']" />
              </div>
              
             
              <div class="q-mt-md">
                <q-btn label="Guardar" color="green" type="submit" />
                
              </div>
  
            </q-form>
  
          </q-page>
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
  import axios from 'axios';
  import { useQuasar,Notify } from 'quasar';
  
  const verFormulario = ref(false)
  
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
  
  const rows = ref([])
  const columns = ref([
    { name: "idcliente", label: "ID cliente",
     field:  (row) => {
      const cliente = clienteOptions.value.find(Option => Option.value === row.idcliente);
      return cliente ? cliente.label : '';
    },
    align: "center"
  },
   
    { name: "idproducto", label: "ID producto", field: (row) => {
      const producto = productoOptions.value.find(Option => Option.value === row.idproducto);
      return producto ? producto.label : '';
    }, align: "center" },
    { name: "issede", label: "Sede",
    field: (row) => {
      const sede = sedeOptions.value.find(Option => Option.value === row.idsede);
      return sede ? sede.label : '';
    },
    align: "center"
  },
     
    { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
    { name: "valorUnidad", label: "Precio", field: "valorUnidad", align: "center" },
    { name: "total", label: "Total", field: "total", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarVentas() {
  
    const r = await useVentas.getVentas()
    console.log(r.data.Venta);
    rows.value = r.data.Venta
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

async function listarClientes() {
  try {
    const r = await useClientes.getCliente();
    console.log(r.data.Cliente);
    if (r && r.data.Cliente) {

      clienteOptions.value = r.data.Cliente.map(idcliente => ({
        label: idcliente.nombre,
        value: idcliente._id
      }));
      console.log(clienteOptions.value); // Mostrar contenido real del array
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.cliente);
    }
  } catch (error) {
    console.error("Error al obtener las clientes:", error);
  }

}

async function listarProductos() {
  try {
    const r = await useProductos.getProducts();
    console.log(r.data.producto);
    if (r && r.data.producto) {

      productoOptions.value = r.data.producto.map(idproducto => ({
        label: idproducto.nombre,
        value: idproducto._id
      }));
      console.log(productoOptions.value); 
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.producto);
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }

}

  
  
  onMounted(() => {
    listarVentas()
    listarSedes()
    listarClientes()
    listarProductos()
  })
  
  const procesarFormulario = async () => {
    try {
      if (ventaSeleccionada.value !== null) {
        
       const venta= await useVentas.putVentas(ventaSeleccionada.value._id, {
          idcliente: idcliente.value,
          idproducto: idproducto.value,
          idsede: idsede.value,         
          cantidad: cantidad.value,      
  
        });
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
        
  
     const venta=   await useVentas.postVentas({
           
          idcliente: idcliente.value,
          idproducto: idproducto.value,
          idsede: idsede.value,
          
          cantidad: cantidad.value,
          
        });
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
    }
  };
  
  
  
  function editar(venta) {
    
    ventaSeleccionada.value = venta
    tituloFormulario.value = 'Editar Venta'
   
  
    idcliente.value = venta.idcliente;
    idproducto.value = venta.idproducto;
    idsede.value = venta.idsede;
    cantidad.value = venta.cantidad;
    verFormulario.value = (true)
   
  
  }
  
  function agregarVenta() {
    ventaSeleccionada.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar Venta'
    limpiar()
  
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