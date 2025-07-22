<script lang="ts" setup>
const agencyStore = UseAgencyStore();

onMounted(() => {
  agencyStore.GetListData();
});
</script>

<template>
  <section>
    <AgencyMainContent />
  </section>
</template>
