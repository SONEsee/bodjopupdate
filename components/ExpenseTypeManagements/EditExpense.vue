<template>
  <v-section>
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine
          :title="'ແກ້ໄຂຂໍ້ມູນປະເພດລາຍຈ່າຍ / Edit Expense Type'"
        />
      </v-col>
      <v-col cols="12" v-if="formData != null">
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="3" class="mt-4">
              <label> ຊື່ພາສາລາວ / Name </label>
              <v-text-field
                v-model="formData.name"
                :rules="[rules.required]"
                density="comfortable"
                class="pa-2"
                color="primary"
                hide-details="auto"
                variant="outlined"
              />
            </v-col>

            <v-col cols="3" class="mt-4">
              <label for="name_en">ຊື່ພາສາອັງກິດ / Name English</label>
              <v-text-field
                v-model="formData.name_en"
                :rules="[rules.required]"
                density="comfortable"
                class="pa-2"
                hide-details="auto"
                color="primary"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-6">
            <v-btn color="primary" width="180px" type="submit" flat>
              ບັນທຶກ
            </v-btn>
            <v-btn color="#90A4AE" width="180px" class="ml-6" flat>
              ຍົກເລິກ
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>

    <GlobalOverlayLoading :loading="loading" />
  </v-section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "@/helpers/axios";
import type { ExpenseCreateModel } from "~/models";
import Swal from "sweetalert2";

const loading = ref(false);
const formData = ref({
  name: "",
  name_en: "",
} as { name: string; name_en: string } | null);

const form = ref();
const rules = {
  required: (value: string) => !!value || "ກະລຸນາປ້ອນຂໍ້ມູນ",
};

const route = useRoute();
const id = ref(route.query.id?.toString() || "");

const fetchData = async () => {
  if (!id.value) return;

  try {
    loading.value = true;
    const { data } = await axios.get<ExpenseCreateModel.ExpenseDetailResponse>(
      `/api/v1/expense-types/detail/${id.value}`
    );

    if (data.items !== null) {
      formData.value = {
        name: data.items.name || "",
        name_en: data.items.name_en || "",
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    const valid = await form.value.validate();
    if (!valid) return;

    loading.value = true;
    const response = await axios.post<ExpenseCreateModel.ExpenseCreateResponse>(
      `/api/v1/expense-types/update/${id.value}`,
      formData.value
    );
    loading.value = false;
    if (response.status === 200) {
      const notification = await Swal.fire({
        icon: "success",
        title: "ສຳເລັດ",
        text: "ການແກ້ໄຂຂໍ້ມູນສຳເລັດ",
      });

      if (notification.isConfirmed) {
        setTimeout(() => {
          goPath("/expense_type_managements");
        }, 1200);
      } else {
        setTimeout(() => {
          goPath("/expense_type_managements");
        }, 1200);
      }
    }
  } catch (error) {
    console.error(error);
    DefaultSwalError(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
