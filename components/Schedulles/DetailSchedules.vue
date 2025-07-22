<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const id = Number(route.query.id) || 0;
const res = computed(() => {
  return schedStore.resposns_data_schedules_detail;
});
onMounted(async () => {
  schedStore.GetdataDetail(id);
});
const title = "ລາຍລະອຽດໂມງເຂົ້າ-ອອກ";
const schedStore = useSchedulesStore();
</script>
<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />

    <v-row>
      <v-col cols="12" md="4">
        <GlobalCardTitle :title="'ຊື່ກະ: '" :text="res?.work_shift" />
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle :title="'ໂມງເລີ່ມ: '" :text="res?.shift_start" />
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle :title="'ໂມງອອກ: '" :text="res?.shift_end" />
      </v-col>
      <v-col cols="12" md="4">
        <GlobalCardTitle
          :title="'ມື້ສ້າງ: '"
          :text="$dayjs(res?.createdAt).format('DD/MM/YYYY ')"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
