<template>
    <div>
        <div class="q-pa-md">
          <q-table title="Treats" :rows="rows" :columns="columns" row-key="name" > 
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn @click="editar()">
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
  import {useIngresosStore} from "../store/ingresos.js"
  
  const useIngresos = useIngresosStore()
  
  const rows = ref([])
  const columns = ref([
    {name:"idsede", label:"ID Sede", field:"idsede", align: "center"},
    {name:"idcliente", label:"ID Cliente", field:"idcliente", align: "center"},
    {name:"opciones", label:"Opciones", field:"opciones", align: "center"},
  
  ])
  
  async function listarIngresos(){
  
    const r = await useIngresos.getIngreso()
    console.log(r.data.Ingreso);
    rows.value=r.data.Ingreso
  }
  
  onMounted(()=>{
    listarIngresos()
  })
  </script>