<template>
    <div>
  
  
  
      <div class="q-pa-md">
  
        <div class="flex justify-end">
          <q-btn color="green" icon="add" @click="agregarVenta()">Agregar</q-btn>
        </div>
        <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">
  
          <div class="q-flex q-justify-between q-items-center">
            <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }}</h5>

          </div>
  
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
              
             
              <div class="col-12">
                <q-btn label="Guardar" color="green" type="submit" />
                <q-btn label="❌" color="red" outline class="q-ml-sm" @click="cerrarFormulario()" />
              </div>
  
            </q-form>
  
          </q-page>
        </div>
  
        <q-table title="Ingresos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id">

        
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
  import { useVentasStore } from "../store/ventas.js"
  import axios from 'axios';
  import { useQuasar,Notify } from 'quasar';
  
  const verFormulario = ref(false)
  
  const ventaSeleccionada = ref(null);
  const tituloFormulario = ref('Agregar Venta')
  
  const useVentas = useVentasStore()
  const idcliente = ref()
  const idproducto = ref ()
  const idsede = ref()
  const cantidad = ref()
  
  
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
        
       const venta= await useVentas.putVentas(ventaSeleccionada.value._id, {
          idcliente: idcliente.value,
          idproducto: idproducto.value,
          idsede: idsede.value,         
          cantidad: cantidad.value,      
  
        });
        Notify.create({
        type: 'positive',
        message: 'Venta editada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
      });
      } else {
        
  
     const venta=   await useVentas.postVentas({
           
          idcliente: idcliente.value,
          idproducto: idproducto.value,
          idsede: idsede.value,
          
          cantidad: cantidad.value,
          
        });
        Notify.create({
        type: 'positive',
        message: 'Venta editada exitosamente',
        classes: 'customNotify',
        icon: 'check',
        position: 'top',
        timeout: 3000,
        actions: [{ label: '❌', color: 'black' }]
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
  
  
  
  function editar(venta) {
    
    ventaSeleccionada.value = venta
    tituloFormulario.value = 'Editar Venta'
  
    idcliente.value = venta.idcliente;
    idproducto.value = venta.idproducto;
    idsede.value = venta.idsede;
    cantidad.value = venta.cantidad;
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
    
    cantidad.value = ("")
    

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