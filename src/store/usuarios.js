

// import { defineStore } from 'pinia';
// import axios from 'axios';
// import { ref } from 'vue';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// export const useUsuariosStore = defineStore('usuarios', () => {
//     const token = ref('');
//     const user = ref({});

//     const getUser = async () => {
//         try {
//             const response = await axios.get("http://localhost:4000/api/usuarios", {
               
//             });
//             return response;
//         } catch (error) {
//             return error;
//         }
//     };

//     const getUserActivos = async()=>{
//         try {
//             const r = await axios.get("http://localhost:4000/api/usuarios/activos",{
              
//         });
//             return r
//         } catch (error) {
//             return error
//         }
//     };
//     const getUserInactivos = async()=>{
//         try {
//             const r = await axios.get("http://localhost:4000/api/usuarios/inactivos",{
               
//         });
//             return r
//         } catch (error) {
//             return error
//         }
//     };

    

//     const postUser = async (newUser) => {
//         try {
//             const response = await axios.post("http://localhost:4000/api/usuarios", newUser, {
//                 headers: { Authorization: `Bearer ${token.value}` }
//             });
//             return response;
//         } catch (error) {
//             return error;
//         }
//     };

//     const login = async (email, password) => {
//         try {
//             const response = await axios.post("http://localhost:4000/api/usuarios/login", { email, password });
//             token.value = response.data.token;
//             user.value = response.data.usuario;
//             return response;
//         } catch (error) {
//             return error;
//         }
//     };

//     const putUser = async (id, updatedUser) => {
//         try {
//             const response = await axios.put(`http://localhost:4000/api/usuarios/${id}`, updatedUser, {
//                 headers: { Authorization: `Bearer ${token.value}` }
//             });
//             return response;
//         } catch (error) {
//             return error;
//         }
//     };

//     const putUserActivar = async (id) => {
//         try {
//             const response = await axios.put(`http://localhost:4000/api/usuarios/activar/${id}`, {}, {
//                 headers: { Authorization: `Bearer ${token.value}` }
//             });
//             return response;
//         } catch (error) {
//             return error;
//         }
//     };

//     const putUserDesactivar = async (id) => {
//         try {
//             const response = await axios.put(`http://localhost:4000/api/usuarios/desactivar/${id}`, {}, {
//                 headers: { Authorization: `Bearer ${token.value}` }
//             });
//             return response;
//         } catch (error) {
//             return error;
//         }
//     };

   

//     return { token, user, getUser,getUserActivos,getUserInactivos, postUser, login, putUser, putUserActivar, putUserDesactivar};
// }, {
//     persist: true 
// });



import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useUsuariosStore = defineStore('usuarios', () => {
    const token = ref('');
    const user = ref({});

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/usuarios");
            return response;
        } catch (error) {
            return error;
        }
    };

    const getUserActivos = async () => {
        try {
            const r = await axios.get("http://localhost:4000/api/usuarios/activos");
            return r;
        } catch (error) {
            return error;
        }
    };

    const getUserInactivos = async () => {
        try {
            const r = await axios.get("http://localhost:4000/api/usuarios/inactivos");
            return r;
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
            throw new Error('Error en el inicio de sesión');
        }
    };

    const logout = () => {
        token.value = '';
        user.value = {};
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

    return { token, user, getUser, getUserActivos, getUserInactivos, postUser, login, logout, putUser, putUserActivar, putUserDesactivar };
}, {
    persist: true 
});
