<script setup lang="ts">

import { useRoute } from "vue-router";
const route = useRoute();
const id = parseInt(
  (Array.isArray(route.query.id) ? route.query.id[0] : route.query.id) ?? "0",
  10
);
const roleStore = useRoleStore();
onMounted(async () => {
  await roleStore.getRoleDetail(id);
});
const title = "ແກ້ໄຂສິເຂົ້ານຳໃຊ້ລະບົບ";
</script>
<template>
    <v-col cols="12">
        <GlobalTextTitleLine :title="title" />
        <UpdateRole />
    </v-col>
</template>