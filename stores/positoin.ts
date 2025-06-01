import axios from "@/helpers/axios";
import { PositionModel } from "@/models";
export const usePositoinStore = defineStore('positoin',{
    state(){
        return{
            respons_data_positoin: null as PositionModel.PositoinRespons | null,
            isloading: false,
            error: null as string | null,
            form_create_positoin: {
                position_name: '',
                salary_rate: '',
                ot_rate: ''
            }
        }
        
    
    },
    actions:{
async getData(){
    this.isloading = true;
    this.error = null;
    try {
        const res = await axios.get<PositionModel.Positoin>(`api/auth/positions/`);
        if(res.status===200){
            this.respons_data_positoin = res.data
        }
    } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unexpected error occurred';
        
    }finally{
        this.isloading = false;
    }
},
async createPosition(){
    this.isloading = true;
    try {
        const req = await axios.post<PositionModel.PositoinRespons>(`api/auth/positions/`,this.form_create_positoin);{
            if(req.status ===201){
                CallSwal({
                    icon: 'success',
                    title: 'ສຳເລັດ',
                    text: 'ທ່ານເພີ່ມຂໍ້ມູນສຳເລັດແລ້ວ.',
                    showConfirmButton: false,
                   
                });
                setTimeout(() => {
                    goPath('/position');
                }, 1500);
            }
        }
    } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unexpected error occurred';
        
    }finally{
        this.isloading = false;
    }
}
        }
})