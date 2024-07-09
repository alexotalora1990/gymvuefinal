

import { defineStore } from 'pinia';
import axios from 'axios';
import { TrackOpTypes, ref } from 'vue';

export const useUsuariosStore = defineStore('usuarios', () => {
    
    
    const token = ref('');
    const user = ref({});      

    const getUser = async () => {
        try {
            
            const response = await axios.get("usuarios");
            return response;
        } catch (error) {
            return error;
        }
    };

    const getUserActivos = async () => {
        try {
           
            const r = await axios.get("usuarios/activos");
            return r;
        } catch (error) {
            return error;
        }
    };

    const getUserInactivos = async () => {
        try {
            
            const r = await axios.get("usuarios/inactivos");
            return r;
        } catch (error) {
            return error;
        }
    };

    const postUser = async (user) => {
        try {
            
            const response = await axios.post("usuarios",user)
            return response.data;
            console.log(user);
        } catch (error) {
            return error;
        }
    };

    const login = async (email, password) => {
        try {
                       const response = await axios.post("usuarios/login",{ email, password });
            token.value = response.data.token;
            user.value = response.data.usuario;
            return response;
        } catch (error) {
            throw new Error('Error en el inicio de sesión');
        }
    };

    const logout = () => {
        token.value = '';
        user.value = {};
    };

    const putUser = async (id, user) => {
        try {
           
            const response = await axios.put(`usuarios/${id}`, user, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const putUserActivar = async (id) => {
        try {
           
            const response = await axios.put(`usuarios/activar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const putUserDesactivar = async (id) => {
        try {
       
            const response = await axios.put(`usuarios/desactivar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const postRecuperarPassword=async(email)=>{
        try {
        
            const response= await axios.post('usuarios/recuperarPassword', {email});
            return response;
        } catch (error) {
            
            return error;
        }
    };

    const postResetPassword=async(token, newPassword)=>{
        try {
            
            const response= await axios.post('usuarios/resetPassword', {token,newPassword});
            return response;
        } catch (error) {
            
            return error;
        }
    };

   
    

    return { token, user, getUser, getUserActivos, getUserInactivos, postUser, login, logout, putUser, putUserActivar, putUserDesactivar, postRecuperarPassword,postResetPassword};
}, {
    persist: true 
});
