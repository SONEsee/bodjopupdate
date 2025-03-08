<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "~/stores/product";
import { CallSwal, goPath } from "~/composables/global";

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

// // ຟັງຊັນການຈັດການ Actions (ຕົວຢ່າງ)
// const editItem = (item: any) => {
//   CallSwal("info", "ແກ້ໄຂ", `ກຳລັງແກ້ໄຂສິນຄ້າ: ${item.product_name}`);
// };

// const deleteItem = (item: any) => {
//   CallSwal("warning", "ລຶບ", `ຕ້ອງການລຶບສິນຄ້າ: ${item.product_name} ບໍ?`, true).then((result) => {
//     if (result.isConfirmed) {
//       // ສົ່ງ request ໄປ backend ຖ້າຕ້ອງການ
//       CallSwal("success", "ສຳເລັດ", "ລຶບສິນຄ້າສຳເລັດ!");
//     }
//   });
// };
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
      <v-btn color="" small class="mr-2 text-primary" @click="" flat>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="" class="text-error" small @click="" flat>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>

</style>
