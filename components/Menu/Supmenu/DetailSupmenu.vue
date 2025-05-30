<script setup lang="ts">
import { useRoute } from "vue-router";
const rout = useRoute();
const id = Number(rout.query.id) || 0;
const menuStore = useMenuStore();
const res = computed(() => {
  return menuStore.respone_sup_menu_detail;
});
onMounted(() => {
  menuStore.getDetail(id);
});
const title = "ລາຍລະອຽດເມນູຍ່ອຍ";
</script>
<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />
    <v-row>
      <v-col cols="12" md="6">
        <GlobalCardTitle :text="` ${res?.sub_id}`" title="ໄອດີເມນູຍອ່ຍ" />
        <GlobalCardTitle :text="` ${res?.url}`" title="ລິງເມນູ" />
        <GlobalCardTitle :text="` ${res?.main_id}`" title="ຄວາມສຳພັນເມນູຫຼັກ" />
      </v-col>
      <v-col cols="12" md="6">
        <GlobalCardTitle :text="` ${res?.name}`" title="ຊື່ເມນູຍ່ອຍ" />
        <GlobalCardTitle
          :text="`${res?.icon}`"
          title="ໄອຄອນ"
          :icon="res?.icon"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
