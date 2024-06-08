import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useClientesStore = defineStore("clientes", ()=>{

    
    const getCliente = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/clientes")
            return r
        } catch (error) {
            return error
        }
    };


    const getClientesActivos = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/clientes/activos",{
              
        });
            return r
        } catch (error) {
            return error
        }
    };
    const getClientesInactivos = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/clientes/inactivos",{
               
        });
            return r
        } catch (error) {
            return error
        }
    };

    const postClientes = async(cliente)=>{
        try {
            const r = await axios.post("http://localhost:4000/api/clientes", cliente)
            return r
        } catch (error) {
            return error
        }
    };

    const postSeguimiento = async(id, seguimiento)=>{
        try {
            const r = await axios.post(`http://localhost:4000/api/clientes/segumiento/${id}`, seguimiento)
            return r.data.seguimiento
        } catch (error) {
            return error
        }
    };

    const putClientes =async (id, cliente)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/clientes/${id}`,cliente)
            return r
        } catch (error) {
            return error
        }
    };
    const putClientesActivar=async(id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/clientes/activar/${id}`)
            return r

        } catch (error) {
            return error
        }
    };
    const putClientesDesactivar=async(id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/clientes/desactivar/${id}`)
            return r

        } catch (error) {
            return error
        }
    };

   

    return{ getCliente, postClientes, postSeguimiento,putClientes,putClientesActivar,putClientesDesactivar, getClientesActivos, getClientesInactivos}

})