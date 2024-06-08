<template>
    <div>
    
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarMantenimiento">Agregar</q-btn>
        </div>
        <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">


          <div class="q-flex q-justify-between q-items-center">
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }}</h5>

          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">

           
            <q-select filled v-model="idmaquina" label="Seleccione una Máquina" :options="maquinaOptions"
            :rules="[val => !!val || 'Debe seleccionar una máquina']" />
            <q-input
             filled 
             v-model="responsable"
              label="Responsable"
               type="text"
              :rules="[val => !!val || 'Id Cliente no puede estar vacía']" />

              <q-input
             filled 
             v-model="descripcion"
              label="Descripción"
               type="text"
              :rules="[val => !!val || 'Id Cliente no puede estar vacía']" />

              <q-input
             filled 
             v-model="valor"
              label="Valor"
               type="text"
              :rules="[val => !!val || 'Id Cliente no puede estar vacía']" />


            
            <div class="q-mt-md">
              <q-btn label="Agregar" color="green" type="submit" />
              <q-btn label="❌" color="red" outline @click="cerrarFormulario()" />
            </div>
          </q-form>
        </q-page>
      </div>

        <q-table title="Mantenimiento" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:header="props">
          <q-tr :props="props" style="background-color: #F2630D; color: white; font-size: 24px; ">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editar(props.row)">
                🖋️
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
  const columns = ref([
    { name: "idmaquina", label: "Maquina",
    field: (row) => {
      const maquina = maquinaOptions.value.find(option => option.value === row.idmaquina);
      return maquina ? maquina.label : '';
    }, 
      align: "center" }, 
    { name: "responsable", label: "Responsable", field: "responsable", align: "center" },
    { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
    { name: "valor", label: "Precio", field: "valor", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarMantenimiento() {
  
    const r = await useMantenimiento.getMaintenance()
    console.log(r.data.mantenimientos);
    rows.value = r.data.mantenimientos
  }


  //listar Maquinas para traer descripcion
  async function listarMaquinas() {
  try {
    const r = await useMaquina.getMaquina();
    if (r && r.data.maquina) {
      maquinaOptions.value = r.data.maquina.map(idmaquina => ({
        label: idmaquina.descripcion,
        value: idmaquina._id
      }));
      console.log(maquinaOptions.value); // Mostrar contenido real del array
    } else {
      console.error("Estructura de respuesta inesperada:", r.data.maquina);
    }
  } catch (error) {
    console.error("Error al obtener las Maquinas:", error);
  }
}

  
  
  onMounted(() => {
    listarMantenimiento()
    listarMaquinas()
    console.log(maquinaOptions);
  })



  const procesarFormulario = async (option) => {
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
    } else {
      const mantenimiento = await useMantenimiento.postMaintenance({
        idmaquina: idMaquinaSeleccionada, 
        responsable: responsable.value,
        descripcion: descripcion.value,
        valor: valor.value
      });
    }
    listarMantenimiento();
    cerrarFormulario();
    limpiar();
    mantenimientoSeleccionado.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
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
  
//   function agregarMantenimiento() {
//     mantenimientoSeleccionado.value = null
//     verFormulario.value = (true)
//     tituloFormulario.value = 'Agregar Mantenimiento'
//     idmaquina.value = maquinaOptions.value.length > 0 ? maquinaOptions.value[0].value : '';
//     limpiar()
   
// }

function agregarMantenimiento() {
  mantenimientoSeleccionado.value = null;
  verFormulario.value = true;
  tituloFormulario.value = 'Agregar Mantenimiento';

  limpiar();
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
