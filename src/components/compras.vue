<template>
    <div>

      

        <div class="q-pa-md">
      <div class="flex justify-end">
       
      
        <q-btn color="green" icon="add" @click="abrir()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>
      </div>
        <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
  
          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{  accion == 1 ? "Crear Usuario" : "Editar Usuario" }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
          </div>
  
            <q-form class="q-gutter-md" @submit.prevent="procesar">
  
              <div>
                <q-select
                 filled
                  v-model="idproveedores"
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
                v-model="idproductos" 
                label="Seleccione un producto" 
                :options="productoOptions"
                :rules="[val => !!val || 'Debe seleccionar un Producto']"
                use-input
              input-debounce="300"
              @filter="filterProducto"
               />
              </div>
              <div>
                <q-select
                 filled 
                 v-model="idsedes"
                  label="Seleccione una sede"
                   :options="sedeOptions"
                    :rules="[val => !!val || 'Debe seleccionar una sede']"
                    use-input
              input-debounce="300"
              @filter="filterSede"
               />
              </div>
              <div>
                <q-input v-model="cantidad" label="Cantidad" type="number"
                  :rules="[val => /^[0-9]+$/.test(val) || 'La cantidad no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="valorUnidad" label="Valor Unidad" type="number"
                  :rules="[val => /^[0-9]+$/.test(val) || 'valor unidadno puede estar vacio y solo recibe numeros']" />
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


        <q-table title="Compras" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">

        
<template v-slot:header="props">
  <q-tr :props="props" style="font-size: 24px; " class="table1">
    <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
  </q-tr>
</template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traer(props.row)">
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
  const idproveedor = ref()
  const idproveedores=ref()
  const idproducto = ref ()
  const idproductos =ref()
  const idsede = ref()
  const idsedes = ref()
  const cantidad = ref()
  const valorUnidad =ref()
  let id = ref("")
  let datoSedes={}
let sedes=[]
const sedeOptions = ref([datoSedes]);
let datoProductos={}
  let productos = []

  
  const proveedorOptions = ref([])
  const productoOptions = ref([datoProductos])
  const filteredProveedorOptions = ref([]);
 
 
  
  const rows = ref([])
  const loading = ref(false); 
  const loadingList = ref(null); 
  const accion =ref(1)

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

const listarProveedores = async () => {
  try {
    const r = await useProveedor.getProveedor();
console.log(r.data.proveedor);

    proveedorOptions.value = r.data.proveedor.map(proveedor => ({ value: proveedor._id, label: proveedor.nombre }));
    filterProveedorOptions.value = proveedorOptions.value;
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
  }
};

async function listarProductos() {
try {
  const r = await useProductos.getProductsActivos();
  r.data.productosActivos.forEach(item=>{
    datoProductos={
      label:item.nombre,
      value:item._id
    }
    productos.push(datoProductos)
  })  
  console.log(productoOptions);  
} catch (error) {
  console.error('Error al obtener los Productos:', error);
}
}
function filterProducto(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    productoOptions.value = productos.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
  
  onMounted(() => {
    listarCompras()
    listarSedes()
    listarProveedores()
    listarProductos()
  })
  
//  agregar y editar 
async function agregar() {
  loading.value = true;
    loadingList.value = 'agregar';
    
  try {
  
    const user= await useCompra.postCompras({
      idsede:idsedes.value.value,
      idproducto:idproductos.value.value,
      idproveedor:idproveedores.value.value,
      cantidad:parseInt(cantidad.value),
      valorUnidad:parseFloat(valorUnidad.value)

    })
    Notify.create({
      type: "positive",
      message: "Compra creado exitosamente",
      icon: "check_circle",
      position:"top",
    });
    listarCompras()
    limpiar()
    verFormulario.value=false
    return user
  } catch (error) {
    console.error("Error al agregar COMPRA:", error);
    Notify.create({
      type: "negative",
      message: "Error al agregar COMPRA",
      icon: "error",
    });
  }

}


async function traer(compra) {
  verFormulario.value=true
  accion.value=2;
  idsedes.value={
    label:compra.idsede.nombre,
    value:compra.idsede._id
  }
  idproveedores.value={
    label:compra.idproveedor.nombre,
    value:compra.idproveedor._id,
      }

      idproductos.value={
    label:compra.idproducto.nombre,
    value:compra.idproducto._id,
      }
  id.value=compra._id,
  idsede.value=compra.idsede,
  idproveedor.value=compra.idproveedor,
  idproducto.value=compra.idproducto,
  cantidad.value=compra.cantidad
  valorUnidad.value=compra.valorUnidad
    }
    
    
async function editar() {
  try {
    await useCompra.putCompras(id.value,{
      idsede:idsedes.value.value,
      idproducto:idproductos.value.value,
      idproveedor:idproveedores.value.value,
     cantidad:cantidad.value,
     valorUnidad:valorUnidad.value  })
    Notify.create({
            message: 'compra actualizado correctamente!', 
            position: "top",
            color: "green"
        });
  } catch (error) {
    Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar la compra',
        });
        console.log('Error al modificar la compra', error);  
    
  }
  listarCompras()
    limpiar()
    verFormulario.value=false
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
  function cerrarFormulario() {
    verFormulario.value = (false)
    compraSeleccionada.value = null;
    limpiar()
  }
  function limpiar() {
    
    idproveedor.value = ("")
    idproducto.value = ("")
    idsede.value = ("")
    valorUnidad.value=("")
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