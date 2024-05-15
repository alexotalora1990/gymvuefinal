import{defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useSedesStore=defineStore("sedes", ()=>{

    const getSede= async()=>{
        try {
            const res= await axios.get("http://localhost:4000/api/sedes")
            return res.data
        } catch (error) {
            return error
        }
    };
    return{getSede}
});