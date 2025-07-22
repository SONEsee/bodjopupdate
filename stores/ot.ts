import { OTModel } from "~/models";
import axios from "@/helpers/axios";
export const otStore = defineStore("ot",{
    state(){
        return{
response_data_response_ot: null as OTModel.TotalOtRespons| null,
response_data_ot: null as OTModel.OtRespons[] | null,
response_data_salary: null as OTModel.Datum| null,
response_employee_data: null as OTModel.EmployeeRespons | null,
   id: (() => {
                const employeeId = localStorage.getItem("employee_id");
                console.log("Employee ID from localStorage:", employeeId); 
                return employeeId ? parseInt(employeeId) : 0;
            })(),
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
        },
        async getOt(){
            this.isloading = true;
            try {
                const res = await axios.get<OTModel.OtRespons[]>(`/api/auth/special-allowances/`);
                if(res.status ===200){
                    this.response_data_ot = res.data
                }
            } catch (error) {
                console.error("Error fetching OT:", error);
                
            }finally{
                this.isloading = false;
            }
        },
        async getSalary(){
            this.isloading = true;
            try {
                const res = await axios.get<OTModel.Datum>(`/api/auth/cal_payrolls`);
                if(res.status ===200){
                    this.response_data_salary = res.data
                    console.log("Salary data:", this.response_data_salary);
                }
            } catch (error) {
                console.error("Error fetching Salary:", error);
                
            }finally{
                this.isloading = false;
            }
        },
        async getSalaryMy(){
            this.isloading = true;
            try {
                const res = await axios.get<OTModel.Datum>(`/api/auth/cal_payrolls/${this.id}`);
                if(res.status ===200){
                    this.response_data_salary = res.data
                    console.log("Salary data:", this.response_data_salary);
                }
            } catch (error) {
                console.error("Error fetching Salary:", error);
                
            }finally{
                this.isloading = false;
            }
        },
        async employeeMy(){
            this.isloading = true;
            try {
                const res = await axios.get<OTModel.EmployeeRespons>(`/api/auth/employees/${this.id}`);
                if(res.status ===200){
                    this.response_employee_data= res.data
                    console.log("Salary data:", this.response_data_salary);
                }
            } catch (error) {
                console.error("Error fetching Salary:", error);
                
            }finally{
                this.isloading = false;
            }
        },
    }
})
