import { BasalaryModel } from "~/models";
import axios from "@/helpers/axios";

export const useBasalaryStore = defineStore("basalary", {
  state() {
    return {
      form_create_data: {
        salary: "",
      },
      form_update_data: {
        salary: "",
      },
      late_for_day:null as BasalaryModel.DataLate| null,
      response_data_basalary: null as BasalaryModel.BaseSalaryRespons | null,
      response_data_basalary_detail: null as BasalaryModel.BaseSalaryRespons| null,
      respose_data_total_late: null as BasalaryModel.Data | null,
      resposn_data_absent: null as BasalaryModel.AbsentRespons | null,
    
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
      isloading: false,
    };
  },
  actions: {
    async getAbsentden(){
this.isloading = true;
try {
  const res = await axios.get<BasalaryModel.AbsentRespons>(`/api/auth/attendances/absent-today`);
  if(res.status ===200){
    this.resposn_data_absent = res.data
  }
} catch (error) {
  console.error("Error fetching absent data:", error);
  
}finally{
  this.isloading = false;
}
    },
    async getLatedata(){
      this.isloading = true;
      try {
        const res = await axios.get<BasalaryModel.Data>(`api/auth/attendances/late-month/`);
        if (res.status === 200) {
          this.respose_data_total_late = res.data;
         
        }
      } catch (error) {
        console.error("Error fetching late data:", error);
      } finally {
        this.isloading = false;
      }
    },
    async getLatedataforday(){
      this.isloading = true;
      try {
        const res = await axios.get<BasalaryModel.DataLate>(`/api/auth/attendances/late-today`);
        if (res.status === 200) {
          this.late_for_day = res.data;
          console.log("respose_data_total_late", this.late_for_day);
        }
      } catch (error) {
        console.error("Error fetching late data:", error);
      } finally {
        this.isloading = false;
      }
    },
    async getBasalary() {
      this.isloading = true;
      try {
        const res = await axios.get<BasalaryModel.BaseSalaryRespons>(`api/auth/base_salary/`);
        if (res.status === 200) {
          this.response_data_basalary = res.data;
        }
      } catch (error) {
        console.error("Error fetching base salary data:", error);
      } finally {
        this.isloading = false;
      }
    },

    async CreateBasalary() {
      this.isloading = true;
      try {
        const req = await axios.post(`api/auth/base_salary/`, this.form_create_data);
        if(req.status === 200){
          const notification = await CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານສ້າງເງິນເດືອນພື້ນຖານສຳເລັດ",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "ຕົກລົງ",
          });
          if(notification.isConfirmed){
            setTimeout(() => {
              goPath(`/basalary`)
            }, 1500);
          }
        }
      } catch (error) {
        CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດສ້າງເງິນເດືອນພື້ນຖານໄດ້",
          icon: "error",
        });
      } finally {
        this.isloading = false;
      }
    },

    async getBasalaryDetail(id: number) {
      this.isloading = true;
      try {
        const res = await axios.get<BasalaryModel.BaseSalaryRespons>(`api/auth/base_salary/${id}`);
        if(res.status === 200){
          this.response_data_basalary_detail = res.data
          console.log("response_data_basalary_detail", this.response_data_basalary_detail);
        }
      } catch (error) {
        CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນລາຍລະອຽດເງິນເດືອນພື້ນຖານໄດ້",
          icon: "error",
        });
      } finally {
        this.isloading = false;
      }
    },

    async UpdateBasalary(id: number){
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຄຳເຕືອນ",
          text: "ທ່ານແນ່ໃຈຫຼືບໍວ່າຈະອັບເດດຂໍ້ມູນເງິນເດືອນພື້ນຖານນີ້",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ບໍ່ແກ້ໄຂ",
        });
        
        if(notification.isConfirmed){
          let req = {
            salary: this.form_update_data.salary,
          };
          const res = await axios.put(`api/auth/base_salary/${id}`, req);
          if(res.status === 200){
            CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານແກ້ໄຂຂໍ້ມູນເງິນເດືອນພື້ນຖານສຳເລັດ",
              icon: "success",
            });
            setTimeout(() => {
              goPath(`/basalary`)
            }, 1500);
          }
        }
      } catch (error) {
        CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນເງິນເດືອນພື້ນຖານໄດ້",
          icon: "error",
        });
      } finally {
        this.isloading = false;
      }
    },

    async DeleteBasalary(id: number) {
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຄຳເຕືອນ",
          text: "ທ່ານແນ່ໃຈຫຼືບໍວ່າຈະລຶບຂໍ້ມູນເງິນເດືອນພື້ນຖານນີ້",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ບໍ່ລຶບ",
        });
        
        if (notification.isConfirmed) {
          const res = await axios.delete(`api/auth/base_salary/${id}`);
          if (res.status === 200) {
            CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານລຶບຂໍ້ມູນເງິນເດືອນພື້ນຖານສຳເລັດ",
              icon: "success",
            });
            setTimeout(() => {
              goPath(`/basalary`);
            }, 1500);
          }
        }
      } catch (error) {
        CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດລຶບຂໍ້ມູນເງິນເດືອນພື້ນຖານໄດ້",
          icon: "error",
        });
      } finally {
        this.isloading = false;
      }
    },
  },
});