import axios from "@/helpers/axios";
import { UserModel } from "../models";

export const UserStore = defineStore("user", {
  state() {
    return {
      loading: false,
      respons_data_query: null as UserModel.Data | null,
      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },
    };
  },
  actions: {
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
  },
});
