<template>
  <div>
    <div class="q-pa-md">
      <div class="flex justify-end">
        <q-btn color="green" icon="add" @click="agregarProducto">Agregar</q-btn>
        <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
          <q-list>
            <q-item clickable v-ripple @click="listar('todos')">
              <q-item-section>Listar Todos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listar('activos')">
              <q-item-section>Listar Activos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listar('inactivos')">
              <q-item-section>Listar Inactivos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="form-container q-pa-md q-mx-auto" v-show="verFormulario">
        <q-page class="form-content q-pa-lg shadow-2 rounded-borders">

          <div class="q-flex q-justify-between q-items-center form-header">
            <h5 class="form-title">{{ tituloFormulario }}</h5>
            <q-btn flat icon="close" color="white" @click="cerrarFormulario" class="close-btn" />
          </div>

          <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
            <q-input v-model="nombre" label="Nombre" :rules="[val => !!val || 'Descripción no puede estar vacía']" />
            <q-input filled v-model="cantidad" label="Cantidad" type="number"
              :rules="[val => val && val > 0 || 'Cantidad debe ser un número positivo']" />
            <q-input filled v-model="valor" label="Valor" type="number"
              :rules="[val => val && val > 0 || 'Valor debe ser un número positivo']" />
            <div class="q-mt-md">
              <q-btn label="Agregar" color="green" type="submit" />
            </div>
          </q-form>
        </q-page>
      </div>

      <q-table title="Productos" title-class="table-title" :rows="rows" :columns="columns" row-key="_id" class="table">
        <template v-slot:header="props">
          <q-tr :props="props" style="font-size: 24px; " class="table1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">{{ props.row.estado === 1 ? 'Activo' :
              'Inactivo' }}</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editarProducto(props.row)"><q-tooltip class="bg-accent">Editar</q-tooltip>🖋️</q-btn>
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row._id)"><q-tooltip
                class="bg-accent">Desactivar</q-tooltip>❌</q-btn>
            <q-btn v-else @click="activar(props.row._id)"><q-tooltip class="bg-accent">Activar</q-tooltip>✅</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useProductsStore } from "../store/productos.js";
import { useQuasar, Notify } from 'quasar';

const $q = useQuasar();
const verFormulario = ref(false);
const productoSeleccionado = ref(null);
const tituloFormulario = ref('Agregar Producto');

const useProductos = useProductsStore();
const nombre = ref();
const cantidad = ref();
const valor = ref();

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  { name: "valor", label: "Precio", field: "valor", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

async function listarProductos() {
  const r = await useProductos.getProducts();
  console.log(r.data.producto);
  rows.value = r.data.producto;
}

async function listarProductosActivos() {
  const r = await useProductos.getProductsActivos();
  console.log(r.data.productosActivos);
  rows.value = r.data.productosActivos;
}

async function listarProductosInactivos() {
  const r = await useProductos.getProductsInactivos();
  console.log(r.data.productosInactivos);
  rows.value = r.data.productosInactivos;
}

onMounted(() => {
  listarProductos();
});

const procesarFormulario = async () => {
  try {
    if (productoSeleccionado.value !== null) {
      // Actualiza
      await useProductos.putProducts(productoSeleccionado.value._id, {
        nombre: nombre.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
    } else {
      // Agrega
      await useProductos.postProducts({
        nombre: nombre.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
    }

    listarProductos();
    cerrarFormulario();
    limpiar();
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  }
};

async function editarProducto(producto) {
  if (producto.estado !== 1) {
    Notify.create({
      type: 'warning',
      message: 'Para editar un producto debe estar activo',
      classes: 'customNotify',
      icon: 'warning',
      position: 'top',
      timeout: 3000,
      actions: [{ label: '❌', color: 'black' }]

    });
    return;
  }

  productoSeleccionado.value = producto;
  tituloFormulario.value = 'Editar Producto';

  nombre.value = producto.nombre;
  cantidad.value = producto.cantidad;
  valor.value = producto.valor;
  verFormulario.value = true;
}

async function agregarProducto() {
  productoSeleccionado.value = null;
  verFormulario.value = true;
  tituloFormulario.value = 'Agregar Producto';
}

async function activar(id) {
  await useProductos.putProductsActivar(id);
  listarProductos();
}

async function desactivar(id) {
  await useProductos.putProductsDesactivar(id);
  listarProductos();
}

function cerrarFormulario() {
  verFormulario.value = false;
  productoSeleccionado.value = null;
  limpiar();
}

function limpiar() {
  nombre.value = "";
  valor.value = "";
  cantidad.value = "";
}

function listar(tipo) {
  if (tipo === 'activos') {
    listarProductosActivos();
  } else if (tipo === 'inactivos') {
    listarProductosInactivos();
  } else {
    listarProductos();
  }
}
</script>

<style scoped>
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

.customNotify {
  font-size: 18px;
  background-color: red;

  color: white;
  padding: 10px;
  border-radius: 8px;
}

.table1 {
  background-color: #f2650da9;
  color: white;
}

.table {
  background-color: rgba(255, 255, 255, 0.9);

}

.q-mt-md {
  text-align: right;
 margin: 0;

}


.form-container {
  min-width: 60%;
  position: absolute;
  z-index: 1000;
  margin-left: 20%;
}

.form-content {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #e6e5e5;
  margin-bottom: 10%;
}

.form-header {
  background-color: #F2630D;
  padding: 0.5rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title {
  color: white;
  margin: 0;
  text-align: center;
  font-weight: bold;
  margin-left: 35%;
}

.close-btn {
  color: white;
}
</style>
