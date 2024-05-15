<template>
  <div>

    <div class="q-pa-md">

      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregarProducto">Agregar</q-btn>
      </div>
      <div class="formulario" v-show="verFormulario">
        <q-page>

          <h5>{{ tituloFormulario }}</h5>

          <q-form class="row q-col-gutter-md" @submit.prevent="procesarFormulario">

            <div>
              <q-input v-model="descripcion" label="Descripción"
                :rules="[val => !!val || 'Producto no puede estar vacio ']" />
            </div>
            <div>
              <q-input v-model="cantidad" label="Cantidad"
                :rules="[val => /^[0-9]+$/.test(val) || 'Precio no puede estar vacio y solo recibe numeros']" />
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
      </div>

      <q-table title="PRODUCTOS" :rows="rows" :columns="columns" row-key="name">

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
        if (productoSeleccionado !== null && productoSeleccionado.value !== null)  {
      // Si hay un producto seleccionado, se actualiza
      const product = await useProductos.putProducts(productoSeleccionado.value._id, {
        descripcion: descripcion.value,
        valor: valor.value,
        cantidad: cantidad.value

      });
    } else {
      // Si no hay un producto seleccionado, se agrega

          const product = await useProductos.postProducts( {
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