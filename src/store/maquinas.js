import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"
import { useUsuariosStore } from "../store/usuarios.js"

export const useMaquinaStore = defineStore("maquina", ()=>{
    const useUsuarios = useUsuariosStore()
    
    const getMaquina = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/maquinas")
            return r
        } catch (error) {
            return error
        }
    };

    
    const getMaquinasActivas = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/maquinas/activos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }
    };
    const getMaquinasInactivas = async()=>{
        try {
            const r = await axios.get("http://localhost:4000/api/maquinas/inactivos",{
                headers:{
                    "x-token":useUsuarios.token
            },
        });
            return r
        } catch (error) {
            return error
        }
    };


    const postMaquina = async(maquina)=>{
        try {
            const r = await axios.post("http://localhost:4000/api/maquinas",maquina)
            return r
        } catch (error) {
            return error
        }
    };
    const putMaquina = async(id, maquina)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/maquinas/${id}`,maquina)
            return r
        } catch (error) {
            return error
        }
    };
    const putMaquinaActivar = async(id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/maquinas/activar/${id}`)
            return r
        } catch (error) {
            return error
        }
    };
    const putMaquinaDesactivar = async(id)=>{
        try {
            const r = await axios.put(`http://localhost:4000/api/maquinas/desactivar/${id}`)
            return r
        } catch (error) {
            return error
        }
    };



    return{ getMaquina, postMaquina, putMaquina, putMaquinaActivar, putMaquinaDesactivar, getMaquinasActivas, getMaquinasInactivas}
})