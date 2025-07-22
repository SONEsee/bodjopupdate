<script setup lang="ts">
import {useRoute} from 'vue-router'
import dayjs from '#build/dayjs.imports.mjs';
 const route = useRoute();
 const id = Number(route.query.id) || 0;
 const positionStore = usePositoinStore()
 const res  = computed(()=>{
  return positionStore.resposn_detail_data_positoin
 })
 onMounted(()=>{
  positionStore.getDataDetail(id)
 })
const title = "ຂໍ້ມູນລາຍລະອຽດຂັ້ນເງິນເດືອນ";
</script>
<template>
  <GlobalTextTitleLine :title="title" />
  <v-col cols="12">
    <v-row>
     
      <v-col cols="12" md="4">
      <GlobalCardTitle :title="'ຊື້ຂັ້ນ'" :text="res?.position_name" />
   <GlobalCardTitle
            :text="
              res?.createdAt
                ? $dayjs(res.createdAt).format('DD/MM/YYYY ')
                : ''
            "
            title="ມື້ສ້າງ"
          />
      </v-col>
      <v-col cols="12" md="4">
      <GlobalCardTitle :title="'ເງິນເດືອນ'" :text="res?.salary_rate" />
      </v-col>
      <v-col cols="12" md="4">
      <GlobalCardTitle :title="'ເງິນໂອທີ'" :text="res?.ot_rate" />
      </v-col>
    </v-row>
  </v-col>
</template>
