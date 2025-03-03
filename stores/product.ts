import { defineStore } from "pinia";
import { ProductModel } from "@/models";
import axios from "@/helpers/axios";

export const useProductStore = defineStore("product", {
  state() {
    return {
      response_query_data: {
        error: "",
        loading: false,
        Items: [] as ProductModel.ProductResponseItems[]
      } as ProductModel.ProductResponse
    };
  },
  actions: {
    async Getdata() {
      try {
        this.response_query_data.loading = true;
        this.response_query_data.error = "";
        
        const res = await axios.get<ProductModel.ProductResponseItems[]>(
          `/products`
        );
        
        this.response_query_data.Items = res.data;
        this.response_query_data.loading = false;
        console.log(this.response_query_data);
      } catch (error: any) {
        this.response_query_data.loading = false;
        this.response_query_data.error = error.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ";
        console.error("Error fetching products:", error);
      }
    },
  },
});