<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const positionStore = usePositoinStore();

const id = Number(route.query.id) || 0;
const visible = ref(false);
const form = ref();
const title = "ແກ້ໄຂຂໍ້ມູນຕຳແໜ່ງ"; // Updated title to reflect update action

// Computed property for position details
const positionDetails = computed(() => {
  return positionStore.resposn_detail_data_positoin;
});

// Single onMounted with proper async handling
onMounted(async () => {
  try {
    // First get the position details
    await positionStore.getDataDetail(id);

    // Then populate the form if data exists
    if (positionStore.resposn_detail_data_positoin) {
      const detail = positionStore.resposn_detail_data_positoin;
      positionStore.form_uadate_positoin = {
        position_name: detail.position_name,
        salary_rate: detail.salary_rate,
        ot_rate: detail.ot_rate,
      };
    }
  } catch (error) {
    console.error("Error loading position details:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ",
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
      await positionStore.Update(id);

      CallSwal({
        title: "ສໍາເລັດ",
        text: "ທ່ານແກ້ໄຂຂໍ້ມູນສໍາເລັດແລ້ວ",
        icon: "success",
      });
    }
  } catch (error) {
    console.error("Error updating position:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ",
      icon: "error",
    });
  }
};

const handleCancel = () => {
  if (positionStore.resposn_detail_data_positoin) {
    const detail = positionStore.resposn_detail_data_positoin;
    positionStore.form_uadate_positoin = {
      position_name: detail.position_name,
      salary_rate: detail.salary_rate,
      ot_rate: detail.ot_rate,
    };
  }
};
</script>

<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />

    <div
      v-if="positionStore.isloading && !positionDetails"
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
        :disabled="positionStore.isloading"
      >
        <div class="mb-4">
          <label class="d-flex justify-start mb-2">ຊື່ຕຳແໜ່ງ</label>
          <v-text-field
            @click:append-inner="Description"
            v-model="positionStore.form_uadate_positoin.position_name"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຕຳແໜ່ງ']"
            placeholder="ກະລຸນາປ້ອນຊື່ຕຳແໜ່ງ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :disabled="positionStore.isloading"
          ></v-text-field>
        </div>

        <div class="mb-4">
          <label class="d-flex justify-start mb-2">ເງິນເດືອນ (Salary)</label>
          <v-text-field
            v-model="positionStore.form_uadate_positoin.salary_rate"
            :rules="[(v: string | number) => (!!v || v === 0) || 'ກະລຸນາປ້ອນເງິນເດືອນ']"
            placeholder="ກະລຸນາປ້ອນເງິນເດືອນ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :disabled="positionStore.isloading"
            type="number"
            min="0"
            step="0.01"
          ></v-text-field>
        </div>

        <div class="mb-6">
          <label class="d-flex justify-start mb-2">ອັດຕາ OT</label>
          <v-text-field
            v-model="positionStore.form_uadate_positoin.ot_rate"
            :rules="[(v: string | number) => (!!v || v === 0) || 'ກະລຸນາປ້ອນອັດຕາ OT']"
            placeholder="ກະລຸນາປ້ອນອັດຕາ OT"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :disabled="positionStore.isloading"
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
            :loading="positionStore.isloading"
            variant="elevated"
          ></v-btn>
          <v-btn
            text="ຍົກເລີກ"
            color="error"
            :disabled="positionStore.isloading"
            @click="handleCancel"
            variant="outlined"
          ></v-btn>
        </div>
      </v-form>
    </section>
  </v-col>
</template>
