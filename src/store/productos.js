import {defineStore} from "pinia"
import axios from "axios"
import {TrackOpTypes, ref} from "vue"

export const useProductsStore = defineStore("productos", ()=>{

    
    const getProducts = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/productos")
            return res
        } catch (error) {
            return error
        }
    };
    const postProducts = async(product)=>{
        try {
            const newProduct= await axios.post("http://localhost:4000/api/productos", product)
            return newProduct
        } catch (error) {
            return error
        }

    };
    const putProducts =async(id, product)=>{
        try {
            const updateProcuct= await axios.put(`http://localhost:4000/api/productos/${id}`, product)
            return updateProcuct
        } catch (error) {
            return error
        }
    }

    


   
    return{ getProducts, postProducts, putProducts}
})