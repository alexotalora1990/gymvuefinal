
import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useIncomeStore = defineStore("ingresos", ()=>{

    
    const getIncome= async()=>{
        try {
            const res = await axios.get("ingresos")
            return res
        } catch (error) {
            return error 
        }
    };
    const postIncome= async(ingreso)=>{
        try {
            const newIncome=await axios.post("ingresos", ingreso)
            return newIncome
        } catch (error) {
            return error            
        }
    };
    const putIncome=async(id,ingreso)=>{
        try {
            const upadteIncome= await axios.put(`ingresos/${id}`, ingreso)
            return upadteIncome
        } catch (error) {
            
        }
    }

    return{ getIncome, postIncome, putIncome}
})