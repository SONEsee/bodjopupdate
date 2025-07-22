<script lang="ts" setup>
const globalStore = UseGlobalStore();
const agencyStore = UseAgencyStore();
const route = useRoute();
const id = route.query.id;

// const onGetData = async () => {
//   try {
//     loading.value = true;
//     await agencyStore.onGetAndEditAgency(
//       typeof id === "undefined" ? null : id?.toString() ?? null
//     );
//   } catch (error) {
//     console.error(error);
//   } finally {
//     loading.value = false;
//   }
// };

onMounted(() => {
  globalStore.GetProvinceData();
  // onGetData();
  agencyStore.onGetAndEditAgency(id?.toString() ?? null);
});
</script>

<template>
  <section class="pa-6">
    <v-card flat min-height="95vh" class="pa-6">
      <AgencyEditComponentEditAgency />
    </v-card>

    <GlobalOverlayLoading :loading="globalStore.loading_overlay" />
  </section>
</template>
