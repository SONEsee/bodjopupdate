<script lang="ts" setup>
const globalStore = UseGlobalStore();

onMounted(() => {
  globalStore.GetProvinceData();
});
</script>
<template>
  <section class="pa-6">
    <v-card flat min-height="95vh" class="pa-6">
      <AgencyCreateNewAgency />
    </v-card>
  </section>
</template>
