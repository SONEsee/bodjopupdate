<template>
  <div>
    <div v-if="menuStore.isloading">ກຳລັງໂຫລດ...</div>
    <div v-else>
      <h3>ຂໍ້ມູນເມນູ:</h3>
      <pre>{{ menuData }}</pre>
      
     
    </div>
  </div>
</template>

<script setup lang="ts">
const menuStore = useMenuStore();

// Computed properties
const menuData = computed(() => {
  return menuStore.getMenuData;
});

const userData = computed(() => {
  return menuStore.getUserInfo;
});

const userId = computed(() => {
  return menuStore.user_id;
});

// ໂຫລດຂໍ້ມູນເມື່ອ component mount
onMounted(() => {
  menuStore.getMenu();
});
</script>