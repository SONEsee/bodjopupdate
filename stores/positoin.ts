import axios from "@/helpers/axios";
import { PositionModel } from "@/models";
export const usePositoinStore = defineStore("positoin", {
  state() {
    return {
      respons_data_positoin: null as PositionModel.PositoinRespons | null,
      resposn_detail_data_positoin:
        null as PositionModel.PositoinRespons | null,

      isloading: false,
      error: null as string | null,
      form_create_positoin: {
        position_name: "",
        salary_rate: "",
        ot_rate: "",
      },
      form_uadate_positoin: {
        position_name: "",
        salary_rate: "",
        ot_rate: "",
      },
    };
  },
  actions: {
    async Update(id: number) {
      this.isloading = true;
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: "ທ່ານຕອ້ງການລົບຂໍ້ມູນນີແທ້ບໍ",
          showConfirmButton: true,
        });
        if (notification.isConfirmed) {
          let req = {
            position_name: this.form_uadate_positoin.position_name,
            salary_rate: this.form_uadate_positoin.salary_rate,
            ot_rate: this.form_uadate_positoin.ot_rate,
          };
          const res = await axios.put(`api/auth/positions/${id}/`, req);
          if (res.status === 200) {
            CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານແກ້ໄຂຂໍ້ມູນສຳເລັດ",
              icon: "success",
            });
            setTimeout(() => {
              goPath(`/position`);
            }, 1500);
          }
        }
      } catch (error) {
        console.error;
      } finally {
        this.isloading = false;
      }
    },
    async getData() {
      this.isloading = true;
      this.error = null;
      try {
        const res = await axios.get<PositionModel.Positoin>(
          `api/auth/positions/`
        );
        if (res.status === 200) {
          this.respons_data_positoin = res.data;
        }
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
      } finally {
        this.isloading = false;
      }
    },
    async getDataDetail(id: number) {
      this.isloading = true;
      try {
        const res = await axios.get<PositionModel.PositoinRespons>(
          `api/auth/positions/${id}`
        );
        if (res.status === 200) {
          this.resposn_detail_data_positoin = res.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isloading = false;
      }
    },
    async createPosition() {
      this.isloading = true;
      try {
        const req = await axios.post<PositionModel.PositoinRespons>(
          `api/auth/positions/`,
          this.form_create_positoin
        );
        {
          if (req.status === 201) {
            CallSwal({
              icon: "success",
              title: "ສຳເລັດ",
              text: "ທ່ານເພີ່ມຂໍ້ມູນສຳເລັດແລ້ວ.",
              showConfirmButton: false,
            });
            setTimeout(() => {
              goPath("/position");
            }, 1500);
          }
        }
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
      } finally {
        this.isloading = false;
      }
    },
    async deletPosition(id: number) {
      this.isloading = true;
      try {
      } catch (error) {
        console.error;
      } finally {
        this.isloading = false;
      }
      const notification = await CallSwal({
        icon: "warning",
        title: "ຄຳເຕືອນ",
        text: "ທ່າຕອ້ງການລົບຂໍ້ມຄນນີ້ແທ້ບໍ?",
        showCloseButton: true,
        showCancelButton:true,
      });
      if (notification.isConfirmed) {
        const res = await axios.delete(`api/auth/positions/${id}/`);
        if (res.status === 204) {
          CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານ ລຶບ ຂໍ້ມູນ ສຳເລັດ",
            icon: "success",
          });
          setTimeout(() => {
            goPath(`/position`);
          }, 1500);
        }
      }
    },
  },
});
