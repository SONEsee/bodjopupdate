<template>
  <section>
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine :title="title" />
      </v-col>
      <v-col cols="12" class="mt-4">
        <v-row>
          <v-col cols="3">
            <GlobalCardTitle
              :text="item?.name ?? 'N/A'"
              :title="'ຊື່ພາສາລາວ / Name'"
            />
          </v-col>
          <v-col cols="3">
            <GlobalCardTitle
              :text="item?.name_en ?? 'N/A'"
              :title="'ຊື່ພາສາອັງກິດ / Name English'"
            />
          </v-col>
          <v-col cols="3">
            <GlobalCardTitle
              :text="item?.user?.fullname ?? 'N/A'"
              :title="'ຄົນສ້າງ / Create by user'"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <GlobalOverlayLoading :loading="loading" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "@/helpers/axios";
import { ExpenseCreateModel } from "@/models/";
const route = useRoute();
const title = ref("ໜ້າສະແດງຂໍ້ມູນປະເພດລາຍຈ່າຍ / Detail Expense type");
const loading = ref(false);

const item = ref(null as ExpenseCreateModel.ExpenseDetailResponseItems | null);
const query = route.query;
const id = query.id?.toString() ?? null;

const GetDetailData = async () => {
  try {
    loading.value = true;
    if (id === null) {
      return;
    }

    const res = await axios.get<ExpenseCreateModel.ExpenseDetailResponse>(
      `/api/v1/expense-types/detail/${id}`
    );
    if (res.status === 200) {
      item.value = res.data.items;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  GetDetailData();
});
</script>
