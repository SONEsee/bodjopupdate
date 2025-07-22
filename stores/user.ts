import axios from "@/helpers/axios";
import { UserModel } from "@/models/";
import { defineStore } from "pinia";

export const UserStore = defineStore("user", {
  state() {
    return {
      loading: false,
      respons_data_query: null as UserModel.Data | null,
      
      
      user_detail: null as UserModel.User | null,
      
      // ຟອມສ້າງຜູ້ໃຊ້
      form_create_user: {
        username: "",
        email: "",
        password: "",
        role_id: null as number | null,
        employee_id: null as number | null,
        profile_image: null as string | File | null,
      },
      
      // ຟອມອັບເດດຜູ້ໃຊ້
      form_update_user: {
       
        username: "",
        email: "",
        password: "", 
        role_id: null as number | null |string,
        employee_id: null as number | null,
        profile_image: null as string | File | null,
        
      },
      
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
    };
  },

  actions: {
    // ດຶງລາຍການຢູ້ໃຊ້
    async getUser() {
      this.loading = true;
      try {
        this.request_query_data.loading = true;
        const res = await axios.get<UserModel.UserListRespons>(`/api/auth/users/`, {
          params: {
            ...this.request_query_data,
          },
        });
        if (res.status === 200) {
          this.respons_data_query = res.data.data;
          console.log(this.respons_data_query);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.request_query_data.loading = false;
        this.loading = false;
      }
    },

    // ດຶງຂໍ້ມູນລາຍລະອຽດຜູ້ໃຊ້
    async getUserDetail(userId: number) {
      this.loading = true;
      try {
        const res = await axios.get<{data: UserModel.User}>(`/api/auth/users/${userId}`);
        if (res.status === 200) {
          this.user_detail = res.data.data;
          // ຕື່ມຂໍ້ມູນໃສ່ຟອມອັບເດດ
          this.fillUpdateForm(this.user_detail);
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ໃຊ້ໄດ້",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    // ສ້າງຜູ້ໃຊ້ໃໝ່
    async createUser() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('username', this.form_create_user.username);
        formData.append('email', this.form_create_user.email);
        formData.append('password', this.form_create_user.password);

        if (this.form_create_user.role_id) {
          formData.append('role_id', this.form_create_user.role_id.toString());
        }

        if (this.form_create_user.employee_id) {
          formData.append('employee_id', this.form_create_user.employee_id.toString());
        }

        if (this.form_create_user.profile_image instanceof File) {
          formData.append('profile_image', this.form_create_user.profile_image);
        }

        const req = await axios.post(`/api/auth/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (req.status === 201) {
          const notification = await CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານສ້າງຜູ້ໃຊ້ສຳເລັດ",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "OK",
          });

          if (notification.isConfirmed) {
            this.resetCreateForm();
            // ອັບເດດລາຍການຜູ້ໃຊ້
            await this.getUser();
          }
        }
      } catch (error) {
        console.error("Error creating user:", error);
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດສ້າງຜູ້ໃຊ້ໄດ້",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    // ອັບເດດຜູ້ໃຊ້
    async updateUser() {
      if (!this.form_update_user.id) {
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ພົບ ID ຜູ້ໃຊ້",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('username', this.form_update_user.username);
        formData.append('email', this.form_update_user.email);
        formData.append('status', this.form_update_user.status.toString());

        // ພາດເວີດສຳລັບອັບເດດ (ບໍ່ບັງຄັບ)
        if (this.form_update_user.password && this.form_update_user.password.trim() !== '') {
          formData.append('password', this.form_update_user.password);
        }

        if (this.form_update_user.role_id) {
          formData.append('role_id', this.form_update_user.role_id.toString());
        }

        if (this.form_update_user.employee_id) {
          formData.append('employee_id', this.form_update_user.employee_id.toString());
        }

        // ຖ້າມີຮູບໃໝ່
        if (this.form_update_user.profile_image instanceof File) {
          formData.append('profile_image', this.form_update_user.profile_image);
        }

        const req = await axios.put(`/api/auth/users/${this.form_update_user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (req.status === 200) {
          const notification = await CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານອັບເດດຜູ້ໃຊ້ສຳເລັດ",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "OK",
          });

          if (notification.isConfirmed) {
            // ອັບເດດລາຍການ
            await this.getUser();
            // ອັບເດດຂໍ້ມູນລາຍລະອຽດ
            if (this.form_update_user.id) {
              await this.getUserDetail(this.form_update_user.id);
            }
          }
        }
      } catch (error) {
        console.error("Error updating user:", error);
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດອັບເດດຜູ້ໃຊ້ໄດ້",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    // ລຶບຜູ້ໃຊ້
    async deleteUser(userId: number, username: string) {
      // ຢືນຢັນກ່ອນລຶບ
      const confirmation = await CallSwal({
        title: "ຢືນຢັນການລຶບ",
        text: `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ໃຊ້ "${username}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ລຶບ",
        cancelButtonText: "ຍົກເລີກ",
        confirmButtonColor: "#d33",
      });

      if (!confirmation.isConfirmed) {
        return;
      }

      this.loading = true;
      try {
        const req = await axios.delete(`/api/auth/users/${userId}`);

        if (req.status === 200 || req.status === 204) {
          await CallSwal({
            title: "ສຳເລັດ",
            text: "ລຶບຜູ້ໃຊ້ສຳເລັດ",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "OK",
          });

          // ອັບເດດລາຍການ
          await this.getUser();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດລຶບຜູ້ໃຊ້ໄດ້",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    
    fillUpdateForm(user: UserModel.User) {
      this.form_update_user = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: "", // ປະໄວ້ເປົ່າສຳລັບອັບເດດ
        role_id: user.role,
        employee_id: user.employee_id,
        profile_image: user.profile_image, // URL ຂອງຮູບເກົ່າ
        status: user.status,
      };
    },

    // ລີເຊັດຟອມສ້າງ
    resetCreateForm() {
      this.form_create_user = {
        username: "",
        email: "",
        password: "",
        role_id: null,
        employee_id: null,
        profile_image: null,
      };
    },

    // ລີເຊັດຟອມອັບເດດ
    resetUpdateForm() {
      this.form_update_user = {
        id: null,
        username: "",
        email: "",
        password: "",
        role_id: null,
        employee_id: null,
        profile_image: null,
        status: true,
      };
    },

    // ລີເຊັດຂໍ້ມູນລາຍລະອຽດ
    clearUserDetail() {
      this.user_detail = null;
      this.resetUpdateForm();
    }
  },
});