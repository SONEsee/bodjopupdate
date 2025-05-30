<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
  requiresPermission: true,
  subMenuId: 5
})
</script>

<template>
  <section
    style="min-height: 100vh"
    class="d-flex flex-wrap justify-center align-center"
  >
    <div class="font-weight-black">ກຳລັງພັດທະນາ / Under construction</div>
    <Login/>
  </section>
</template>
