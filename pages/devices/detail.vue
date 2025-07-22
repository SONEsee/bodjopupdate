<template>
  <section class="pa-6">
    <v-card min-height="95vh" flat class="pa-6">
      <DevicesDetailDevice />
    </v-card>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  requiresPermission: true,
  subMenuId: 5
})
</script>
