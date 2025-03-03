import axios from "@/helpers/axios";
import { CategoryModel } from "~/models";
import { goPath } from "~/composables/global";
import { CallSwal } from "~/composables/global";
import { defineStore } from "pinia";
import { UseGlobalStore } from "./global";


interface Category {
  DeletedAt: null;
  ID: number;
  Name: string;
  CreatedAt: string; 
  UpdatedAt: string;
  Products: null;
}
interface CategoryResponse {
  category: Category;
}


interface CategoryState {
  form_create_data: {
    Name: string;
    ID: number | null;
  };
  form_update_data: {
    Name: string;
    ID: number;
  };
  categories: Category[];
  response_detail_query_data: Category[];
  loading: boolean;
}

export const UseCategoryStore = defineStore("category", {
  state: (): CategoryState => ({
    form_create_data: {
      Name: "",
      ID: null,
    },
    form_update_data: {
      Name: "",
      ID: 0,
    },
    response_detail_query_data: [],
    categories: [],
    loading: false,
  }),

  actions: {
    async GetListData() {
      this.loading = true;
      try {
        const { data, status } = await axios.get<{ categories: Category[] }>(`/categories`);
        if (status === 200) {
          this.categories = data.categories;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        await CallSwal({
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        this.loading = false;
      }
    },

    async CreateCategory() {
      this.loading = true;
      try {
        if (!this.form_create_data.Name?.trim()) {
          await CallSwal({
            title: "ຜິດພາດ",
            text: "ກະລຸນາປ້ອນຊື່ປະເພດ",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        const { data, status } = await axios.post<Category>(`/categories`, this.form_create_data);
        if (status === 200) {
          this.categories.push(data);
          await CallSwal({
            title: "ສຳເລັດ",
            text: "ປະເພດຖືກສ້າງສຳເລັດແລ້ວ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          goPath("/category");
        }
      } catch (error) {
        console.error("Error creating category:", error);
        await CallSwal({
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດໃນການສ້າງປະເພດ",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        this.loading = false;
      }
    },

    async GetDetailCategory(id: string | null) {
      this.loading = true;
      try {
        if (!id) {
          console.log("No ID provided");
          return;
        }
        const res = await axios.get<CategoryResponse>(`/categories/${id}`);
        console.log("API Response:", res.data);

        if (res.status === 200) {
          this.response_detail_query_data = [res.data.category]; // ເອົາ category ພາຍໃນອອກມາເກັບ
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        await CallSwal({
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        this.loading = false;
      }
    },

    async UpdateCategory(id: string | null) {
      this.loading = true;
      try {
        if (!id) {
          await CallSwal({
            title: "ຜິດພາດ",
            text: "ກະລຸນາລະບຸ ID ຂອງປະເພດ",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        if (!this.form_update_data.Name.trim()) {
          await CallSwal({
            title: "ຜິດພາດ",
            text: "ກະລຸນາປ້ອນຊື່ປະເພດ",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        const { data, status } = await axios.put<Category>(
          `/categories/${id}`,
          this.form_update_data
        );

        if (status === 200) {
          const index = this.categories.findIndex(
            (cat) => cat.ID === this.form_update_data.ID
          );
          if (index !== -1) {
            this.categories[index] = data;
          }
          this.response_detail_query_data = [data];

          await CallSwal({
            title: "ສຳເລັດ",
            text: "ປະເພດຖືກອັບເດດສຳເລັດແລ້ວ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          goPath("/category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        await CallSwal({
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດປະເພດ",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        this.loading = false;
      }
    },
    async DeleteCategory(id: string | null ) {
      const globalStore = UseGlobalStore();
      try {
        const notification=await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: `ທ່ານກຳລັງລົບຂໍ້ມູນປະເພດທ່ານແນ່ໃຈແລ້ວບໍ່?`,
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if(notification.isConfirmed){
          this.loading = true;
          const res = await axios.delete(`/categories/${id}`);
          if (res.status === 200) {
            globalStore.loading_overlay = false;
            const res =  await axios.delete(`/categories/${id}`);
            if (res.status === 200) {
              return id;
            }
            
        }
      }
      } catch (error) {
        
      }
    }
  },
});