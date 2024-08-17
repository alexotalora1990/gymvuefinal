import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useCompraStore = defineStore("compras", ()=>{

    
    const getCompras = async()=>{
        try {
            const res = await axios.get("compras")
            return res
        } catch (error) {
            return error
        }
    };
 
   
    const postCompras=async(compra)=>{
        console.log(compra);
try {
    const r=await axios.post("compras", compra)
    console.log(compra);
        
    return r
} catch (error) {
    return error
    
}
    };

    const putCompras=async(id,compra)=>{
        try {
            const r=await axios.put(`compras/${id}`, compra)
            return r
        } catch (error) {
            return error
            
        }
            };

    return{ getCompras, postCompras, putCompras}
})