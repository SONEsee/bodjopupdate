import axios from "@/helpers/axios";
 export const useTestStore = defineStore("test", {
  state() {
    return {
      reques_data_form: {
        name: "",
        icon: "",
      },
      isLoading: false,
    };
  },
  actions: {
    async createApp() {
      this.isLoading = true;
      try {
        const req = await axios.post(
          `api/auth/main_menu`,
          this.reques_data_form
        );
        if (req.status === 200 || req.status === 201) {
          CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ສຳເລັດກ່ານສ້າຂໍ້ມູນເມນູ",
            timer: 1000,
          });
        }
      } catch (error) {
        CallSwal({
            icon:"error",
            title:"ຜຶດພາດ",
            text:"ບໍ່ສາມາດສ້າງຂໍ້ມຸນໄດ້"
        })
      } finally {
        this.isLoading = false;
      }
    },
  },
});
