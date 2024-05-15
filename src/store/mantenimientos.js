import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useMantenimientoStore = defineStore("mantenimiento", ()=>{

    
    const getMantenimiento = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/mantenimientos")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getMantenimiento}
})