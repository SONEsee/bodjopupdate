import axios from "@/helpers/axios";
import { PositionModel } from "~/models";
export const useReportStore = defineStore("report", {
    state(){
        return{
            resposn_ngernuen_data:null as PositionModel.NgernduenRespons | null,
            isloading: false,
        }
    },
    actions: {
        async getNgernuenData() {
            this.isloading = true;
            try {
                const res = await axios.get("/api/auth/cal_payrolls");
                if (res.status === 200) {
                    this.resposn_ngernuen_data = res.data;
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.isloading = false;
            }
        },
    },
});