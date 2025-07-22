<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const id = parseInt(
  (Array.isArray(route.query.id) ? route.query.id[0] : route.query.id) ?? "0",
  10
);
const roleStore = useRoleStore();
const res = computed(() => {
  return roleStore.response_data_role_detail?.data;
});
onMounted(async () => {
  await roleStore.getRoleDetail(id);
});
const title = "ລາຍລະອຽດສິເຂົ້ານຳໃຊ້ລະບົບ";
</script>
<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />
    <v-row>
      <v-col cols="12" md="6">
        <GlobalCardTitle :text="` ${res?.name}`" title="ຊື່ສິດເຂົ້ານຳໃຊ້" />
      </v-col>
      <v-col cols="12" md="6">
        <GlobalCardTitle
          :text="` ${res?.description}`"
          title="ລາຍລະອຽດສິດເຂົ້ານຳໃຊ້"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
