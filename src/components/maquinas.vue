<template>
    <div>
  
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarMaquina">Agregar</q-btn>
        </div>
        <div class="formulario" v-show="verFormulario">
          <q-page>
  
            <h5>{{ tituloFormulario }}</h5>
  
            <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">
                
              <div>
                 <q-input v-model="idSede" label="ID Sede"
                      :rules="[val => !!val || 'El ID Sede no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="descripcion" label="Descripción"
                  :rules="[val => !!val || 'Producto no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="fechaUltimoMant" label="fecha Ultimo Mantenimiento"
                  :rules="[val => /^[0-9]+$/.test(val) || 'La fecha del Ultimo Mantenimiento no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="estado" label="Estado"
                  :rules="[val => /^[0-9]+$/.test(val) || 'estado no puede estar vacio y solo recibe numeros']" />
              </div>
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div>
  
        <q-table title="MAQUINAS" :rows="rows" :columns="columns" row-key="name">
  
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editarMaquina(props.row)">
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
  import { useMaquinaStore } from "../store/maquinas.js"
  import axios from 'axios';
  
  const verFormulario = ref(false)
  
  const maquinaSeleccionada = ref(null);
  const tituloFormulario = ref('Agregar Maquina')
  
  const useMaquina = useMaquinaStore()
  const idSede = ref()
  const descripcion = ref()
  const fechaUltimoMant = ref()
  const estado = ref()
  
  const rows = ref([])
  const columns = ref([
    { name: "idSede", label: "ID Sede", field: "idSede", align: "center" },
    { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
    { name: "fechaUltimoMant", label: "fecha Ultimo Mantenimiento", field: "fechaUltimoMant", align: "center" },
    { name: "estado", label: "Estado", field: "estado", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarMaquina() {
  
    const r = await useMaquina.getMaquina()
    console.log(r.data.maquina);
    rows.value = r.data.maquina
  }
  
  
  onMounted(() => {
    listarMaquina()
  })
  
  const procesarFormulario = async () => {
    try {
      if (maquinaSeleccionada.value !== null) {
        
        await axios.put(`http://localhost:4000/api/maquina/${maquinaSeleccionada.value._id}`, {
          idSede: idSede.value,
          descripcion: descripcion.value,
          fechaUltimoMant: fechaUltimoMant.value,
          estado: estado.value
  
   
        });
      } else {
        
  
        await axios.post('http://localhost:4000/api/maquina', {
          idSede: idSede.value,
          descripcion: descripcion.value,
          fechaUltimoMant: fechaUltimoMant.value,
          estado: estado.value
        });
      }
  
      listarMaquina();
      cerrarFormulario();
      limpiar();
      maquinaSeleccionada.value = null;
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  };
  
  
  
  function editarMaquina(maquina) {
  
    maquinaSeleccionada.value = maquina
    tituloFormulario.value = 'Editar Maquina'
  
    idSede.value = maquina.idSede;
    descripcion.value = maquina.descripcion;
    fechaUltimoMant.value.value = maquina.fechaUltimoMant;
    estado.value = maquina.estado;
    verFormulario.value = (true)

   
  }
  
  function agregarMaquina() {
    maquinaSeleccionada.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar Maquina'
    limpiar()
  
  }
  
  function cerrarFormulario() {
    verFormulario.value = (false)
    maquinaSeleccionada.value = null;
    limpiar()
  }
  function limpiar() {

    idSede.value = ("")
    descripcion.value = ("")
    fechaUltimoMant.value = ("")
    estado.value = ("")
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