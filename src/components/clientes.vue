<template>
    <div>
      <div class="q-pa-md">
          <q-table title="Treats" :rows="rows" :columns="columns" row-key="name" > 
            <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <p style="color: green;" v-if="props.row.estado==1">Activo</p>
              <p style="color: red;" v-else>Inactivo</p>
            </q-td>
          </template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn @click="editar()">
                  🖋️
                </q-btn @click="activeCustomer()">
                <q-btn v-if="props.row.estado==1">❌</q-btn>
                <q-btn v-else>✅</q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
    </div>
  
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue"
  import {useClientesStore} from "../store/clientes.js"
  
  const useClientes = useClientesStore()
  
  const rows = ref([])
  const columns = ref([
  {name:"nombre",       label:"Nombre Usuario",       field:"nombre",         align: "center"},
    {name:"documento",    label:"Numero Documento",     field:"documento",      align: "center"},
    {name:"email",        label:"Email",                field:"email",          align: "center"},
    {name:"direccion",     label:"Direccion",            field:"direccion",      align: "center"},
    {name:"telefono",      label:"Telefono",             field:"telefono",       align: "center"},
    {name:"Cumpleanios",   label:"Fecha nacimiento",     field:"Cumpleanios",    align: "center"},
    {name:"estado",        label:"Estado",               field:"estado",         align: "center"},
    {name:"plan",           label:"Tipo de Plan",         field:"plan",           align: "center"},
    {name:"foto",           label:"Foto",                 field:"foto",           align: "center"},
    {name:"objetivo",       label:"Objetivo",             field:"objetivo",       align: "center"},
    {name:"observaciones",  label:"Observaciones",        field:"observaciones",  align: "center"},
    {name:"vencimiento",    label:"Fecha de Vencimiento", field:"vencimiento",    align: "center"},
    {name:"fecha",          label:"Fecha de Seguimiento", field:"fecha",          align: "center"},
    {name:"peso",           label:"Peso",                 field:"peso",           align: "center"},
    {name:"imc",            label:"IMC",                  field:"imc",            align: "center"},
    {name:"tbrazo",         label:"Talla de Brazo",       field:"tbrazo",         align: "center"},
    {name:"tpierna",        label:"Talla de Pierna",      field:"tpierna",        align: "center"},
    {name:"tcintura",       label:"Talla Cintura",        field:"tcintura",       align: "center"},
    {name:"estatura",       label:"Estatura",             field:"estatura",       align: "center"},
    {name:"opciones", label:"Opciones", field:"opciones", align: "center"},
  ])
  
  async function listarClientes(){
  
    const r = await useClientes.getCliente()
    console.log(r.data.Cliente);
    rows.value=r.data.Cliente
  }

  async function activeCustomer(id){
    try {
      const active= await useClientes.putCustomerActive(id)
      await listarClientes()
    } catch (error) {
      return error
    
  }
}


  onMounted(()=>{
    listarClientes()
  })
  
  </script>
  