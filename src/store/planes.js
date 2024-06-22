import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const usePlanesStore = defineStore("planes", ()=>{

    
    const getPlanes = async()=>{
        try {
            const r = await axios.get("planes")
            return r
        } catch (error) {
            return error
        }
    };
    const getPlanesActivos = async()=>{
        try {
            const r = await axios.get("planes/activos")
            return r
        } catch (error) {
            return error
        }
    };
    const getPlanesInactivos = async()=>{
        try {
            const r = await axios.get("planes/inactivos")
            return r
        } catch (error) {
            return error
        }
    };
    const postPlanes = async(plan)=>{
        try {
            const r = await axios.post("planes",plan)
            return r
        } catch (error) {
            return error
        }
    };
    const putPlanes = async(id, plan)=>{
        try {
            const r = await axios.put(`planes/${id}`,plan)
            return r
        } catch (error) {
            return error
        }
    };
    const putPlanesActivar = async(id, plan)=>{
        try {
            const r = await axios.put(`planes/activar/${id}`,null)
            return r
        } catch (error) {
            return error
        }
    };

    const putPlanesInactivar = async(id, plan)=>{
        try {
            const r = await axios.put(`planes/inactivar/${id}`,null)
            return r
        } catch (error) {
            return error
        }
    };

    return{ getPlanes,getPlanesActivos,getPlanesInactivos,postPlanes,putPlanes, putPlanesActivar, putPlanesInactivar}
})