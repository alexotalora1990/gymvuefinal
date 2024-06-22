import{defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useSedesStore=defineStore("sedes", ()=>{

    const getSede= async()=>{
        try {
            const r= await axios.get("sedes")
            return r.data
        } catch (error) {
            return error
        }
    };
    const getSedesActivas = async()=>{
        try {
            const r = await axios.get("sedes/activos",{
            //     headers:{
            //         "x-token":useUsuarios.token
            // },
        });
            return r
        } catch (error) {
            return error
        }
    };
    const getSedesInactivas = async()=>{
        try {
            const r = await axios.get("sedes/inactivos",{
            //     headers:{
            //         "x-token":useUsuarios.token
            // },
        });
            return r
        } catch (error) {
            return error
        }
    };




    const postSede = async(sede)=>{
        try {
            const r = await axios.post("sedes", sede)
            return r
        } catch (error) {
            return error
        }
    };
    const putSede=async(id, sede)=>{
        try {
            const r =await axios.put(`sedes/${id}`, sede)
            return r
        } catch (error) {
            return error
        }
    };

    const putSedeActivar =async (id)=>{
        try {
            const r = await axios.put(`sedes/activar/${id}`)
            return r
        } catch (error) {
            return error
            
        }
        
    };
    
    const putSedeDesactivar =async (id)=>{
        try {
            const r = await axios.put(`sedes/desactivar/${id}`)
            return r
        } catch (error) {
            return error
            
        }
        
    }


    return{getSede, getSedesActivas, getSedesInactivas, postSede, putSede, putSedeActivar, putSedeDesactivar}
});