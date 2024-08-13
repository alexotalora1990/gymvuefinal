import {defineStore} from "pinia"
import axios from "axios"
import {TrackOpTypes, ref} from "vue"
import { useUsuariosStore } from "../store/usuarios.js"



export const useProductsStore = defineStore("productos", ()=>{
    let loading = ref(false) 

    const useUsuarios = useUsuariosStore()
    
    const getProducts = async()=>{
        try {
            loading.value=true
            const r = await axios.get("productos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

    const getProductsActivos = async()=>{
        try {
            loading.value=true
            const r = await axios.get("productos/activos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const getProductsInactivos = async()=>{
        try {
            loading.value=true
            const r = await axios.get("productos/inactivos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };




    const postProducts = async(product)=>{
        try {
            loading.value=true
            const r= await axios.post("productos", product,{
                headers:{
                    "x-token":useUsuarios.token
                    
            },
            
        });
        console.log(useUsuarios.token);
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }

    };
    const putProducts =async(id, product)=>{
        try {
            loading.value=true
            const r= await axios.put(`productos/${id}`, product,{
                headers:{
                    "x-token":useUsuarios.token
                    
            },
            
        })
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const putProductsActivar = async (id) => {
        try {
            loading.value=true
            const r = await axios.put(`productos/activar/${id}`, null,{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const putProductsDesactivar = async (id) => {
        try {
            loading.value=true
            const r = await axios.put(`productos/desactivar/${id}/`,null,{
            //     headers:{
            //         "x-token":useUsuarios.token                    
            // },
        });
            return r;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

      


   
    return{loading, getProducts, postProducts, putProducts,putProductsActivar,putProductsDesactivar, getProductsActivos, getProductsInactivos}
})





