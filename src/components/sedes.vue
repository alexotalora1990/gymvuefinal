<template>
  <div>
    <div class="q-pa-md">
      <q-table title="Sedes" :rows="rows" :columns="columns" row-key="name"> 
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p style="color: green;" v-if="props.row.estado==1">Activo</p>
              <p style="color: red;" v-else>Inactivo</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">
              🖋️
            </q-btn>
            <q-btn v-if="props.row.estado==1">❌</q-btn>
                <q-btn v-else>✅
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSedesStore } from "../store/sedes.js";

const useSedes = useSedesStore();

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre Sede", field: "nombre", align: "center" },
  { name: "direccion", label: "Direccion", field: "direccion", align: "center" },
  { name: "horario", label: "Horarios", field: "horario", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

async function listarSedes() {
  try {
    const response = await useSedes.getSede();
    console.log(response.sede)
    rows.value = response.sede;
  } catch (error) {
    console.error('Error al obtener las sedes:', error);
  }
}

onMounted(() => {
  listarSedes();
});
</script>
