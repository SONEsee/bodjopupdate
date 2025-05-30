import axios from "@/helpers/axios";
import { MenuModel, MainModel } from "~/models";

const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

export const useMenuStore = defineStore("menu", {
  state() {
    return {
      respons_data_menu: null as MenuModel.MenuRespons | null,
      respons_data_main_menu: null as MainModel.MenuMainRespons[] | null,
      respons_data_detail_main_menu: null as MainModel.DetailMainRespons | null,
      respons_sup_menu: null as MainModel.SupMenuRespons[] | null,
      respone_sup_menu_detail: null as MainModel.SupMenuRespons | null,
      user_data: null as any,
      user_id: null as string | null,
      isloading: false,
      form_create_data: {
        name: "",
        icon: "",
      },
      form_create_supmenu_data: {
        main_id: 0,
        name: "",
        icon: "",
        url: "",
      },
      form_update_supmenu_data: {
        main_id: 0,
        name: "",
        icon: "",
        url: "",
      },
      form_update_data: {
        name: "",
        icon: "",
      },
    };
  },

  actions: {
    loadUserData() {
      const userData = getUserFromStorage();
      if (userData) {
        this.user_data = userData;
        this.user_id = userData.id?.toString() || null;
      }
    },

    async getMenu() {
      if (!this.user_id) {
        this.loadUserData();
      }

      if (!this.user_id) {
        console.error("No user ID found");
        return;
      }

      this.isloading = true;
      try {
        const res = await axios.get<MenuModel.MenuRespons>(
          `api/auth/user-menu/${this.user_id}/`
        );
        if (res.status === 200) {
          this.respons_data_menu = res.data;
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        this.isloading = false;
      }
    },
    async getMainMenu() {
      this.isloading = true;
      try {
        const res = await axios.get<MainModel.MenuMainRespons[]>(
          `api/auth/main_menu`
        );
        if (res.status === 200) {
          this.respons_data_main_menu = res.data;
        }
      } catch (error) {
        console.error("Error fetching main menu:", error);
      } finally {
        this.isloading = false;
      }
    },
    async creatMainmenu() {
      this.isloading = true;
      try {
        const req = await axios.post(
          `api/auth/main_menu`,
          this.form_create_data
        );
        if (req.status === 201) {
          const notification = await CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານສ້າງທຸກຢາງສຳເລັດ",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "ຕົກລົງ",
          });
          if (notification.isConfirmed) {
            setTimeout(() => {
              goPath(`/mainmenu`);
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Error creating main menu:", error);
      } finally {
        this.isloading = false;
      }
    },
    async getDetailMainMenu(id: number) {
      this.isloading = true;
      try {
        const res = await axios.get<MainModel.DetailMainRespons>(
          `api/auth/main_menu/${id}/`
        );
        if (res.status === 200) {
          this.respons_data_detail_main_menu = res.data;
        }
      } catch (error) {
        console.error("Error fetching detail main menu:", error);
      } finally {
        this.isloading = false;
      }
    },
    async updateMainMenu(id:number){
this.isloading = true;
try {
  const notification =  await CallSwal({
    title: "ຢືນຢັນ",
    text: "ທ່ານຕ້ອງການປ່ຽນແປງຂໍ້ມູນ ຫຼື ບໍ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
  });if(notification.isConfirmed){
    let req = {
      name: this.form_update_data.name,
      icon: this.form_update_data.icon,
    }
    const res = await axios.put(`api/auth/main_menu/${id}/`, req);
    if (res.status === 200) {
      const notification = await CallSwal({
        title: "ສຳເລັດ",
        text: "ທ່ານແກ້ໄຂຂໍ້ມູນ ສຳເລັດ",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "ຕົກລົງ",
      });
      if (notification.isConfirmed) {
        setTimeout(() => {
          goPath(`/mainmenu`);
        }, 1500);
      }
    }
  }
} catch (error) {
  console.error("Error updating main menu:", error);
  
}finally{
  this.isloading = false;
}
    },
    async deleteMainMenu(id: number) {
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຢືນຢັນ",
          text: "ທ່ານຕ້ອງການລຶບ ຫຼື ບໍ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ລຶບ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (notification.isConfirmed) {
          const res = await axios.delete(`api/auth/main_menu/${id}/`);
          if (res.status === 204) {
            const notification = await CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານໄດ້ລຶບ ສໍາເລັດ",
              icon: "success",
              showConfirmButton: true,
              confirmButtonText: "ຕົກລົງ",
            });
            if (notification.isConfirmed) {
              setTimeout(() => {
                goPath(`/mainmenu`);
              }, 1500);
            }
          }
        }
      } catch (error) {
        console.error("Error deleting main menu:", error);
      } finally {
        this.isloading = false;
      }
    }
    ,
    async getSupmenu(){
      this.isloading = true;
      try {
        const res = await axios.get<MainModel.SupMenuRespons[]>(
          `api/auth/sub_menus`
        );
        if (res.status === 200) {
          this.respons_sup_menu = res.data;
        }
      } catch (error) {
        console.error("Error fetching sub menu:", error);
      } finally {
        this.isloading = false;
      }
    },
    async createSupmenu(){
      this.isloading = true;
      try {
        const req = await axios.post(
          `api/auth/sub_menus`,
          this.form_create_supmenu_data
        );
        if (req.status === 201) {
          const notification = await CallSwal({
            title: "ສຳເລັດ",
            text: "ທ່ານສ້າງຂໍ້ມູນ ສຳເລັດ",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "ຕົກລົງ",
          });
          if (notification.isConfirmed) {
            setTimeout(() => {
              goPath(`/supmenu`);
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Error creating sub menu:", error);
      } finally {
        this.isloading = false;
      }
    },
    async getDetail(id: number) {
this.isloading=true;
try {
  const res =  await axios.get<MainModel.SupMenuRespons>(`api/auth/sub_menus/${id}/`);
  if(res.status===200){
    this.respone_sup_menu_detail = res.data;
  }
} catch (error) {
  CallSwal({
    icon:"error",
    title:"ເກີດປັນຫາ",
    text:"ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້"

  })
}finally{

}
    },
    async updateSupmenu(id:number){
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຢືນຢັນ",
          text: "ທ່ານຕ້ອງການປ່ຽນແປງຂໍ້ມູນ ຫຼື ບໍ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ບັນທຶກ",
          cancelButtonText: "ຍົກເລີກ",
        });if(notification.isConfirmed){
          let req ={
            main_id: this.form_update_supmenu_data.main_id,
            name: this.form_update_supmenu_data.name,
            icon: this.form_update_supmenu_data.icon,
            url: this.form_update_supmenu_data.url,

          };
          const res = await axios.put(`api/auth/sub_menus/${id}/`, req);
          if(
            res.status ===200
          ){
            const notification = await CallSwal({
              title: "ສຳເລັດ",
              text: "ທ່ານແກ້ໄຂຂໍ້ມູນ ສຳເລັດ",
              icon: "success",
              showConfirmButton: true,
              confirmButtonText: "ຕົກລົງ",
            });
            if (notification.isConfirmed) {
              setTimeout(() => {
                goPath(`/supmenu`);
              }, 1500);
            }
          }
        }
      } catch (error) {
        console.error("Error updating sub menu:", error);
        
      }finally{
        this.isloading = false;
      }
    },
  async deleteSupmenu(id: number) {
  this.isloading = true;
  try {
    const notification = await CallSwal({
      title: "ຢືນຢັນການລຶບ",
      text: "ທ່ານແນ່ໃຈຫຼືບໍ່ວ່າຕ້ອງການລຶບເມນູຍ່ອຍນີ້?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ລຶບ",
      cancelButtonText: "ຍົກເລີກ",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (notification.isConfirmed) {
      const res = await axios.delete(`api/auth/sub_menus/${id}/`);
      
      if (res.status === 204) {
        const successNotification = await CallSwal({
          title: "ສຳເລັດ",
          text: "ລຶບເມນູຍ່ອຍສຳເລັດແລ້ວ",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "ຕົກລົງ",
          timer: 2000
        });

        if (successNotification.isConfirmed || successNotification.isDismissed) {
          // ໂຫລດຂໍ້ມູນໃໝ່ແທນທີ່ຈະ redirect
          await this.getSupmenu();
        }
      }
    }
  } catch (error) {
    console.error("Error deleting sub menu:", error);
    
    // ສະແດງຂໍ້ຜິດພາດ
    await CallSwal({
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດລຶບເມນູຍ່ອຍໄດ້",
      icon: "error",
      confirmButtonText: "ຕົກລົງ",
    });
  } finally {
    this.isloading = false;
  }
},
    updateUserData(userData: any) {
      this.user_data = userData;
      this.user_id = userData.id?.toString() || null;
      localStorage.setItem("user", JSON.stringify(userData));
    },

    clearUserData() {
      this.user_data = null;
      this.user_id = null;
      this.respons_data_menu = null;
      localStorage.removeItem("user");
    },
  },

  getters: {
    getUserInfo: (state) => state.user_data,
    isLoggedIn: (state) => !!state.user_id,
    getMenuData: (state) => state.respons_data_menu,
  },
});
