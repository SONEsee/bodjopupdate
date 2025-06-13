import axios from "@/helpers/axios";
import { AttendanModel } from "~/models";
export const useStoreAttendenc = defineStore("attendenc", {
    state(){
        return{
response_data_attendenc: null as AttendanModel.GetIdentitiesResponse | null,
isloading: false,
        }

    },
    actions:{
        async getAttendec(){
            this.isloading = true;
            try {
                const res = await axios.get<AttendanModel.GetIdentitiesResponse>(`api/auth/attendances`);
                if(res.status ===200){
                    this.response_data_attendenc = res.data
                }
            } catch (error) {
                console.error("Error fetching attendenc data:", error);
                
            }finally{
                this.isloading = false;
            }
        }
    }
});