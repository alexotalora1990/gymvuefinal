import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useIncomeStore = defineStore("ingresos", ()=>{

    
    const getIncome= async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/ingresos")
            return res
        } catch (error) {
            return error 
        }
    };
    const postIncome= async(income)=>{
        try {
            const newIncome=await axios.post("http://localhost:4000/api/ingresos", income)
            return newIncome
        } catch (error) {
            return error            
        }
    };
    const putIncome=async(id,income)=>{
        try {
            const upadteIncome= await axios.put(`http://localhost:4000/api/ingresos/${id}`, income)
        } catch (error) {
            
        }
    }

    return{ getIncome, postIncome, putIncome}
})