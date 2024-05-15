<template>
    <div>
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarPago">Agregar</q-btn>
        </div>
        <div class="formulario" v-show="verFormulario">
          <q-page>
  
            <h5>{{ tituloFormulario }}</h5>
  
            <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">
  
              <div>
                <q-input v-model="idcliente" label="ID cliente"
                  :rules="[val => !!val || 'el idcliente no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="idplan" label="ID plan"
                  :rules="[val => !!val || 'el idplan no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="valor" label="Valor"
                  :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="estado" label="Estado"
                  :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
              </div>
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div>
  
        <q-table title="PAGOS" :rows="rows" :columns="columns" row-key="name">
  
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editarPago(props.row)">
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
  import { usePagosStore } from "../store/pagos.js"
  import axios from 'axios';
  
  const verFormulario = ref(false)
  
  const pagoSeleccionado = ref(null);
  const tituloFormulario = ref('Agregar Pagos')
  
  const usePagos = usePagosStore()
  const idcliente = ref()
  const idplan = ref()
  const valor = ref()
  const estado = ref()
  
  const rows = ref([])
  const columns = ref([
    { name: "idcliente", label: "ID cliente", field: "idcliente", align: "center" },
    { name: "idplan", label: "ID plan", field: "idplan", align: "center" },
    { name: "valor", label: "Precio", field: "valor", align: "center" },
    { name: "estado", label: "Estado", field: "estado", align: "center" },
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  
  ])
  
  async function listarpagos() {
  
    const r = await usePagos.getPagos()
    console.log(r);
    rows.value = r.data.pago
  }
  
  
  onMounted(() => {
    listarpagos()
  })
  
  const procesarFormulario = async () => {
    try {
      if (pagoSeleccionado.value !== null) {
        
        await axios.put(`http://localhost:4000/api/pagos/${pagoSeleccionado.value._id}`, {
          idcliente: idcliente.value,
          idplan: idplan.value,
          valor: valor.value,
          estado: estado.value
  
        });
      } else {
        
  
        await axios.post('http://localhost:4000/api/pagos', {
          idcliente: idcliente.value,
          idplan: idplan.value,
          valor: valor.value,
          estado: estado.value
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
  
  
  
  function editarPago(producto) {
  
    pagoSeleccionado.value = pago
    tituloFormulario.value = 'Editar Pago'
  
    idcliente.value = pago.idcliente;
    idplan.value = pago.idplan;
    valor.value = pago.valor;
    estado.value = pago.estado;
    verFormulario.value = (true)
  
  }
  
  function agregarPago() {
    pagoSeleccionado.value = null
    verFormulario.value = (true)
    tituloFormulario.value = 'Agregar PAgo'
    limpiar()
  
  }
  
  function cerrarFormulario() {
    verFormulario.value = (false)
    pagoSeleccionado.value = null;
    limpiar()
  }
  function limpiar() {
  
    idcliente.value = ("")
    idplan.value = ("")
    valor.value = ("")
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

