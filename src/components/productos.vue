<template>
  <div>

    <div class="q-pa-md">

      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregarProducto">Agregar</q-btn>
      </div>
      

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
    <q-page class="form-content q-pa-lg shadow-2 rounded-borders">

      
      <div class="q-flex q-justify-between q-items-center">
        <h5 class="form-title bg-primary text-white q-pa-sm rounded-borders">{{ tituloFormulario }}</h5>
       
      </div>

      <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
        
        <q-input
          filled
          v-model="descripcion"
          label="Descripción"
          :rules="[val => !!val || 'Descripción no puede estar vacía']"
        />
        
       
        <q-input
          filled
          v-model="cantidad"
          label="Cantidad"
          type="number"
          :rules="[val => val && val > 0 || 'Cantidad debe ser un número positivo']"
        />

        <q-input
          filled
          v-model="valor"
          label="Valor"
          type="number"
          :rules="[val => val && val > 0 || 'Valor debe ser un número positivo']"
        />

        <div class="q-mt-md">
          <q-btn label="Agregar" color="green" type="submit" />
          <q-btn label="❌" color="red" outline @click="cerrarFormulario" />
        </div>
      </q-form>
    </q-page>
  </div>

      <q-table title="PRODUCTOS" title-class="table-title" :rows="rows" :columns="columns" row-key="name">

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editarProducto(props.row)">
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
import { useProductsStore } from "../store/productos.js"
import axios from 'axios';

const verFormulario = ref(false)

const productoSeleccionado = ref(null);
const tituloFormulario = ref('Agregar Producto')

const useProductos = useProductsStore()
const descripcion = ref()
const cantidad = ref()
const valor = ref()

const rows = ref([])
const columns = ref([
  { name: "descripcion", label: "Nombre", field: "descripcion", align: "center" },
  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  { name: "valor", label: "Precio", field: "valor", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function listarProductos() {

  const r = await useProductos.getProducts()
  console.log(r.data.producto);
  rows.value = r.data.producto
}


onMounted(() => {
  listarProductos()
})

const procesarFormulario = async () => {
  try {
    if (productoSeleccionado !== null && productoSeleccionado.value !== null) {
      // Si hay un producto seleccionado, se actualiza
      const product = await useProductos.putProducts(productoSeleccionado.value._id, {
        descripcion: descripcion.value,
        valor: valor.value,
        cantidad: cantidad.value

      });
    } else {
      // Si no hay un producto seleccionado, se agrega

      const product = await useProductos.postProducts({
        descripcion: descripcion.value,
        valor: valor.value,
        cantidad: cantidad.value
      });
    }

    listarProductos();
    cerrarFormulario();
    limpiar();
    productoSeleccionado.value = null;
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
};



function editarProducto(producto) {

  productoSeleccionado.value = producto
  tituloFormulario.value = 'Editar Producto'

  descripcion.value = producto.descripcion;
  cantidad.value = producto.cantidad;
  valor.value = producto.valor;
  verFormulario.value = (true)

}

function agregarProducto() {
  productoSeleccionado.value = null
  verFormulario.value = (true)
  tituloFormulario.value = 'Agregar Producto'


}

function cerrarFormulario() {
  verFormulario.value = (false)
  productoSeleccionado.value = null;
  limpiar()
}
function limpiar() {

  descripcion.value = ("")
  valor.value = ("")
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