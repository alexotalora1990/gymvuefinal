<template>
    <div>
    
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarMantenimiento">Agregar</q-btn>
        </div>
        <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">

          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{ tituloFormulario }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">

           
            <q-select filled v-model="idmaquina" label="Seleccione una Máquina" :options="maquinaOptions"
            :rules="[val => !!val || 'Debe seleccionar una máquina']" />
            
            <q-input
             filled 
             v-model="responsable"
              label="Responsable"
               type="text"
              :rules="[val => !!val.trim() || 'Responsable no puede estar vacío']" />

              <q-input
             filled 
             v-model="descripcion"
              label="Descripción"
               type="text"
              :rules="[val => !!val.trim() || 'Descripción no puede estar vacío']" />

              <q-input
             filled 
             v-model="valor"
              label="Valor"
               type="text"
              :rules="[val => !!val || 'Valor no puede estar vacío']" />


            
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

        <q-table title="Mantenimiento" :rows="rows" :columns="columns" row-key="name" class="table">
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
  import { useMaintenanceStore } from "../store/mantenimientos.js"
  import { useMaquinaStore } from '../store/maquinas.js';
  import axios from 'axios';
  import { useQuasar,Notify } from 'quasar';

 
  const useMaquina = useMaquinaStore();
  const verFormulario = ref(false)
  
  const mantenimientoSeleccionado = ref(null);
  const tituloFormulario = ref('Agregar Mantenimiento')
  
  const useMantenimiento = useMaintenanceStore()
  const idmaquina = ref()
  const responsable = ref()
  const descripcion = ref()
  const valor = ref()
  const maquinaOptions = ref([])
  const rows = ref([])

  const loading = ref(false); 
  const loadingList = ref(null); 

  const columns = ref([
    { name: "idmaquina", label: "Maquina",
    field: (row) => {
      const maquina = maquinaOptions.value.find(option => option.value === row.idmaquina);
      return maquina ? maquina.label : '';
    }, 
      align: "center" },
    
    
    { name: "responsable", label: "Responsable", field: "responsable", align: "center" },
    { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
    { name: "valor", label: "Precio", field: row => puntosMil(row.valor), align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  const loadingState = ref({});

  async function listarMantenimiento(){
  loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useMantenimiento.getMaintenance()
    console.log(r.data.mantenimientos);
    rows.value = r.data.mantenimientos
  } catch (error) {
    console.error('Error al listar todos los mantenimientos:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}


  //listar Maquinas para traer descripcion
  async function listarMaquinas() {
    loading.value = true;
  loadingList.value = 'todos';
  try {
    const r = await useMaquina.getMaquina();
    const maquinas=r.data.maquina
    const maquinaActiva=maquinas.filter(maquina=>maquina.estado===1).map(idmaquina=>({
      label: idmaquina.descripcion,
      value: idmaquina._id
    }))

    maquinaOptions.value=maquinaActiva
    
  } catch (error) {
    console.error("Error al obtener las Maquinas:", error);
  }finally {
    loading.value = false;
    loadingList.value = null;
  }
}

  
  
  onMounted(() => {
    listarMantenimiento()
    listarMaquinas()
    console.log(maquinaOptions);
  })



  const procesarFormulario = async (option) => {
    loading.value = true;
    loadingList.value = 'guardar';
  try {
 
    console.log(idmaquina.value.value);
    const idMaquinaSeleccionada =idmaquina.value.value
    
    if (mantenimientoSeleccionado.value !== null) {
      const mantenimiento = await useMantenimiento.putMaintenance(mantenimientoSeleccionado.value._id, {
        idmaquina: idMaquinaSeleccionada, 
        responsable: responsable.value,
        descripcion: descripcion.value,
        valor: valor.value
      });
      Notify.create({
        type: 'positive',
        message: 'Mantenimiento editado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    } else {
      const mantenimiento = await useMantenimiento.postMaintenance({
        idmaquina: idMaquinaSeleccionada, 
        responsable: responsable.value,
        descripcion: descripcion.value,
        valor: valor.value
      });
      Notify.create({
        type: 'positive',
        message: 'Mantenimineto agregado exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
    }
    listarMantenimiento();
    cerrarFormulario();
    limpiar();
    mantenimientoSeleccionado.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }finally {
    loading.value = false;
    loadingList.value = null;
  }
};
  
  
  function editar(mantenimiento) {
  
    mantenimientoSeleccionado.value = mantenimiento
    tituloFormulario.value = 'Editar Mantenimiento'
    const maquina = maquinaOptions.value.find(option => option.value === mantenimiento.idmaquina);
    idmaquina.value =  maquina ? maquina.label : '';
    responsable.value = mantenimiento.responsable;
    descripcion.value = mantenimiento.descripcion;
    valor.value = mantenimiento.valor;
    verFormulario.value = (true)
  
  }
  


  async function agregarMantenimiento()  {
  loading.value = true;
  loadingList.value = 'agregar';
  try {
    mantenimientoSeleccionado.value = null;
  verFormulario.value = true;
  tituloFormulario.value = 'Agregar Mantenimiento';

  limpiar();
    
  } 
  catch (error) {
    console.error('Error al agregar usuario:', error); 
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}


  
  
  function cerrarFormulario() {
    verFormulario.value = (false)
    mantenimientoSeleccionado.value = null;
    limpiar()
  }
  function limpiar() {
    
    idmaquina.value = ("")
    responsable.value = ("")
    descripcion.value = ("")
    valor.value = ("")
    
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
