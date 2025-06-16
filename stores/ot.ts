import { OTModel } from "~/models";
import axios from "@/helpers/axios";
export const otStore = defineStore("ot",{
    state(){
        return{
response_data_response_ot: null as OTModel.TotalOtRespons| null,
isloading: false,
        }
    },
    actions:{
        async getOtTotal(){ 
            this.isloading= true;
            try {
                const res = await axios.get<OTModel.TotalOtRespons>(`api/auth/payrolls_total_ot`);
                if(res.status ===200){
                    this.response_data_response_ot = res.data;
                }
            } catch (error) {
                console.error("Error fetching OT total:", error);
                
            }finally{
                this.isloading = false;
            }
        }
    }
})
