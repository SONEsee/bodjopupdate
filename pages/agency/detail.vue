<script lang="ts" setup>
const loading = ref(false);
const route = useRoute();
const id =
  typeof route.query.id == "undefined"
    ? null
    : route.query.id?.toString() ?? null;
const agencyStore = UseAgencyStore();

const onLoadingData = async () => {
  try {
    loading.value = true;
    await agencyStore.GetDetailAgencyData(id);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  onLoadingData();
});
</script>

<template>
  <section class="pa-6">
    <v-card min-height="95vh" flat class="pa-6">
      <AgencyDetailAgency />
    </v-card>

    <GlobalOverlayLoading :loading="loading" />
  </section>
</template>
