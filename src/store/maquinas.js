import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useMaquinaStore = defineStore("maquina", ()=>{

    
    const getMaquina = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/maquinas")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getMaquina}
})