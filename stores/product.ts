import { defineStore } from "pinia";
import { ProductModel } from "@/models";
import axios from "@/helpers/axios";
import { CallSwal, goPath } from "~/composables/global";

export const useProductStore = defineStore("product", {
  state() {
    return {
      data_form_creat:{
product_name: "",
category_id: "",
quantity_in_stock: 0,
expiry_date: "",
price: 0,
reorder_level: 0,
barcode: "",
product_image: "" as string | File,
created_at: "",
updated_at: "",
deleted_at: "",

      },
      product: [] as ProductModel.ProductResponseItems[],
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
    async CreateData() {
      try {
        const {data ,status} = await axios.post<ProductModel.ProductResponseItems>(`/products`,this.data_form_creat);
        if(status === 200){
          this.product.push(data)
          await CallSwal({
            title: "ສຳເລັດ",
            text: "ການບັນທຶກຂໍ້ມູນສຳເລັດ",
            icon: "success",
            showCancelButton: false,
            timer: 1500,
          });
          goPath("/product");
        }

      } catch (error) {
        
      }
    }
  },
  
});