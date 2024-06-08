<template>
    <div>
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregarPago()">Agregar</q-btn>
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
                  <q-select filled v-model="idcliente" label="Seleccione una Cliente" :options="clienteOptions"
            :rules="[val => !!val || 'Debe seleccionar un cliente']" />
            
                </div>
              <div>
                <q-select filled v-model="idplan" label="Seleccione un plan" :options="planOptions"
                :rules="[val => !!val || 'Debe seleccionar un plan']" />
              </div>
              
              
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div>
  
        <q-table title="Pagos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id">
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
  import { usePagosStore } from "../store/pagos.js"
  import { useClientesStore } from '../store/clientes.js';
  import { usePlanesStore } from "../store/planes.js"
  import axios from 'axios';
  import { useQuasar,Notify } from 'quasar';
  
  const verFormulario = ref(false)
  
  const pagoSeleccionado = ref(null);
  const tituloFormulario = ref('Agregar Pagos')
  
  const usePagos = usePagosStore();
  const useClientes = useClientesStore();
  const usePlanes = usePlanesStore();
  const idcliente = ref()
  const idplan = ref()
   const clienteOptions=ref([])
  const planOptions=ref([])
  const rows = ref([])
  const columns = ref([
    { name: "idcliente", label: "Cliente", 
    field:(row)=>{
      const cliente=clienteOptions.value.find(Option=>Option.value===row.idcliente);
      return cliente ? cliente.label :'';
    },    
    align: "center" },
    { name: "idplan", label: "ID plan",
    field:(row)=>{
      const plan=planOptions.value.find(Option=>Option.value===row.idplan);
      return plan ? plan.label :'';
    },    
      align: "center" },
    { name: "valor", label: "Precio", field: "valor", align: "center" },
    { name: "estado", label: "Estado", field: "estado", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarpagos() {
  
    const r = await usePagos.getPagos()
    console.log(r.data.pago);
    rows.value = r.data.pago
    
  }

   //listar clientes 
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


//listar PLan
async function listarPlanes() {
  try {
    const r = await usePlanes.getPlanes();
    console.log(r.data.plan);
    if (r && r.data.plan) {
      
      planOptions.value = r.data.plan.map(idplan => ({
        label: idplan.descripcion,
        value: idplan._id
      }));
      console.log(planOptions.value); // Mostrar contenido real del array
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.plan);
    }
  } catch (error) {
    console.error("Error al obtener los planes:", error);
  }
  
}

// const r = await usePlanes.getPlanes()
//   console.log(r.data.plan);
//   rows.value = r.data.plan
// }




  async function listarPagosActivos() {
  const r = await usePagos.getPagosActivos();
  console.log(r.data.pagoActivo);
  rows.value = r.data.pagoActivo;
}

async function listarPagosInactivos() {
  const r = await usePagos.getPagosInactios();
  console.log(r.data.pagoInactivo);
  rows.value = r.data.pagoInactivo;
}
  
  
  onMounted(() => {
    listarpagos()
    listarClientes()
    listarPlanes()
  })
  
  const procesarFormulario = async () => {
    
    try {

      console.log(idcliente.value.value);
      const idpagoSeleccionado=idcliente.value.value
      console.log(idplan.value.value);
      const idpagoSeleccionado2=idplan.value.value
      if (pagoSeleccionado.value !== null) {
        
        const pago= await usePagos.putPagos(pagoSeleccionado.value._id, {
          idcliente: idpagoSeleccionado.value,
          idplan: idpagoSeleccionado2.value
          
  
        });
        Notify.create({
        type: 'positive',
        message: 'Pago editado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
      } else {
        
  
        const pago=  await usePagos.postPagos({
          idcliente:idpagoSeleccionado.value,
          idplan: idpagoSeleccionado2.value,
          
        });
        Notify.create({
        type: 'positive',
        message: 'Pago agregado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
      }
  
      listarpagos();
      cerrarFormulario();
      limpiar();
      pagoSeleccionado.value = null;
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  };
  
  
  
  function editar(pago) {
    if (pago.estado !== 1) {
    Notify.create({
      type: 'warning',
      message: 'Para editar un pago debe estar activo',
      classes: 'customNotify',
      icon: 'warning',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black' }]
      
    });
    return;
  }
  
    pagoSeleccionado.value = pago
    tituloFormulario.value = 'Editar Pago'
    const cliente = clienteOptions.value.find(option => option.value === pago.idcliente);
    const plan = planOptions.value.find(option => option.value === pago.idplan);
    idcliente.value = cliente ? cliente.label : '';
    idplan.value = plan ? plan.label : '';
       verFormulario.value = (true)
  
  }
  
  function agregarPago() {
    pagoSeleccionado.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar PAgo'
  
       }

       async function activar(id) {
  await usePagos.putPagosActivar(id);
  listarpagos();
}

async function desactivar(id) {
  await usePagos.putPagosInactivar(id);
  listarpagos();
}
  
  function cerrarFormulario() {
    verFormulario.value = (false)
    pagoSeleccionado.value = null;
    limpiar()
  }

  function listar(tipo) {
  if (tipo === 'activos') {
    listarPagosActivos();
  } else if (tipo === 'inactivos') {
    listarPagosInactivos();
  } else {
    listarpagos();
  }
}
  function limpiar() {
  
    idcliente.value = ("")
    idplan.value = ("")
    
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
  
