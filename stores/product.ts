import { defineStore } from "pinia";
import { ProductModel } from "@/models";
import axios from "@/helpers/axios";
import { CallSwal, goPath } from "~/composables/global";
import { UseGlobalStore } from "./global";
export const useProductStore = defineStore("product", {
  state() {
    return {
      loading: false,
      data_form_creat: {
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
        Items: [] as ProductModel.ProductResponseItems[],
      } as ProductModel.ProductResponse,
      response_detail_query_data: {
        error: "",
        loading: false,
        Items: [] as ProductModel.ProductResponseItems[],
      } as ProductModel.ProductResponse,
    };
  },
  actions: {
    async Getdata() {
      try {
        this.response_query_data.loading = true;
        this.response_query_data.error = "";
        const res = await axios.get<ProductModel.ProductResponseItems[]>(`/products`);
        this.response_query_data.Items = res.data;
        this.response_query_data.loading = false;
      } catch (error: any) {
        this.response_query_data.loading = false;
        this.response_query_data.error = error.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ";
        console.error("Error fetching products:", error);
      }
    },
    async GetdetailData(id: string | null) {
      this.loading = true;
      try {
        const res = await axios.get<ProductModel.ProductResponseItems>(`/products/${id}`);
        if (res.status === 200) {
          this.response_detail_query_data.Items = [res.data];
        }
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        this.response_detail_query_data.error = error.message || "ບໍ່ພົບຂໍ້ມູນສິນຄ້າ";
        console.error("Error fetching product detail:", error);
      }
    },
    async CreateData() {
      try {
        const formData = new FormData();
        formData.append("product_name", this.data_form_creat.product_name);
        formData.append("category_id", this.data_form_creat.category_id);
        formData.append("quantity_in_stock", this.data_form_creat.quantity_in_stock.toString());
        formData.append("expiry_date", this.data_form_creat.expiry_date);
        formData.append("price", this.data_form_creat.price.toString());
        formData.append("reorder_level", this.data_form_creat.reorder_level.toString());
        formData.append("barcode", this.data_form_creat.barcode);
        if (this.data_form_creat.product_image instanceof File) {
          formData.append("product_image", this.data_form_creat.product_image);
        }

        const { data, status } = await axios.post<ProductModel.ProductResponseItems>(
          `/products`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (status === 200) {
          this.product.push(data);
          await CallSwal({
            title: "ສຳເລັດ",
            text: "ການບັນທຶກຂໍ້ມູນສຳເລັດ",
            icon: "success",
            timer: 1500,
          });
          goPath("/product");
        }
      } catch (error: any) {
        console.error("Error creating product:", error.response?.data || error);
        await CallSwal({
          title: "ຜິດພາດ",
          text: error.response?.data?.error || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ",
          icon: "error",
          timer: 1500,
        });
      }
    },
    async UpdateData(id: string | null, updatedItem: ProductModel.ProductResponseItems) {
      try {
        const formData = new FormData();
        formData.append("product_name", updatedItem.product_name);
        formData.append("category_id", updatedItem.category_id);
        formData.append("quantity_in_stock", updatedItem.quantity_in_stock.toString());
        formData.append("expiry_date", updatedItem.expiry_date );
        formData.append("price", updatedItem.price.toString());
        formData.append("reorder_level", updatedItem.reorder_level.toString());
        formData.append("barcode", updatedItem.barcode);
        if (updatedItem.product_image instanceof File) {
          formData.append("product_image", updatedItem.product_image);
        } else if (typeof updatedItem.product_image === "string") {
          formData.append("product_image_path", updatedItem.product_image);
        }

        
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        const { data, status } = await axios.put<ProductModel.ProductResponseItems>(
          `/products/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (status === 200) {
          const notification = await CallSwal({
            title: "ຄຳເຕືອນ",
            text: `ທ່ານຕອ້ງການບັນທຶກການປຽນແປງນີ້ແທ້ບໍ່?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ຕົກລົງ",
            cancelButtonText: "ຍົກເລີກ",
          });
          const index = this.product.findIndex((p) => p.id === data.id);
          if (index !== -1) {
            this.product[index] = data;
          }
          if(notification.isConfirmed){
            this.response_detail_query_data.Items = [data];
          await CallSwal({
            title: "ສຳເລັດ",
            text: "ການແກ້ໄຂຂໍ້ມູນສຳເລັດ",
            icon: "success",
            timer: 1500,
          });
          goPath("/product");
          }else{
            await CallSwal({
              title: "ຍົກເລີກ",
              text: "ການແກ້ໄຂຂໍ້ມູນຖືກຍົກເລີກ",
              icon: "error",
              timer: 1500,
            })
            goPath("/product");
          }
          
        }
      } catch (error: any) {
        console.error("Error updating product:", error.response?.data || error);
        await CallSwal({
          title: "ຜິດພາດ",
          text: error.response?.data?.error || "ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ",
          icon: "error",
          timer: 1500,
        });
      }
    },
    async DeleteData(id: string | null) {
      const globalStore = UseGlobalStore();
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: `ທ່ານກຳລັງລົບຂໍ້ມູນສິນຄ້າທ່ານແນ່ໃຈແລ້ວບໍໍ່?`,
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (notification.isConfirmed) {
          this.loading = true;
          const res = await axios.delete(`/products/${id}`);
          if (res.status === 200) {
            globalStore.loading_overlay = false;
            const res = await axios.delete(`/products/${id}`);
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