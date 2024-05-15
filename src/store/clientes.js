import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useClientesStore = defineStore("clientes", ()=>{

    
    const getCliente = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/clientes")
            return res
        } catch (error) {
            return error
        }
    };
    const putCustomerActive =async (id)=>{
    try {
        const active =axios.put(`http://localhost:4000/api/clientes/activar/${id}`)
        return active.data
    } catch (error) {
        return error
    }
}

    return{ getCliente,putCustomerActive}

})