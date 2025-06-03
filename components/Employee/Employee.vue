<script setup lang="ts">
import { goPath } from '#build/imports';
const emStore = useEmployeeStore()
const res= computed(()=>{
  return emStore.respons_data_employee
})
onMounted(()=>{
  emStore.getDataEmployee()
})
const headers = [
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



const handleDeleteMenu = (id: number) => {
 
};
</script>

<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="10">
        <GlobalTextTitleLine :title="`ໜ້າຈັດການເມນູຫຼັກ / Manage Menu`" />
      </v-col>
      <v-col cols="12" md="2" class="text-right">
        <v-btn color="primary" @click="goPath(`/employee/create`)  ">
          <v-icon icon="mdi-plus" /> ເພີ່ມຂໍ້ມູນເມນູ
        </v-btn>
<v-btn color="primary" @click="goPath('/')"></v-btn>
      </v-col>
    </v-row>

    <v-data-table :items="res || []" :headers="headers">
      <!-- ລຳດັບ -->
      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>

      <!-- ມື້ສ້າງ -->
      <template v-slot:item.created_at="{ item }">
        {{ new Date(item.created_at).toLocaleDateString("lo-LA") }}
      </template>

      <!-- ຈັດການ -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          flat
          class="text-primary"
          @click="goPath(`/employee/detail/?id=${item.employee_id}`)"
        />

        <v-btn
          icon="mdi-pen"
          flat
          class="text-info"
          @click="goPath(`/employee/edit/?id=${item.employee_id}`)"
        />

        <v-btn
          icon="mdi-delete"
          flat
          class="text-error"
          @click="handleDeleteMenu(item.employee_id)"
        />
      </template>
    </v-data-table>
  </v-col>
</template>
