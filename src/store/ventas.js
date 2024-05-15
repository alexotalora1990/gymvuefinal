import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useVentasStore = defineStore("ventas", ()=>{

    
    const getVentas = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/ventas")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getVentas}
})