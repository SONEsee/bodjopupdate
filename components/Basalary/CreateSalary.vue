<script setup lang="ts">
const basalaryStore = useBasalaryStore();

const visible = ref(false);
const form = ref();
const title = "ເພີ່ມຂໍ້ມູນເງິນເດືອນພື້ນຖານ";

// Reset form data on component mount
onMounted(() => {
  basalaryStore.form_create_data = {
    salary: "",
  };
});

const Description = () => {
  visible.value = !visible.value;
};

const handleSubmit = async () => {
  try {
    const { valid } = await form.value.validate();

    if (valid) {
      await basalaryStore.CreateBasalary();
    }
  } catch (error) {
    console.error("Error creating base salary:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຂໍ້ມູນເງິນເດືອນພື້ນຖານ",
      icon: "error",
    });
  }
};

const handleCancel = () => {
  basalaryStore.form_create_data = {
    salary: "",
  };
  
  // Navigate back to list page
  goPath('/basalary');
};

const handleReset = () => {
  basalaryStore.form_create_data = {
    salary: "",
  };
  
  // Reset form validation
  if (form.value) {
    form.value.reset();
  }
};
</script>

<template>
  <v-col cols="12">
    <GlobalTextTitleLine :title="title" />

    <section
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
            v-model="basalaryStore.form_create_data.salary"
            :rules="[(v: string | number) => (!!v || v === 0) || 'ກະລຸນາປ້ອນຈຳນວນເງິນເດືອນພື້ນຖານ']"
            placeholder="ກະລຸນາປ້ອນຈຳນວນເງິນເດືອນພື້ນຖານ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :disabled="basalaryStore.isloading"
            type="number"
            min="0"
            step="0.01"
            clearable
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
            class="mr-3"
            text="ລ້າງຂໍ້ມູນ"
            color="warning"
            :disabled="basalaryStore.isloading"
            @click="handleReset"
            variant="outlined"
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