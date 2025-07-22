<script lang="ts" setup></script>
<template>
    <CreateSchedules />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  requiresPermission: true,
  subMenuId: 5
})
</script>