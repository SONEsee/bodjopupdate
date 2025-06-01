<script setup lang="ts">
const positionStore = usePositoinStore();
const visible = ref(false);
const form = ref();
const title = "ເພີ່ມຂໍ້ມູນສິດການໍາໃຊ້";

const Description = () => {
  visible.value = !visible.value;
};

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
        <v-text-field
          v-model="request.salary_rate"
          :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເງິນເດືອນ']"
          placeholder="ກະລຸນາປ້ອນລາຍລະອຽດ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="positionStore.isloading"
          type="number"
        ></v-text-field>
        <label class="d-flex justify-start">ເງິນເດືອນ / OT</label>
        <v-text-field
          v-model="request.ot_rate"
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
