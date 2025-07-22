<script setup lang="ts">
const basalaryStore = useBasalaryStore();
const res = computed(() => {
  return basalaryStore.response_data_basalary || [];
});
onMounted(() => {
  basalaryStore.getBasalary();
});
const headers = [
  { title: "ລະຫັດ", value: "base_sal_id" },
  { title: "ຊື່", value: "salary" },
  { title: "ຈັດການ", value: "action" },
];
const title = "ຈັດການຂັ້ນເງິນເດືອນ";
</script>
<template>
  <v-col cols="12">
    <div class="pa-4">
      <GlobalTextTitleLine :title="title" />
      <v-btn
        class="mb-4 mt-2"
        color="primary"
        @click="goPath(`/basalary/create`)"
      >
        <v-icon left>mdi-plus</v-icon>
        ເພີ່ມຂັ້ນເງິນເດືອນ
      </v-btn>
      <v-data-table :items="res" :headers="headers">
        <template v-slot:item.action="{ item }">
          <v-btn
            icon="mdi-eye"
            flat
            size="small"
            class="text-primary"
            @click="goPath(`/basalary/detail/?bas_id=${item.base_sal_id}`)"
          ></v-btn>
          <v-btn
            icon="mdi-pen"
            flat
            size="small"
            class="text-info"
            @click="goPath(`/basalary/edit/?bas_id=${item.base_sal_id}`)"
          ></v-btn>
          <v-btn icon="mdi-delete" flat size="small" class="text-error"></v-btn>
        </template>
      </v-data-table></div
  ></v-col>
</template>
