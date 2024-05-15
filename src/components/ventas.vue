<template>
    <div>
  
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarVenta">Agregar</q-btn>
        </div>
        <div class="formulario" v-show="verFormulario">
          <q-page>
  
            <h5>{{ tituloFormulario }}</h5>
  
            <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">
  
              <div>
                <q-input v-model="idcliente" label="ID cliente"
                  :rules="[val => !!val || 'El id del cliente no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="idproducto" label="ID producto"
                  :rules="[val => !!val || 'El id del producto no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="idsede" label="ID sede"
                  :rules="[val => !!val || 'El id de la sede no puede estar vacio ']" />
              </div>
              <div>
                <q-input v-model="cantidad" label="Cantidad"
                  :rules="[val => /^[0-9]+$/.test(val) || 'La cantidad no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="valorUnidad" label="Valor Unidad"
                  :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
              </div>
              <div>
                <q-input v-model="total" label="Total"
                  :rules="[val => /^[0-9]+$/.test(val) || 'El total no puede estar vacio y solo recibe numeros']" />
              </div>
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div>
  
        <q-table title="VENTAS" :rows="rows" :columns="columns" row-key="name">
  
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editarVenta(props.row)">
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
  import { useVentasStore } from "../store/ventas.js"
  import axios from 'axios';
  
  const verFormulario = ref(false)
  
  const ventaSeleccionada = ref(null);
  const tituloFormulario = ref('Agregar Venta')
  
  const useVentas = useVentasStore()
  const idcliente = ref()
  const idproducto = ref ()
  const idsede = ref()
  const cantidad = ref()
  const valorUnidad = ref()
  const total = ref()
  
  const rows = ref([])
  const columns = ref([
    { name: "idcliente", label: "ID cliente", field: "idcliente", align: "center" },
    { name: "idproducto", label: "ID producto", field: "idproducto", align: "center" },
    { name: "idsede", label: "ID sede", field: "idsede", align: "center" },
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
  
  
  onMounted(() => {
    listarVentas()
  })
  
  const procesarFormulario = async () => {
    try {
      if (ventaSeleccionada.value !== null) {
        
        await axios.put(`http://localhost:4000/api/ventas/${ventaSeleccionada.value._id}`, {
          idcliente: idcliente.value,
          idproducto: idproducto.value,
          idsede: idsede.value,
          valorUnidad: valorUnidad.value,
          cantidad: cantidad.value,
          total: total.value
  
        });
      } else {
        
  
        await axios.post('http://localhost:4000/api/ventas', {
           
          idcliente: idcliente.value,
          idproducto: idproducto.value,
          idsede: idsede.value,
          valorUnidad: valorUnidad.value,
          cantidad: cantidad.value,
          total: total.value
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
  
  
  
  function editarVenta(venta) {
  
    ventaSeleccionada.value = venta
    tituloFormulario.value = 'Editar Venta'
  
    idcliente.value = venta.idcliente;
    idproducto.value = venta.idproducto;
    idsede.value = venta.idsede;
    cantidad.value = venta.cantidad;
    valorUnidad.value = venta.valorUnidad;
    total.value = venta.total;
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
    valor.value = ("")
    cantidad.value = ("")
    total.value = ("")

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