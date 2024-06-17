  <template>
  <div>
    <div class="q-pa-md">
      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregar()">Agregar</q-btn>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">


          <div class="q-flex q-justify-between q-items-center">
            <div class="q-mt-md">
             
              <q-btn label="❌" color="red" outline @click="cerrarFormulario()" />
            </div>
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders"><b>{{ tituloFormulario }}</b></h5>

          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">

            <q-select filled v-model="idsede" label="Seleccione una sede" :options="sedeOptions"
            :rules="[val => !!val || 'Debe seleccionar una sede']" />

            <q-select filled v-model="idcliente" label="Seleccione un cliente" :options="clienteOptions"
              :rules="[val => !!val || 'Debe seleccionar un cliente']" />


            

            
            <div class="q-mt-md">
              <q-btn label="Agregar" color="green" type="submit" />
              
            </div>
          </q-form>
        </q-page>
      </div>




      <q-table title="Ingresos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">

        
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px; " class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" >{{ col.label }}</q-th>
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
import { ref, onMounted } from "vue"
import { useIncomeStore } from "../store/ingresos.js"
import { useSedesStore } from "../store/sedes.js";
import { useClientesStore } from '../store/clientes.js';

import axios from 'axios';

const useIngresos = useIncomeStore()
const tituloFormulario= ref('Agregar Ingreso ')
const verFormulario=ref(false)
const ingresoSeleccionado =ref(null)
const idsede =ref()
const idcliente=ref()
const useSedes = useSedesStore();
const useClientes = useClientesStore();

const sedeOptions = ref([])
const clienteOptions = ref([])


const rows = ref([])
const columns = ref([
  { name: "idsede", label: "Sede", field:  (row) => {
      const sede = sedeOptions.value.find(option => option.value === row.idsede);
      return sede ? sede.label : '';
    },
     align: "center" },
  { name: "idcliente", label: "ID Cliente", field:  (row) => {
      const cliente = clienteOptions.value.find(option => option.value === row.idcliente);
      return cliente ? cliente.label : '';
    },
     align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function listarIngresos() {

  const r = await useIngresos.getIncome()
  console.log(r.data.Ingreso);
  rows.value = r.data.Ingreso
}

async function listarSedes() {
  try {
    const r = await useSedes.getSede();
    console.log(r.sede)
    if (r && r.sede) {
      
      sedeOptions.value = r.sede.map(idsede => ({
        label: idsede.nombre,
        value: idsede._id
      }));
      console.log(sedeOptions.value); // Mostrar contenido real del array
    } else {
      console.error("Estructura de respuesta inesperada:", r.sede);
    }
  } catch (error) {
    console.error("Error al obtener las sedes:", error);
  }
}

async function listarclientes() {
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
    console.error("Error al obtener los clientes:", error);
  }
}







onMounted(() => {
  listarIngresos()
  listarSedes()
  listarclientes()
})

const procesarFormulario=async()=>{
  try {
    if(ingresoSeleccionado !==null && ingresoSeleccionado.value !==null){
      const income= await useIngresos.putIncome(ingresoSeleccionado.value._id,{
        idsede:idsede.value,
        idcliente: idcliente.value
       

    })
    } else{
      const income=await useIngresos.postIncome({
        idsede:idsede.value,
        idcliente: idcliente.value
      })
    }
    listarIngresos()
    cerrarFormulario()
    limpiar()
    ingresoSeleccionado.value=null
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
}

async function agregar(){
  ingresoSeleccionado.value=null
  verFormulario.value=(true)
  tituloFormulario.value='Agregar Ingreso'
}




async function editar(ingreso){
  
  ingresoSeleccionado.value= ingreso
  tituloFormulario.value='Editar Ingreso'
  idsede.value=ingreso.idsede
  idcliente.value=ingreso.idcliente
  verFormulario.value=(true)
  }

async function cerrarFormulario(){
  verFormulario.value=(false)
  ingresoSeleccionado.value=null
  limpiar()
}

function limpiar(){
  idsede.value=("")
  idcliente.value=("")
 
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

.table1{
  background-color: #f2650da9;
   color: white;
  }
  
  .table{
    background-color: rgba(255, 255, 255, 0.527);
     
    }
    .q-mt-md{
      text-align: right
    }
</style>
 