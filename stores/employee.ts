import { EmployeeModel } from "~/models";
import axios from "@/helpers/axios";
export const useEmployeeStore = defineStore("employee", {
  state(){
    return{
      respons_data_employee: null as EmployeeModel.ResponeEmployee |null,
      respone_detail_data: null as EmployeeModel.ResponeDetailEmployee | null,
      isloading:false
    }
  },
actions:{
  async getDataEmployee(){
    this.isloading = true
    try {
      const res = await axios.get(`api/auth/employees`);
      if(res.status ===200){
        this.respons_data_employee = res.data
      }
    } catch (error) {
      console.error
    }finally{
      this.isloading= false
    }
  },
  async getDetailData(id: number){
    this.isloading = true
    try {
      const res = await axios.get(`api/auth/employees/${id}`);
      if (res.status===200){
        this.respone_detail_data = res.data
      }
    } catch (error) {
      CallSwal({
        title:"ເກີດຂໍ້ຜິດພາດ",
        icon:"error",
        text:"ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ"
      })
    }
  }
}

//   state: () => ({
//     form_create_data: {
//       name: "",
//       gender: "",
//       birthdate: "",
//       address: "",
//       phone: "",
//       schedule_id: null,
//       position_id: null,
//     },
//     form_update_data: {
//       name: "",
//       gender: "",
//       birthdate: "",
//       address: "",
//       phone: "",
//       schedule_id: null,
//       position_id: null,
//     },
//     response_data_employee: null as EmployeeModel.EmployeeResponse | null,
//     response_data_employee_detail: null as EmployeeModel.EmployeeResponse | null,
    
    
  })
// })
  // actions: {
  //   async getEmployees() {
  //     this.isloading = true;
  //     this.request_query_data.loading = true;
  //     try {
  //       const res = await axios.get<EmployeeModel.EmployeeResponse>(`api/auth/employees`, {
  //         params: this.request_query_data,
  //       });
  //       if (res.status === 200) {
  //         this.response_data_employee = res.data;
  //       }
  //     } catch (error) {
  //       console.error("Get Employees Error", error);
  //     } finally {
  //       this.isloading = false;
  //       this.request_query_data.loading = false;
  //     }
  //   },

  //   async getEmployeeDetail(id: number) {
  //     this.isloading = true;
  //     try {
  //       const res = await axios.get<EmployeeModel.EmployeeDetailResponse>(`api/auth/employees/${id}`);
  //       if (res.status === 200) {
  //         this.response_data_employee_detail = res.data;
  //       }
  //     } catch (error) {
  //       console.error("Get Employee Detail Error", error);
  //     } finally {
  //       this.isloading = false;
  //     }
  //   },

  //   async CreateEmployee() {
  //     this.isloading = true;
  //     try {
  //       const res = await axios.post(`api/auth/employees`, this.form_create_data);
  //       if (res.status === 200) {
  //         CallSwal({ title: "ສຳເລັດ", text: "ສ້າງພະນັກງານສຳເລັດ", icon: "success" });
  //       }
  //     } catch (error) {
  //       console.error("Create Employee Error", error);
  //     } finally {
  //       this.isloading = false;
  //     }
  //   },

  //   async UpdateEmployee(id: number) {
  //     this.isloading = true;
  //     try {
  //       const res = await axios.put(`api/auth/employees/${id}`, this.form_update_data);
  //       if (res.status === 200) {
  //         CallSwal({ title: "ສຳເລັດ", text: "ແກ້ໄຂສຳເລັດ", icon: "success" });
  //       }
  //     } catch (error) {
  //       console.error("Update Employee Error", error);
  //     } finally {
  //       this.isloading = false;
  //     }
  //   },

  //   async DeleteEmployee(id: number) {
  //     this.isloading = true;
  //     try {
  //       const res = await axios.delete(`api/auth/employees/${id}`);
  //       if (res.status === 200) {
  //         CallSwal({ title: "ສຳເລັດ", text: "ລຶບສຳເລັດ", icon: "success" });
  //       }
  //     } catch (error) {
  //       console.error("Delete Employee Error", error);
  //     } finally {
  //       this.isloading = false;
  //     }
  //   },
  // },
