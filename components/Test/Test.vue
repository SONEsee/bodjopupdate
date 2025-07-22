<script setup lang="ts">
const employeeStore = useEmployeeStore();
const header = [
  { title: "ລຳດັບ", value: "no" },
  { title: "ຊື່", value: "name" },
  { title: "ເພດ", value: "gender" },
  { title: "ທີ່ຢູ່", value: "address" },
  { title: "ເບີໂທ", value: "phone" },
  { title: "ໂມງເຮັດວຽກ", value: "schedule_id" },
  { title: "ຕຳແໜ່ງ", value: "position_id" },
  { title: "ມື້ສ້າງ", value: "created_at" },
  { title: "ຈັດການ", value: "actions", sortable: false },
];
const res = computed(() => {
  return employeeStore.respons_data_employee || [];
});
onMounted(() => {
  employeeStore.getDataEmployee();
});
const title = "ຈັດການຂໍ້ມູນພະນັກງານ";
</script>
<template>
  <div class="pa-4">
    <GlobalTextTitleLine :title="title" />
    <v-col cols="12">
      <div class="d-flex justify-end align-start" >
        <v-btn color="primary" @click="goPath(`/test/create`)">
          <v-icon icon="mdi-plus"></v-icon> ເພີ່ມຂໍ້ມູນພະນັກງານ
        </v-btn>
      </div>
    </v-col>
    <v-data-table :items="res || []" :headers="header">
      <template v-slot:item.actions="{item}">
        <v-btn flat small class="text-primary">
          <v-icon icon="mdi-eye" @click="goPath(`/test3?employee=${item.employee_id}`)"></v-icon>
        </v-btn>
        <v-btn flat small class="text-info">
          <v-icon icon="mdi-pen"></v-icon>
        </v-btn>
        <v-btn flat small class="text-error">
          <v-icon icon="mdi-delete"></v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
