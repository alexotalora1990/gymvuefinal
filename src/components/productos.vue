<template>
  <div>
    <div class="q-pa-md">
      <div class="flex justify-end">

        <q-input filled label="Buscar por nombre"
          style="background-color:#d3d0d0; color: black; width: 30%; border-radius: 5px; margin-right: 1%;"
          v-model="nombreProducto" @keyup.enter="listarNombre">
          <template v-slot:append>
            <q-btn icon="search" @click="listarNombre" style="background-color:#ffff;" />
          </template>
        </q-input>

        <q-btn color="green" icon="add" @click="agregarProducto()"
          :loading="loading && loadingList === 'agregar'">agregar</q-btn>
        <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
          <q-list>
            <q-item clickable v-ripple @click="listar('todos')"
              :class="{ 'loading-item': loading && loadingList === 'todos' }">
              <q-item-section>Listar Todos</q-item-section>
              <template v-if="loading && loadingList === 'todos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>
            <q-item clickable v-ripple @click="listar('activos')"
              ::class="{ 'loading-item': loading && loadingList === 'activos' }">
              <q-item-section>Listar Activos</q-item-section>
              <template v-if="loading && loadingList === 'activos'">
                <q-spinner color="primary" size="2em" />
              </template>
            </q-item>
            <q-item clickable v-ripple @click="listar('inactivos')"
              :class="{ 'loading-item': loading && loadingList === 'inactivos' }">
              <q-item-section>Listar Inactivos</q-item-section>
              <template v-if="loading && loadingList === 'inactivos'">
                <q-spinner color="primary" size="2em" />
              </template>
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
            <q-input filled v-model="nombre" label="Nombre"
              :rules="[val => !!val.trim() || 'Descripción no puede estar vacía']" @blur="nombre = nombre.trim()" />
            <q-input filled v-model="cantidad" label="Cantidad" type="number"
              :rules="[val => val && val > 0 || 'Cantidad debe ser un número positivo']" />
            <q-input filled v-model="valor" label="Valor" type="number"
              :rules="[val => val && val > 0 || 'Valor debe ser un número positivo']" />

            <div class="q-mt-md q-flex q-justify-end">
              <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm"
                :loading="loading && loadingList === 'guardar'" />
            </div>
          </q-form>
        </q-page>
      </div>
      <div v-if="loading" class="overlay">
        <q-spinner-hourglass  color="primary" size="50px"  />
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
            <q-btn @click="editarProducto(props.row)">✍
              <q-tooltip class="bg-accent">Editar</q-tooltip>
            </q-btn>
        
            <q-btn 
              :loading="loadingState[props.row._id]" 
              v-if="props.row.estado === 1" 
              @click="desactivar(props.row._id)">
              ❌
              <q-tooltip class="bg-accent">Desactivar</q-tooltip>
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
        
            <q-btn 
              :loading="loadingState[props.row._id]" 
              v-else 
              @click="activar(props.row._id)">
              ✅
              <q-tooltip class="bg-accent">Activar</q-tooltip>
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
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
const nombreProducto = ref()
const rows = ref([]);
const loadingState = ref({});
const loadingList = ref(null);

const loading = ref(false);

const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  { name: "valor", label: "Precio", field: row => puntosMil(row.valor), align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);



async function listarProductos() {
  const r = await useProductos.getProducts();
  console.log(r.data.producto);
  loading.value= true;
  const producto = r.data.producto;
  
  if (producto.length === 0) {
    Notify.create({
      type: 'negative',
      message: "No hay productos en la base"
    })
  }
  else {
    
    rows.value = producto
   
    

  }setTimeout(() => {
        loading.value = false;
      },1000 );


}

async function listarProductosActivos() {
  const r = await useProductos.getProductsActivos();
  const productoActivo = r.data.productosActivos;
 
  if (productoActivo.length === 0) {
    Notify.create({
      type: 'negative',
      message: "No hay productos activos"
    })
  }
  else {
    rows.value = productoActivo
    Notify.create({
      type: 'positive',
      message: 'Productos Activos Listados Correctamente',
      position: 'top'
    })
  } loading.value = false;

}

async function listarProductosInactivos() {
  const r = await useProductos.getProductsInactivos();
  const productoInactivo = r.data.productosInactivos;

  if (productoInactivo.length === 0) {
    Notify.create({
      type: 'negative',
      message: "No hay productos inactivos"
    })
  }
  else {
    rows.value = productoInactivo
    Notify.create({
      type: 'positive',
      message: 'Productos Inactivos Listados Correctamente',
      position: 'top'
    })
  } loading.value = false;


}
async function listarNombre() {
  if (nombreProducto.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Digite el nombre de un producto'
    });
  }
  const r = await useProductos.getProducts();
  const productoFiltrado = r.data.producto.filter(producto =>
    producto.nombre.toLowerCase().includes(nombreProducto.value.toLowerCase())
  );
  if (productoFiltrado.length === 0) {
    Notify.create({
      type: 'negative',
      message: 'Producto no existe'
    });
  }
  else {
    rows.value = productoFiltrado
  }
  nombreProducto.value = ("")
}


onMounted(() => {
  listarProductos();
});

const procesarFormulario = async () => {
  loading.value = true;
  loadingList.value = 'guardar';
  try {
    if (productoSeleccionado.value !== null) {
      // Actualiza
      await useProductos.putProducts(productoSeleccionado.value._id, {
        nombre: nombre.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
      Notify.create({
        type: 'positive',
        message: 'Producto editado Correctamente',
        position: 'top'
      })
    } else {
      // Agrega
      await useProductos.postProducts({
        nombre: nombre.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
      Notify.create({
        type: 'positive',
        message: 'Producto Agregado Correctamente',
        position: 'top'
      })
    }

    listarProductos();
    cerrarFormulario();
    limpiar();
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
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
  loading.value = true;
  loadingList.value = 'agregar';
  try {
    productoSeleccionado.value = null;
    verFormulario.value = true;
    tituloFormulario.value = 'Agregar Producto';

  }
  catch (error) {
    console.error('Error al agregar producto:', error);
  } finally {
    loading.value = false;
    loadingList.value = null;
  }
}

async function activar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando activar producto con ID: ${id}`);
    const response = await useProductos.putProductsActivar(id);
    console.log('Respuesta de activación:', response);
    await listarProductos();
    Notify.create({
      type: 'positive',
      message: 'Producto activado exitosamente',
      icon: 'check',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error('Error al activar producto:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al activar producto',
      icon: 'error',

    });
  } finally {
    loadingState.value[id] = false;
  }
}

async function desactivar(id) {
  loadingState.value[id] = true;
  try {
    console.log(`Intentando desactivar producto con ID: ${id}`);
    const response = await useProductos.putProductsDesactivar(id);
    console.log('Respuesta de desactivación:', response);
    await listarProductos();
    Notify.create({
      color: 'orange',
      message: 'Producto desactivado exitosamente',
      icon: 'check',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al desactivar producto',
      icon: 'error',
    });
  } finally {
    loadingState.value[id] = false;
  }
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
  loading.value = true;
  loadingList.value = tipo;
  if (tipo === 'activos') {
    listarProductosActivos();
  } else if (tipo === 'inactivos') {
    listarProductosInactivos();
  } else {
    listarProductos();
  }
}

const puntosMil = (num) => {
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return '';
};

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
  margin-bottom: 5%;
}

.form-header {
  background-color: #F2630D;
  padding: 0.5rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7%;
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}
</style>
