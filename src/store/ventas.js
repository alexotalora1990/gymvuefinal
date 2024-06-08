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
    };

    const postVentas=async(venta)=>{
try {
    const r=await axios.post("http://localhost:4000/api/ventas", venta)
    return r
} catch (error) {
    return error
    
}
    };

    const putVentas=async(id,venta)=>{
        try {
            const r=await axios.put(`http://localhost:4000/api/ventas/${id}`, venta)
            return r
        } catch (error) {
            return error
            
        }
            };

    return{ getVentas, postVentas, putVentas}
})