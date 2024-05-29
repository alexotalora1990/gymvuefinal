import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useMaintenanceStore = defineStore("mantenimiento", ()=>{

    
    const getMaintenance = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/mantenimientos")
            return res
        } catch (error) {
            return error
        }
    };
    const postMaintenance=async(maintenance)=>{
        try {
            const newMaintenance= await axios.post("http://localhost:4000/api/mantenimientos", maintenance)
            return newMaintenance
        } catch (error) {
            return error
        }
    }

    return{ getMaintenance, postMaintenance}
})