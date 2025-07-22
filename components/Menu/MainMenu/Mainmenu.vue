<script setup lang="ts">
const menuStore = useMenuStore();

const res = computed(() => {
  return menuStore.respons_data_main_menu;
});

onMounted(() => {
  menuStore.getMainMenu();
});

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const headers = [
  { title: "ລຳດັບ", value: "no", sortable: true },
  { title: "ຊື່ເມນູ", value: "name", sortable: true },
  { title: "ໄອຄອນ", value: "icon", sortable: true },
  { title: "ມື້ສ້າງ", value: "created_at", sortable: true },
  { title: "ຈັດການ", value: "actions", sortable: false },
];

const handleDeleteMenu = async (id: number) => {
  await menuStore.deleteMainMenu(id);

  await menuStore.getMainMenu();
};
</script>

<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="10">
        <GlobalTextTitleLine
          :title="`ໜ້າຈັດການເມນູຫຼັກ / Manage Menu (${formatNumber(
            res?.length ?? 0
          )})`"
        />
       
      </v-col>
      <v-col cols="12" md="2" class="text-right">
        <v-btn color="primary" @click="goPath('/mainmenu/create')">
          <v-icon icon="mdi-plus"></v-icon>ເພີ່ມຂໍ້ມູນເມນູ
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table :items="res || []" :headers="headers">
      <template v-slot:item.no="{ item, index }">
        {{ index + 1 }}
      </template>

      <template v-slot:item.created_at="{ item, index }">
        {{ new Date(item.created_at).toLocaleDateString("lo-LA")  }}
      </template>

      <template v-slot:item.actions="{ item, index }">
        <v-btn
          icon="mdi-eye"
          flat
          small
          class="text-primary"
          @click="goPath(`/mainmenu/detail/?id=${item.main_id}`)"
        ></v-btn>

        <v-btn
          icon="mdi-pen"
          flat
          class="text-info"
          @click="goPath(`/mainmenu/edit/?id=${item.main_id}`)"
        ></v-btn>

        <v-btn
          icon="mdi-delete"
          flat
          class="text-error"
          @click="handleDeleteMenu(item.main_id)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-col>
</template>
