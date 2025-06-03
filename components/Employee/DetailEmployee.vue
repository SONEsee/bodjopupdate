<script setup lang="ts">
import { useRoute } from 'vue-router';
const router= useRoute();
const id = Number(router.query.id);
const empStore = useEmployeeStore();
const request = computed(()=> {
  return empStore.respone_detail_data;
})
onMounted (() => {
  empStore.getDetailData(id)
})
const title="ລາຍລະອຽດຂໍ້ມູນພະນັກງານ"
</script>
<template>
  {{ request }}
  <v-col cols="12">
    <GlobalTextTitleLine :title="title"/>
    <v-row>
      <v-col cols="12" md="4">
        <GlobalCardTitle :title="'ຊື່ພະນັກງານ'" :text="request?.name" />
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle title="ເພດ" :text="request?.gender"/>
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle title="ເບີໂທ" :text="request?.phone"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <GlobalCardTitle title="ເບີໂທ" :string="request?.position_id"/>
      </v-col>
    </v-row>
  </v-col>
</template>