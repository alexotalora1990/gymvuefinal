<template>
    <div>
    
      <div class="q-pa-md">
  
        <!-- <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarMantenimiento">Agregar</q-btn>
        </div>
        <div class="formulario" v-show="verFormulario">
          <q-page>
  
            <h5>{{ tituloFormulario }}</h5>
  
            <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">
  
              <div>
                <q-input v-model="idmaquina" label="ID maquina"
                  :rules="[val => !!val || 'ID maquina no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="responsable" label="Responsable"
                :rules="[val => !!val || 'El nombre del responsable no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="descripcion" label="Descripcion"
                :rules="[val => !!val || 'La descripcion no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="valor" label="Valor"
                  :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
              </div>
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div> -->
  
        <q-table title="MANTENIMIENTO" :rows="rows" :columns="columns" row-key="name">
  
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editarMantenimiento(props.row)">
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
  import { useMantenimientoStore } from "../store/mantenimientos.js"
  import axios from 'axios';
  
  const verFormulario = ref(false)
  
  const mantenimientoSeleccionado = ref(null);
  const tituloFormulario = ref('Agregar Mantenimiento')
  
  const useMantenimiento = useMantenimientoStore()
  const idmaquina = ref()
  const responsable = ref()
  const descripcion = ref()
  const valor = ref()
  
  const rows = ref([])
  const columns = ref([
    { name: "idmaquina", label: "ID maquina", field: "idmaquina", align: "center" }, 
    { name: "responsable", label: "Responsable", field: "responsable", align: "center" },
    { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
    { name: "valor", label: "Precio", field: "valor", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarMantenimiento() {
  
    const r = await useMantenimiento.getMantenimiento()
    console.log(r);
    rows.value = r.data.mantenimientos
  }
  
  
  onMounted(() => {
    listarMantenimiento()
  })
  
  const procesarFormulario = async () => {
    try {
      if (mantenimientoSeleccionado.value !== null) {
        
        await axios.put(`http://localhost:4000/api/mantenimiento/${mantenimientoSeleccionado.value._id}`, {
          idmaquina: idmaquina.value,
          responsable: responsable.value,
          descripcion: descripcion.value,
          valor: valor.value
          
  
        });
      } else {
        
  
        await axios.post('http://localhost:4000/api/mantenimiento', {

          idmaquina: idmaquina.value,
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
  
  
  
  function editarMantenimiento(mantenimiento) {
  
    mantenimientoSeleccionado.value = mantenimiento
    tituloFormulario.value = 'Editar Mantenimiento'

    idmaquina.value.value = mantenimiento.idmaquina;
    responsable.value = mantenimiento.responsable;
    descripcion.value = mantenimiento.descripcion;
    valor.value = mantenimiento.valor;
    verFormulario.value = (true)
  
  }
  
  function agregarMantenimiento() {
    mantenimientoSeleccionado.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar Mantenimiento'
    limpiar()
  
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
  
  </style>../store/mantenimientos.js