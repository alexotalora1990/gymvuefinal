import{defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useSedesStore=defineStore("sedes", ()=>{

    const getSede= async()=>{
        try {
            const r= await axios.get("http://localhost:4000/api/sedes")
            return r.data
        } catch (error) {
            return error
        }
    };

    const postSede=async(sede)=>{
        try {
            const r = await axios.post("localhost:4000/api/sedes", sede)
            return r
        } catch (error) {
            return error
        }
    };
    const putSede=async(id, sede)=>{
        try {
            const r =await axios.put(`http://localhost:4000/api/sedes/${id}`, sede)
            return r
        } catch (error) {
            return error
        }
    };

    const putSedeActivar =async (id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/sedes/activar/${id}`)
            return r
        } catch (error) {
            return error
            
        }
        
    };
    
    const putSedeDesactivar =async (id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/sedes/desactivar/${id}`)
            return r
        } catch (error) {
            return error
            
        }
        
    }


    return{getSede, postSede, putSede, putSedeActivar, putSedeDesactivar}
});