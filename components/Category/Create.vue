<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UseCategoryStore } from "~/stores/category";
import { CallSwal } from "~/composables/global";

const categoryStore = UseCategoryStore();

const form = ref<any>(null);

const rules = {
  name: [
    (v: string) => !!v || "ກະລຸນາປ້ອນຊື່ປະເພດ",
    (v: string) => v.length >= 2 || "ຊື່ປະເພດຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ",
  ],
};

const onSubmit = async () => {
  if (!categoryStore.form_create_data.Name) {
    const notification = await CallSwal({
      icon: "warning",
      title: "ປອ້ນຂໍ້ມູນ",
      text: "ກະລຸນາປ້ອນຊື່ປະເພດ",
    });
    return;
  }

  const isValid = await form.value.validate();
  if (isValid) {
    await categoryStore.CreateCategory();
  }
};

onMounted(async () => {
  try {
    await categoryStore.GetListData();
  } catch (error) {}
});
</script>

<template>
  <v-section style="height: 100vh" class="d-flex align-center justify-center">
    <v-card class="pa-4">
      <v-form
        ref="form"
        @submit.prevent="onSubmit"
        style="width: 50vh"
        class="text-center"
      >
        <h3>ເພີ່ມປະເພດຂອງຢາ</h3>
        <v-text-field
          prepend-inner-icon="mdi-pill"
          class="mt-4"
          density="compact"
          v-model="categoryStore.form_create_data.Name"
          :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່!']"
          label="ເພີ່ມປະເພດປະເພດ"
          variant="outlined"
          required
        />

        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-4"
          density="compact"
        >
          {{ categoryStore.form_create_data.ID ? "ອັບເດດ" : "ບັນທຶກ" }}
        </v-btn>
      </v-form>
    </v-card></v-section
  >
</template>
