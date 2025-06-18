<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";

const title = "ຈັດການໂມງເຂົ້າອອກວຽກ";
const schedStore = useSchedulesStore();

const res = computed(() => {
  const data = schedStore.respons_data_schedules;

  return Array.isArray(data) ? data : [];
});

const isLoading = ref(true);

onMounted(async () => {
  try {
    await schedStore.GetData();
  } catch (error) {
    console.error("Error loading schedules:", error);
  } finally {
    isLoading.value = false;
  }
});
const headers = [
  {
    title: "ລຳດັບ",
    value: "no",
  },
  {
     title: "ຊື່ກະເຮັດວຽກ",
    value: "work_shift",
  },

  {
    title: "ໂມງເລີ່ມ",
    value: "shift_start",
  },
  {
    title: "ໂມງອອກ",
    value: "shift_end",
  },
  {
    title: "ມື້ສ້າງ",
    value: "createdAt",
  },
  {
    title: "ຈດການ",
    value: "actions",
    sortable: false,
  },
];
const Delete = async (id: number) => {
  try {
    await schedStore.DeleteSchedules(id);
    
  } catch (error) {
    console.error("Error deleting schedule:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການລຶບ",
      icon: "error",
    });
  }
};
</script>

<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />
    <div class="d-flex justify-end">
      <v-btn color="primary" @click="goPath('/schedules/create')" class="mb-2">
        <v-icon left>mdi-plus</v-icon>
        ເພີ່ມໂມງເຂົ້າອອກວຽກ
      </v-btn>
    </div>

    <div v-if="isLoading" class="text-center pa-4">
      <v-progress-circular indeterminate></v-progress-circular>
      <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <div v-else-if="res && res.length > 0">
      <v-data-table :items="res" :headers="headers" class="elevation-1">
        <template v-slot:item.createdAt="{ item }">
          {{ dayjs(item.createdAt).format("DD/MM/YYYY") }}
        </template>
        <template v-slot:item.no="{ item, index }">
          {{ index + 1 }}
        </template>
        <template v-slot:item.actions="{ item, index }">
          <v-btn
            class="mr-2 text-primary"
            icon="mdi-eye"
            flat
            @click="goPath(`/schedules/detail/?id=${item.schedule_id}`)"
          />
          <v-btn
            class="mr-2 text-primary"
            icon="mdi-pen"
            flat
            @click="goPath(`/schedules/edit/?id=${item.schedule_id}`)"
          />

          <v-btn class="text-error" icon="mdi-delete" flat @click="Delete(item.schedule_id ?? '')" />
        </template>
      </v-data-table>
    </div>

    <div v-else class="text-center pa-4">
      <v-icon size="64" color="grey lighten-1">mdi-calendar-clock</v-icon>
      <p class="text-h6 grey--text">ບໍ່ມີຂໍ້ມູນໂມງເຂົ້າອອກວຽກ</p>
    </div>

    <!-- <details class="mt-4">
      <summary>Debug Info</summary>
      <pre>{{ JSON.stringify(res, null, 2) }}</pre>
    </details> -->
  </v-col>
</template>
