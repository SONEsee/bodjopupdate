<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const basalaryStore = useBasalaryStore();

const id = Number(route.query.bas_id) || 0;
const visible = ref(false);
const form = ref();
const title = "ແກ້ໄຂຂໍ້ມູນເງິນເດືອນພື້ນຖານ";

const basalaryDetails = computed(() => {
  return basalaryStore.response_data_basalary_detail;
});

onMounted(async () => {
  try {
    await basalaryStore.getBasalaryDetail(id);

    if (basalaryStore.response_data_basalary_detail) {
      const detail = basalaryStore.response_data_basalary_detail;
      basalaryStore.form_update_data = {
        salary: detail.salary,
      };
    }
  } catch (error) {
    console.error("Error loading base salary details:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນເງິນເດືອນພື້ນຖານ",
      icon: "error",
    });
  }
});

const Description = () => {
  visible.value = !visible.value;
};

const handleSubmit = async () => {
  try {
    const { valid } = await form.value.validate();

    if (valid) {
      await basalaryStore.UpdateBasalary(id);
    }
  } catch (error) {
    console.error("Error updating base salary:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນເງິນເດືອນພື້ນຖານ",
      icon: "error",
    });
  }
};

const handleCancel = () => {
  if (basalaryStore.response_data_basalary_detail) {
    const detail = basalaryStore.response_data_basalary_detail;
    basalaryStore.form_update_data = {
      salary: detail.salary,
    };
  }
};
</script>

<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />

    <div
      v-if="basalaryStore.isloading && !basalaryDetails"
      class="text-center py-8"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <section
      v-else
      style="width: 100%; height: 60vh"
      class="d-flex justify-center align-center"
    >
      <v-form
        style="width: 60vh"
        class="text-center"
        @submit.prevent="handleSubmit"
        ref="form"
        :disabled="basalaryStore.isloading"
      >
        <div class="mb-6">
          <label class="d-flex justify-start mb-2">ຈຳນວນເງິນເດືອນພື້ນຖານ</label>
          <v-text-field
            @click:append-inner="Description"
            v-model="basalaryStore.form_update_data.salary"
            :rules="[(v: string | number) => (!!v || v === 0) || 'ກະລຸນາປ້ອນຈຳນວນເງິນເດືອນພື້ນຖານ']"
            placeholder="ກະລຸນາປ້ອນຈຳນວນເງິນເດືອນພື້ນຖານ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :disabled="basalaryStore.isloading"
            type="number"
            min="0"
            step="0.01"
          ></v-text-field>
        </div>

        <div class="d-flex justify-center gap-4">
          <v-btn
            class="mr-3"
            text="ບັນທືກ"
            color="primary"
            type="submit"
            :loading="basalaryStore.isloading"
            variant="elevated"
          ></v-btn>
          <v-btn
            text="ຍົກເລີກ"
            color="error"
            :disabled="basalaryStore.isloading"
            @click="handleCancel"
            variant="outlined"
          ></v-btn>
        </div>
      </v-form>
    </section>
  </v-col>
</template>