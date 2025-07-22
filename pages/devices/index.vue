<template>
  <section class="pa-6">
    <v-card flat min-height="95vh" class="pa-6">
      <DevicesMainContent />
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