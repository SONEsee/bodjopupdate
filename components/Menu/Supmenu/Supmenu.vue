<script setup lang="ts">
const title = "ໜ້າຈັດການເມນູຍ່ອຍ";
const menuStore = useMenuStore();

const res = computed(() => {
  return menuStore.respons_sup_menu || [];
});

onMounted(() => {
  menuStore.getSupmenu();
});

const handleDelete = async (id: number) => {
  try {
    await menuStore.deleteSupmenu(id);

    await menuStore.getSupmenu();
  } catch (error) {
    console.error("Error deleting submenu:", error);
  }
};
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};
const headers = [
  { title: "ລຳດັບ", value: "no", sortable: true },
  { title: "ຊື່ເມນູ", value: "name", sortable: true },
  { title: "ໄອຄອນ", value: "icon", sortable: true },
  { title: "URL", value: "url", sortable: true },
  { title: "ຈັດການ", value: "actions", sortable: false },
];
</script>

<template>
  <v-col cols="12">
    <LazyGlobalTextTitleLine :title="`ໜ້າຈັດການເມນູຍອ່ຍ / Manage SubMenu (${formatNumber(
            res?.length ?? 0
          )})`" />

    <div class="d-flex justify-end mt-2">
      <v-btn
        @click="goPath('supmenu/create')"
        color="primary"
        :disabled="menuStore.isloading"
      >
        <v-icon icon="mdi-plus"></v-icon>
        ເພີ່ມຂໍ້ມູນເມນູ
      </v-btn>
    </div>

    <v-data-table
      :items="res || []"
      :headers="headers"
      :loading="menuStore.isloading"
      loading-text="ກຳລັງໂຫລດຂໍ້ມູນ..."
    >
      <template v-slot:item.no="{ item, index }">
        {{ index + 1 }}
      </template>

      <template v-slot:item.icon="{ item }">
        <v-icon>{{ item.icon }}</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip text="ເບິ່ງລາຍລະອຽດ">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="text-primary"
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="goPath(`/supmenu/detail/?id=${item.sub_id}`)"
              :disabled="menuStore.isloading"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="ແກ້ໄຂ">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="text-info"
              icon="mdi-pen"
              size="small"
              variant="text"
              @click="goPath(`/supmenu/edit/?id=${item.sub_id}`)"
              :disabled="menuStore.isloading"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="ລຶບ">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="text-error"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="handleDelete(item.sub_id)"
              :disabled="menuStore.isloading"
            />
          </template>
        </v-tooltip>
      </template>

      <template v-slot:no-data>
        <div class="text-center py-4">
          <v-icon size="48" color="grey">mdi-database-off</v-icon>
          <p class="text-grey mt-2">ບໍ່ມີຂໍ້ມູນເມນູຍ່ອຍ</p>
        </div>
      </template>
    </v-data-table>
  </v-col>
</template>
