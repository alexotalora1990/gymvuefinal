import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"


export const useMaintenanceStore = defineStore("mantenimiento", ()=>{

    
    const getMaintenance = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/mantenimientos")
            return r
        } catch (error) {
            return error
        }
    };
    const postMaintenance=async(mantenimiento)=>{
        try {
            const r= await axios.post("http://localhost:4000/api/mantenimientos", mantenimiento)
            return r
        } catch (error) {
            return error
        }
    };

    const putMaintenance=async(id, mantenimiento)=>{
        try {
            const r= await axios.put(`http://localhost:4000/api/mantenimientos/${id}`, mantenimiento)
            return r
        } catch (error) {
            return error
        }
    }
    return{ getMaintenance, postMaintenance, putMaintenance}
})