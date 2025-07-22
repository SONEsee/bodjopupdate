<script setup lang="ts">
import dayjs from '#build/dayjs.imports.mjs';
import { formats } from 'numeral';
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
 
  <v-col cols="12">
    <GlobalTextTitleLine :title="title"/>
    <v-row>
      <v-col cols="12" md="4">
        <GlobalCardTitle :title="'ຊື່ພະນັກງານ'" :text="request?.name" />
        <GlobalCardTitle title="ຕຳແໜ່ງ" :text="request?.position.position_name"/>
        <GlobalCardTitle title="ຂັ້ນເງິນເດືອນ" :text="String(request?.position.salary_rate)"/>
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle title="ເພດ" :text="request?.gender"/>
        <GlobalCardTitle title="ປະເພດກະເຮັດວຽກ" :text="String(request?.schedule_id)"/>
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle title="ເບີໂທ" :text="request?.phone"/>
        <GlobalCardTitle title="ວັນເດືອນປີເກີດ" :text=" dayjs(request?.birthdate).format('DD/MM/YYYY')"/>
      </v-col>

     
    </v-row>
    
  </v-col>
</template>