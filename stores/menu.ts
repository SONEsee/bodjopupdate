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
      respons_data_main_menu: null as MainModel.MenuMainRespons | null,
      user_data: null as any,
      user_id: null as string | null,
      isloading: false,
      form_create_data: {
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
        const res = await axios.get<MainModel.MenuMainRespons>(
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
        const req = await axios.post(`api/auth/main_menu`, this.form_create_data);
        if(req.status===201){
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
