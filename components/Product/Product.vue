<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "~/stores/product";
import { CallSwal, goPath } from "~/composables/global";
import { DefaultSwalError } from "~/composables/global";

const onDeleteProduct = async (id:  string) => {
 const res = await product.DeleteData(id);
 if(res instanceof Error){
   return DefaultSwalError(res.message)
 }
 const notification = await CallSwal({
    icon: "success",
    title: "ສຳເລັດ",
    text: "ລົບຂໍ້ມູນສຳເລັດ",
  });
  if (notification.isConfirmed) {
    await product.Getdata();
  } else {
    await product.Getdata();
};
}
const headers = [
  { title: "ຊື່ສິນຄ້າ", key: "product_name" },
  { title: "ຈຳນວນຢາ", key: "quantity_in_stock" },
  { title: "ລະຫັດສິນຄ້າ", key: "barcode" },
  { title: "ປະເພດ", key: "category_id" },
  { title: "ລາຄາ", key: "price" },
  { title: "ຮູບພາບ", key: "product_image" },
  { title: "ຈັດການ", key: "actions", sortable: false },
];

const title = "ສິນຄ້າ";
const product = useProductStore();

const res = computed(() => product.response_query_data?.Items || []);

onMounted(() => {
  product.Getdata();
});
</script>

<template>
  <GlobalTextTitleLine :title="title" />
  <div class="d-flex justify-end ma-4">
    <v-btn color="primary" @click="goPath(`/product/create`)">
      <v-icon icon="mdi-plus"></v-icon> ເພີ່ມສິນຄ້າ
    </v-btn>
  </div>
  <v-data-table
    :headers="headers"
    :items="res"
    class="elevation-1"
    density="compact"
  >
    <template #item.price="{ item }">
      {{ item.price.toLocaleString() }} LAK
    </template>
    <template #item.quantity_in_stock="{ item }">
      <v-chip
        :color="item.quantity_in_stock <= 5 ? 'red' : 'green'"
        text-color="white"
        small
      >
        {{ item.quantity_in_stock }}
      </v-chip>
    </template>
    <template #item.product_image="{ item }">
      <GlobalMenuSpanImage :image="item.product_image ?? 'N/A'" />
    </template>

    <template #item.actions="{ item }">
      <v-btn
        color=""
        small
        class="mr-2 text-info"
        @click="goPath(`product/detail/?id=${item.id}`)"
        flat
        icon="mdi-eye"
      >
      </v-btn>
      <v-btn
        color=""
        small
        class="mr-2 text-primary"
        @click="goPath(`product/update/?id=${item.id}`)"
        flat
        icon="mdi-pencil"
      >
      </v-btn>

      <v-btn color="" class="text-error" small @click="onDeleteProduct(item.id)" flat icon="mdi-delete">
      </v-btn>
    </template>
  </v-data-table>
</template>

<style scoped></style>
