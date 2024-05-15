import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useUsuariosStore = defineStore("usuarios", ()=>{

    
    const getUser = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/usuarios")
            return res
        } catch (error) {
            return error
        }
    };
    const postuser = async()=>{
        try {
            const nuevoUsuario=await axios.post("http://localhost:4000/api/usuarios")
            return nuevoUsuario
        } catch (error) {
            return error
            
        }
    };
    const login = async(email,password)=>{
        try {
            const login=await axios.post("http://localhost:4000/api/usuarios/login",{email,password})
            return login
        } catch (error) {
            return error
            
        }
    }

    return{ getUser, postuser,login }
})