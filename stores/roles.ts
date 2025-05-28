import { RoleModel } from "~/models";
import axios from "@/helpers/axios";
export const useRoleStore = defineStore("role", {
  state() {
    return {
      form_create_data: {
        name: "",
        description: "",
      },
      form_update_data: {
        name: "",
        description: "",
      },
      response_data_role: null as RoleModel.RoleRespons | null,
      response_data_role_detail: null as RoleModel.RoleDetailRespons | null,
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
    async getRole() {
      this.isloading = true;
      try {
        this.request_query_data.loading = true;
        const res = await axios.get<RoleModel.RoleRespons>(`api/auth/role/`, {
          params: {
            ...this.request_query_data,
          },
        });
        if (res.status === 200) {
          this.response_data_role = res.data;
        }
      } catch (error) {
      } finally {
        this.isloading = false;
        this.request_query_data.loading = false;
      }
    },
    async CreateRole() {
      this.isloading = true;
      try {
        const req = await axios.post(`api/auth/role`, this.form_create_data);
        if(req.status === 200){
      //       CallSwal({
      //   title: "ສຳເລັດ",
      //   text: "ທ່ານສ້າງທຸກຢາງສຳເລັດ",
      //   icon: "success",
        
        
      // });
      const notification =await CallSwal({
          title: "ສຳເລັດ",
          text: "ທ່ານສ້າງທຸກຢາງສຳເລັດ",
          icon: "success",
          
          showConfirmButton: true,
          confirmButtonText: "ຕົກລົງ",
      });if(notification.isConfirmed){
        setTimeout(() => {
            goPath(`/role`)
          }, 1500);
        }
      }
      
      } catch (error) {
      } finally {
        this.isloading = false;
      }
    },
    async getRoleDetail(id: number) {
      this.isloading = true;
      try {
        const res  = await axios.get<RoleModel.RoleDetailRespons>(`api/auth/role/${id}`);
        if(res.status ===200){
          this.response_data_role_detail = res.data
        }
      } catch (error) {
        CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນລາວລະອຽດໄດ້",
          icon: "error",
        })
      }finally {
        this.isloading = false;
      }
    },
    async UpdateRole(id:number){
      this.isloading = true;
      try {
      const notification = await CallSwal({
        title:"ຄຳເຕືອນ",
        text: "ທ່ານແນ່ໃຈຫຼືບໍວ່າຈະອັບເດດຂໍ້ມູນນີ້",
        icon: "warning",
         showCancelButton: true,
         confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ບໍ່ແກ້ໄຂ",
      });
      if(notification.isConfirmed){
        let req = {
          name: this.form_update_data.name,
          description: this.form_update_data.description,
        };
        const res =  await axios.put(`api/auth/role/${id}`, req);
        if(res.status ===200){
          CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານແກ້ໄຂຂໍ້ມູນສຳເລັດ",
            icon: "success",
          });
          setTimeout(() => {
            goPath(`/role`)
          }, 1500);
        }
      }
      } catch (error) {
      } finally {
        this.isloading = false;
      }
    },
    async DeleteRole(id: number) {
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຄຳເຕືອນ",
          text: "ທ່ານແນ່ໃຈຫຼືບໍວ່າຈະລຶບ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ບໍ່ແກ້ໄຂ",
        });
        if (notification.isConfirmed) {
          const res = await axios.delete(`api/auth/role/${id}`);
          if (res.status === 200) {
            CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານ ລຶບ ຂໍ້ມູນ ສຳເລັດ",
              icon: "success",
            });
            setTimeout(() => {
              goPath(`/role`);
            }, 1500);
          }
        }
      } catch (error) {
        CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດ ລຶບ ຂໍ້ມູນ ສາມາດ ລຶບ ຂໍ້ມູນ ສາມາດ ລຶບ ຂໍ້ມູນ",
          icon: "error",
        });
      }
      }
      
  },
});
