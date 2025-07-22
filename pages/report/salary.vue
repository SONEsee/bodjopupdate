<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  requiresPermission: true,
  subMenuId: 5
})
definePageMeta({
  layout: "login",
});
</script>
<template>
    <SalaryReport/>
</template>