import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const usePagosStore = defineStore("pago", ()=>{

    
    const getPagos = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/pagos")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getPagos}
})