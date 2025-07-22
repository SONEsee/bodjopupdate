<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
  requiresPermission: true,
  subMenuId: 5
})
</script>

<template>
  <section
   
  >
    
    <div >
      <DashBoardAdmin/>
    </div>
  </section>
</template>
