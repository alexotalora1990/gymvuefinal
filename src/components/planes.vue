<template>
    <div>
  
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarPlan">Agregar</q-btn>
        </div>
        <div class="formulario" v-show="verFormulario">
          <q-page>
  
            <h5>{{ tituloFormulario }}</h5>
  
            <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">
  
              <div>
                <q-input v-model="descripcion" label="Descripción"
                  :rules="[val => !!val || 'El plan no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="valor" label="Valor"
                  :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="estado" label="Estado"
                  :rules="[val => /^[0-9]+$/.test(val) || 'El estado no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="dias" label="Dias"
                  :rules="[val => /^[0-9]+$/.test(val) || 'Los dias no puede estar vacio y solo recibe numeros']" />
              </div>
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div>
  
        <q-table title="PLANES" :rows="rows" :columns="columns" row-key="name">
  
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editarPlan(props.row)">
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
  import { usePlanesStore } from "../store/planes.js"
  import axios from 'axios';
  
  const verFormulario = ref(false)
  
  const planSeleccionado = ref(null);
  const tituloFormulario = ref('Agregar Plan')
  
  const usePlanes = usePlanesStore()
  const descripcion = ref()
  const valor = ref()
  const estado = ref()
  const dias = ref()

  const rows = ref([])
  const columns = ref([
    { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
    { name: "valor", label: "Precio", field: "valor", align: "center" },
    { name: "estado", label: "Estado", field: "estado", align: "center" },
    { name: "dias", label: "Dias", field: "dias", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarPlanes() {
  
    const r = await usePlanes.getPlanes()
    console.log(r.data.plan);
    rows.value = r.data.plan
  }
  
  
  onMounted(() => {
    listarPlanes()
  })
  
  const procesarFormulario = async () => {
    try {
      if (planSeleccionado.value !== null) {
        
        await axios.put(`http://localhost:4000/api/planes/${planSeleccionado.value._id}`, {
          descripcion: descripcion.value,
          valor: valor.value,
          estado: estado.value,
          dias: dias.value
  
        });
      } else {
        
  
        await axios.post('http://localhost:4000/api/planes', {
          descripcion: descripcion.value,
          valor: valor.value,
          estado: estado.value,
          dias: dias.value
  
        });
      }
  
      listarPlanes();
      cerrarFormulario();
      limpiar();
      planSeleccionado.value = null;
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  };
  
  
  
  function editarPlan(plan) {
  
    planSeleccionado.value = plan
    tituloFormulario.value = 'Editar Plan'
  
    descripcion.value = plan.descripcion;
    valor.value = plan.valor;
    estado.value = plan.estado;
    dias.value = plan.dias
  
    verFormulario.value = (true)
  
  }
  
  function agregarPlan() {
    planSeleccionado.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar Plan'
    limpiar()
  
  }
  
  function cerrarFormulario() {
    verFormulario.value = (false)
    planSeleccionado.value = null;
    limpiar()
  }
  function limpiar() {
  
    descripcion.value = ("")
    valor.value = ("")
    estado.value = ("")
    dias.value = ("")
  }
  
  </script>
  
  
  
  <style scoped>
  
  .formulario {
      position: absolute;      
       left: 50%; 
      transform: translate(-50%, 0); 
      z-index: 1; 
      background-color: white; 
      padding: 20px;
      border: 1px solid #ccc; 
      border-radius: 5px; 
  width: 60%;
  height: auto;
  margin-bottom: auto;
     
    }
  
  .q-card-primary {
    background-color: green;
  }
  
  h5 {
    background-color: green;
    width: 100%;
    color: #ffff;
    text-align: center;
  }
  
  </style>