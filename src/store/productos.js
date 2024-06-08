import {defineStore} from "pinia"
import axios from "axios"
import {TrackOpTypes, ref} from "vue"
import { useUsuariosStore } from "../store/usuarios.js"



export const useProductsStore = defineStore("productos", ()=>{

    const useUsuarios = useUsuariosStore()
    
    const getProducts = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/productos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }
    };

    const getProductsActivos = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/productos/activos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }
    };
    const getProductsInactivos = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/productos/inactivos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }
    };




    const postProducts = async(product)=>{
        try {
            const r= await axios.post("http://localhost:4000/api/productos", product,{
                headers:{
                    "x-token":useUsuarios.token
                    
            },
            
        });
        console.log(useUsuarios.token);
            return r
        } catch (error) {
            return error
        }

    };
    const putProducts =async(id, product)=>{
        try {
            const r= await axios.put(`http://localhost:4000/api/productos/${id}`, product,{
                headers:{
                    "x-token":useUsuarios.token
                    
            },
            
        })
            return r
        } catch (error) {
            return error
        }
    };
    const putProductsActivar = async (id) => {
        try {
            const r = await axios.put(`http://localhost:4000/api/productos/activar/${id}`, null,{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r;
        } catch (error) {
            return error;
        }
    };

    const putProductsDesactivar = async (id) => {
        try {
            const r = await axios.put(`http://localhost:4000/api/productos/desactivar/${id}/`,null,{
                headers:{
                    "x-token":useUsuarios.token
                    
            },});
            return r;
        } catch (error) {
            return error;
        }
    };

      


   
    return{ getProducts, postProducts, putProducts,putProductsActivar,putProductsDesactivar, getProductsActivos, getProductsInactivos}
})





