<script lang="ts" setup>
import dayjs from "#build/dayjs.imports.mjs";
const positoinStore = usePositoinStore();
const headers = [
  { title: "ID", value: "position_id" },
  { title: "ຂັ້ນຫຼືຕຳແໜ່ງ", value: "position_name" },
  { title: "ເງິນເດືອນ", value: "base_sal_id" },
  { title: "ເງິນໂບນັດ", value: "rate_ot" },
  { title: "ມື້ສ້າງ", value: "createdAt" },
  { title: "ຈັດການ", value: "action" },
];
const response = computed(() => {
  return positoinStore.respons_data_positoin || [];
});
onMounted(() => {
  positoinStore.getData();
});
const Delete = async (id: number) => {
  if (id) {
    await positoinStore.deletPosition(id);
    await positoinStore.getData();
  }
};
</script>
<template>
  <v-col cols="12">
    <GlobalTextTitleLine
      :title="`ຈັດການຂໍ້ມູນຂັ້ນເງິນເດືອນ(${response.length})ລາຍການ`"
    />
    <div class="text-right mb-2">
      <v-btn color="primary" @click="goPath('/position/create')"
        ><v-icon icon="mdi-plus"></v-icon>ເພີ່ມຂໍ້ມູນຂັ້ນເງິເດືອນ</v-btn
      >
    </div>
    <v-data-table :items="response" :headers="headers">
      <template v-slot:item.createdAt="{ item }">
        {{ dayjs(item.createdAt).format("DD/MM/YYYY") }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          small
          flat
          class="text-primary"
          icon="mdi-eye"
          @click="goPath(`/position/detail/?id=${item.position_id}`)"
        ></v-btn>
        <v-btn
          small
          flat
          class="text-info"
          icon="mdi-pen"
          @click="goPath(`/position/edit/?id=${item.position_id}`)"
        ></v-btn>
        <v-btn
          small
          flat
          class="text-error"
          icon="mdi-delete"
          @click="Delete(item.position_id)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-col>
</template>
