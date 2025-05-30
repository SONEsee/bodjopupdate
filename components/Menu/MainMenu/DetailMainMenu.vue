<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";
import { useRoute } from "vue-router";
const menuStore = useMenuStore();
const route = useRoute();
const id = Number(route.query.id) || 0;
const res = computed(() => {
  return menuStore.respons_data_detail_main_menu;
});
onMounted(() => {
  menuStore.getDetailMainMenu(id);
});
const title = "ລາຍລະອຽດເມນູ";
</script>
<template>
  <v-col cols="12">
    <LazyGlobalTextTitleLine :title="title" />
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <GlobalCardTitle :text="` ${res?.main_id}`" title="ລາຍລະອຽດເມນູ" />
        </v-col>
        <v-col cols="12" md="6">
          <GlobalCardTitle :text="` ${res?.name}`" title="ຊື່ເມນູ" />
        </v-col>
        <v-col cols="12" md="6">
          <GlobalCardTitle :text="res?.icon" title="ໄອຄອນ" :icon="res?.icon" />
        </v-col>
        <v-col cols="12" md="6">
          <GlobalCardTitle
            :text="
              res?.created_at
                ? $dayjs(res.created_at).format('DD/MM/YYYY ')
                : ''
            "
            title="ມື້ສ້າງ"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
