import axios from "@/helpers/axios";
import { AttednancesModel } from "~/models";
export const useAttendanStore = defineStore("attendan", {
    state(){
        return{
            respons_data_attendan: null as AttednancesModel.AttendancesRespons | null,
            isloading: false,
            id: (() => {
                const employeeId = localStorage.getItem("employee_id");
                console.log("Employee ID from localStorage:", employeeId); 
                return employeeId ? parseInt(employeeId) : 0;
            })(),
        }
        
    },
    actions:{
        async getData(){
            this.isloading = true;
            try {
                const res = await axios.get<AttednancesModel.AttendancesRespons>("/api/auth/attendances/");
                if (res.status === 200) {
                    this.respons_data_attendan = res.data;
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            } finally {
                this.isloading = false;
            }
        },
        async getDatamy(){
            this.isloading = true;
            try {
                const res = await axios.get<AttednancesModel.AttendancesRespons>(`/api/auth/attendances/emp/${this.id}`);
                if (res.status === 200) {
                    this.respons_data_attendan = res.data;
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            } finally {
                this.isloading = false;
            }
        }
    }
})