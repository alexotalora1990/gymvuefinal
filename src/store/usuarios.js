

import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export const useUsuariosStore = defineStore('usuarios', () => {
    const token = ref('');
    const user = ref({});

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/usuarios", {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const postUser = async (newUser) => {
        try {
            const response = await axios.post("http://localhost:4000/api/usuarios", newUser, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:4000/api/usuarios/login", { email, password });
            token.value = response.data.token;
            user.value = response.data.usuario;
            return response;
        } catch (error) {
            return error;
        }
    };

    const putUser = async (id, updatedUser) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/usuarios/${id}`, updatedUser, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const putUserActivar = async (id) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/usuarios/activar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const putUserDesactivar = async (id) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/usuarios/desactivar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

   

    return { token, user, getUser, postUser, login, putUser, putUserActivar, putUserDesactivar};
}, {
    persist: true 
});





// import {defineStore} from "pinia"
// import axios from "axios"
// import {ref} from "vue"

// export const useUsuariosStore = defineStore("usuarios", ()=>{
// let token= ref("")
// let user=ref("")
    
//     const getUser = async()=>{
//         try {
//             const r = await axios.get("http://localhost:4000/api/usuarios")
//             return r
//         } catch (error) {
//             return error
//         }
//     };
//     const postUser = async(user)=>{
//         try {
//             const r=await axios.post("http://localhost:4000/api/usuarios",user)
//             return r
//         } catch (error) {
//             return error
            
//         }
//     };
//     const login = async(email,password)=>{
//         try {
//             const r=await axios.post("http://localhost:4000/api/usuarios/login",{email, password})
//             token.value=r.data.token
//             user.value=r.data.usuario
//             return r
//         } catch (error) {
//             return error
            
//         }
//     };
//     const putUser= async(id,user)=>{
//         try {
//             const r=await axios.put(`http://localhost:4000/api/usuarios/${id}`, user)
//             return r  
//         } catch (error) {
//             return error
//         }
//     };
//     const putUserActivar= async(id)=>{
//         try {
//             const r=await axios.put(`http://localhost:4000/api/usuarios/activar/${id}`)
//             return r   
//         } catch (error) {
//             return error
//         }
//     };
//     const putUserDesactivar= async(id)=>{
//         try {
//             const r=await axios.put(`http://localhost:4000/api/usuarios/desactivar/${id}`)
//             return r   
//         } catch (error) {
//             return error
//         }
//     };
    


//     return{ getUser, postUser,login, putUser, putUserActivar, putUserDesactivar }
// })