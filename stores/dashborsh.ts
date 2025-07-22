import axios from "@/helpers/axios";
import { DashBoardAdminModel } from "~/models";
export const useDashBoardStore = defineStore("dashboard", {
    state(){
        return{
            response_data_absent: null as DashBoardAdminModel.AbsentRespons | null,
            isloading: false,
        }
    },
    actions: {
        async getAbsentden() {
            this.isloading = true;
            try {
                const res = await axios.get<DashBoardAdminModel.AbsentRespons>(`/api/auth/attendances/absent-month`);
                if (res.status === 200) {
                    this.response_data_absent = res.data;
                }
            } catch (error) {
                console.error("Error fetching absent data:", error);
            } finally {
                this.isloading = false;
            }
        },
    },
});