import axios from "@/helpers/axios";
import { SchedulesModel } from "~/models";
import Update from "~/pages/category/update.vue";

export const useSchedulesStore = defineStore("schedules", {
  state() {
    return {
      respons_data_schedules: null as SchedulesModel.ResponeSchedules | null,
      resposns_data_schedules_detail: null as SchedulesModel.ResponeSchedulesDetail | null,
      isloading: false,
      error: null as string | null,
      create_form_data: {
        shift_start: "",
        shift_end: "",
      },
      update_form_data: {
        shift_start: "",
        shift_end: "",
      },
    };
  },

  actions: {
    async UpdateSchedules(id: number) {
        this.isloading = true;
        try {
            const notification = await CallSwal({
                title: "ຢືນຢັນການອັບເດດ",
                text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະອັບເດດ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "ແນ່ໃຈ",
                cancelButtonText: "ຍົກເລີກ",
            });if(notification.isConfirmed){
                let req = {
                    shift_start: this.update_form_data.shift_start,
                    shift_end: this.update_form_data.shift_end,
                }
                const res = await axios.put<SchedulesModel.ResponeSchedules>(
                    `/api/auth/schedules/${id}/`,
                    req
                );
                if (res.status === 200) {
                    this.respons_data_schedules = res.data;
                    CallSwal({
                        title: "ສຳເລັດ",
                        text: "ທ່ານໄດ້ອັບເດດແລ້ວ",
                        icon: "success",
                    });
                    setTimeout(() => {
                        goPath("/schedules");
                    }, 1000);
                }
                
            }
        } catch (error: any) {
            console.error("ຂໍ້ຜິດພາດໃນການອັບເດດ:", error);
            this.error = "ຂໍ້ຜິດພາດໃນການອັບເດດ";
            
        }finally{
            this.isloading = false;
        }
    },

    async GetdataDetail(id:number){
this.isloading = true;
try {
    const res = await axios.get<SchedulesModel.ResponeSchedulesDetail>(`/api/auth/schedules/${id}/`);
    if(res.status ===200){
        this.resposns_data_schedules_detail = res.data
    }
} catch (error: any) {
    console.error("ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດ:", error);
    this.error = "ຂໍ້ຜິດພາດໃນການດຶງ";
    
}finally{

}
    },
    async CreateSchedules() {
      this.isloading = true;
      try {
        const req = await axios.post<SchedulesModel.ResponeSchedules>(
          `/api/auth/schedules`,
          this.create_form_data
        );if (req.status === 201) {
            this.respons_data_schedules = req.data;
            CallSwal({
                title: "ສຳເລັດ",
                text: "ທ່ານໄດ້ເພີ່มແລ້ວ",
                icon: "success",
            });
            setTimeout(() => {
                goPath("/schedules");
            }, 1000);
            
        }
      } catch (error: any) {
        console.error("ຂໍ້ຜິດພາດໃນການສ້າງຕາຕະລາງເວລາ:", error);
        this.error = "ຂໍ້ຜິດພາດໃນການສ້າງ";
      } finally {
        this.isloading = false;
      }
    },
    async GetData() {
      this.isloading = true;

      try {
        const res = await axios.get<SchedulesModel.ResponeSchedules>(
          `/api/auth/schedules/`
        );

        if (res.status === 200) {
          this.respons_data_schedules = res.data;
          console.log("ດຶງຂໍ້ມູນຕາຕະລາງເວລາສຳເລັດ:", res.data);
        }
      } catch (error: any) {
        console.error("ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຕາຕະລາງເວລາ:", error);

        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",

          icon: "error",
        });
      } finally {
        this.isloading = false;
      }
    },
    async DeleteSchedules(id: number) {
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຢືນຢັນການລຶບ",
          text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະລຶບ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ແນ່ໃຈ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (notification.isConfirmed) {
          const res = await axios.delete(`/api/auth/schedules/${id}/`);
          if (res.status === 204) {
            CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານໄດ້ລຶບແລ້ວ",
              icon: "success",
            });
            setTimeout(() => {
              goPath("/schedules");
            }, 1000);
          }
        }
      } catch (error: any) {
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດລຶບໄດ້ ເພາະວ່າຂໍ້ມູນນີ້ຍັງເຊື່ອມກັບຂໍ້ມູນອື່ນເຊັ່ນ: ພະນັກງານ, ຕາຕະລາງເວລາ",
          icon: "error",
        });
        console.error("Error deleting schedule:", error);
        this.error = "Error deleting schedule";
      } finally {
        this.isloading = false;
      }
    },
  },
});
