import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useProveedorStore = defineStore("proveedores", ()=>{
    let loading = ref(false)
    
    const getProveedor = async()=>{
        try {
            loading.value=true
            const r = await axios.get("proveedor")
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };


    const getProveedoresActivos = async()=>{
        try {
            loading.value=true
            const r = await axios.get("proveedor/activos",{
              
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const getProveedoresInactivos = async()=>{
        try {
            loading.value=true
            const r = await axios.get("proveedor/inactivos",{
               
        });
            return r
        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

 

    const postProveedor = async (proveedor) => {
        console.log(proveedor);
        
        try {
            
            let res = await axios.post('proveedor/agregar', proveedor);
            console.log(proveedor);
            
            return res;
        } catch (error) {
            console.error('Error al enviar el proveedor:', error);
            throw error;  
        } 
    };
    
    const putProveedores =async (id, proveedor)=>{
      
        try {
          
            const r = await axios.put(`proveedor/editar/${id}`,proveedor)
        console.log(proveedor);
        
            return r
        } catch (error) {
            return error
        }
    };
    const putProveedoresActivar=async(id)=>{
        loading.value=true
        try {
            const r = await axios.put(`proveedor/activar/${id}`)
            return r

        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };
    const putProveedoresDesactivar=async(id)=>{
        loading.value=true
        try {
            const r = await axios.put(`proveedor/desactivar/${id}`)
            return r

        } catch (error) {
            return error
        }finally{
            loading.value=false
        }
    };

   

    return{ getProveedor, postProveedor, putProveedores,putProveedoresActivar,putProveedoresDesactivar,  getProveedoresActivos, getProveedoresInactivos, loading}

})