

import { defineStore } from 'pinia';
import axios from 'axios';
import { TrackOpTypes, ref } from 'vue';

export const useUsuariosStore = defineStore('usuarios', () => {
    let loading = ref(false) 
    
    const token = ref('');
    const user = ref({});      

    const getUser = async () => {
        try {
            loading.value=true
            const response = await axios.get("usuarios");
            return response;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const getUserActivos = async () => {
        try {
            loading.value=true
            const r = await axios.get("usuarios/activos");
            return r;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const getUserInactivos = async () => {
        try {
            loading.value=true
            const r = await axios.get("usuarios/inactivos");
            return r;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const postUser = async (user) => {
        try {
            loading.value=true
            const response = await axios.post("usuarios",user)
            return response.data;
            console.log(user);
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const login = async (email, password) => {
        try {
            loading.value=true
            const response = await axios.post("usuarios/login",{ email, password });
            token.value = response.data.token;
            user.value = response.data.usuario;
            return response;
        } catch (error) {
            throw new Error('Error en el inicio de sesión');
        }finally{
            loading.value=false
        }
    };

    const logout = () => {
        token.value = '';
        user.value = {};
    };

    const putUser = async (id, user) => {
        try {
            loading.value=true
            const response = await axios.put(`usuarios/${id}`, user, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const putUserActivar = async (id) => {
        try {
            loading.value=true
            const response = await axios.put(`usuarios/activar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const putUserDesactivar = async (id) => {
        try {
            loading.value=true
            const response = await axios.put(`usuarios/desactivar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }finally{
            loading.value=false
        }
    };

    const postRecuperarPassword=async(email)=>{
        try {
            loading.value=true
            const response= await axios.post('usuarios/recuperarPassword', {email});
            return response;
        } catch (error) {
            
            return error;
        }finally{
            loading.value=false
        }
    };

    const postResetPassword=async(token, newPassword)=>{
        try {
            loading.value=true
            const response= await axios.post('usuarios/resetPassword', {token,newPassword});
            return response;
        } catch (error) {
            
            return error;
        }finally{
            loading.value=false
        }
    };

    // const postResetPassword = async (token, newPassword) => {
    //     try {
    //         const response = await axios.post('usuarios/resetPassword', {
    //             token: token,
    //             newPassword: newPassword
    //         });
    //         return response;
    //     } catch (error) {
    //         console.error('Error en la solicitud:', error.response.data);
    //         throw error;
    //     }
    // };
    

    return { token, user, getUser, getUserActivos, getUserInactivos, postUser, login, logout, putUser, putUserActivar, putUserDesactivar, postRecuperarPassword,postResetPassword, loading };
}, {
    persist: true 
});
