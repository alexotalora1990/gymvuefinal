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

    const postCustomer = async(cliente)=>{
        try {
            const r = await axios.post("http://localhost:4000/api/clientes", cliente)
            return r
        } catch (error) {
            return error
        }
    };

    const putCustomer =async (id, cliente)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/clientes/${id}`,cliente)
            return r
        } catch (error) {
            return error
        }
    };
    const putCustomerActivar=async(id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/clientes/activar/${id}`)
            return r

        } catch (error) {
            return error
        }
    };
    const putCustomerDesactivar=async(id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/clientes/desactivar/${id}`)
            return r

        } catch (error) {
            return error
        }
    };

   

    return{ getCliente, postCustomer, putCustomer, putCustomerActivar, putCustomerDesactivar}

})