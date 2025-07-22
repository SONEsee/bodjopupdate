<script setup lang="ts">
const positionStore = usePositoinStore();
const visible = ref(false);
const form = ref();
const title = "ເພີ່ມຂໍ້ມູນສິດການໍາໃຊ້";
const basStore = useBasalaryStore();

const bas = computed(() => {
  const data = basStore.response_data_basalary;
  // ກວດສອບວ່າຂໍ້ມູນມີຢູ່ແລະເປັນ array ຫຼືບໍ່
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  // ແປງຂໍ້ມູນໃຫ້ເໝາະສຳລັບ v-autocomplete
  return data.map(item => ({
    title: `${parseFloat(item.salary).toLocaleString()} LAK`, // ສະແດງເງິນເດືອນ
    value: item.base_sal_id, // ຄ່າທີ່ຈະເກັບໄວ້
    salary: item.salary // ຂໍ້ມູນເພີ່ມເຕີມ
  }));
});

const Description = () => {
  visible.value = !visible.value;
};

onMounted(() => {
  basStore.getBasalary();
});

const request = positionStore.form_create_positoin;

const handleSubmit = async () => {
  try {
    const { valid } = await form.value.validate();

    if (valid) {
      await positionStore.createPosition();

      CallSwal({
        title: "ສໍາເລັດ",
        text: "ທ່ານສ້າງທຸກຢາງສໍາເລັດ",
        icon: "success",
      });

      form.value.reset();
    }
  } catch (error) {
    console.error("Error creating role:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການສ້າງຂໍ້ມູນ",
      icon: "error",
    });
  }
};

const handleCancel = () => {
  form.value.reset();
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
        :disabled="positionStore.isloading"
      >
        <label class="d-flex justify-start">ຊື່ຂັ້ນ</label>
        <v-text-field
          @click:append-inner="Description"
          v-model="request.position_name"
          :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຂັ້ນຫຼືຕຳແໜ່ງ']"
          placeholder="ກະລຸນາປ້ອນຊື່ຂັ້ນ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="positionStore.isloading"
        ></v-text-field>

        <label class="d-flex justify-start">ເງິນເດືອນ / Salary</label>
        <v-autocomplete
          v-model="request.base_sal_id"
          :items="bas"
          item-title="title"
          item-value="value"
          :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເງິນເດືອນ']"
          placeholder="ກະລຸນາເລືອກເງິນເດືອນ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="positionStore.isloading"
          :loading="!bas || bas.length === 0"
          no-data-text="ບໍ່ມີຂໍ້ມູນ"
          clearable
        ></v-autocomplete>

        <label class="d-flex justify-start">ຂັ້ນເງິນລວງເວລາ / OT</label>
        <v-text-field
          v-model="request.rate_ot"
          :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເງິນໂບນັດ']"
          placeholder="ກະລຸນາປ້ອນລາຍລະອຽດ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="positionStore.isloading"
          type="number"
        ></v-text-field>

        <v-btn
          text="ບັນທືກ"
          color="primary"
          class="mr-4"
          type="submit"
          :loading="positionStore.isloading"
        ></v-btn>
        <v-btn
          text="ຍົກເລີກ"
          color="error"
          :disabled="positionStore.isloading"
          @click="handleCancel"
        ></v-btn>
      </v-form>
    </section>
  </v-col>
</template>