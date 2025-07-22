<template>
  <section class="pa-6">
    <v-card class="pa-6" flat min-height="95vh">
      <DevicesCreateDevice />
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