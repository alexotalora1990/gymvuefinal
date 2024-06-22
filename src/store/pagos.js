import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const usePagosStore = defineStore("pago", ()=>{

    
    const getPagos = async()=>{
        try {
            const r = await axios.get("pagos")
            return r
        } catch (error) {
            return error
        }
    };

    const getPagosActivos = async()=>{
        try {
            const r= await axios.get("pagos/activos")
            return r
        } catch (error) {
            return error
        }
    };
    const getPagosInactios = async()=>{
        try {
            const r = await axios.get("pagos/inactivos")
            return r
        } catch (error) {
            return error
        }
    };

    const postPagos = async(pago)=>{
        try {
            const r = await axios.post("pagos",pago)
            return r
        } catch (error) {
            return error
        }
    };

    const putPagos = async(id, pago)=>{
        try {
            const r = await axios.put(`pagos/${id}`,pago)
            return r
        } catch (error) {
            return error
        }
    };
    const putPagosActivar = async(id)=>{
        try {
            const r = await axios.put(`pagos/activar/${id}`,null,)
            return r
        } catch (error) {
            return error
        }
    };
    const putPagosInactivar = async(id)=>{
        try {
            const r = await axios.put(`pagos/inactivar/${id}`,null,)
            return r
        } catch (error) {
            return error
        }
    };
    
    return{ getPagos, getPagosActivos, getPagosInactios,postPagos,putPagos,putPagosActivar, putPagosInactivar}
})