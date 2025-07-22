<script setup lang="ts">
const menuStore = useTestStore();
const requet = menuStore.reques_data_form;
const form = ref();
const valid = ref(false);
const handlSubmit = async () => {
  try {
    const { valid: isValid } = await form.value.validate();
    if (isValid) {
      await menuStore.createApp();
    }
  } catch (error) {
    console.error("Error creating employee:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ",
      icon: "error",
    });
  }
};
</script>
<template>
  <v-form ref="form" @submit.prevent="handlSubmit">
    <v-col cols="12">
      <v-row>
        <v-col cols="12 " md="6">
          <v-text-field
            density="compact"
            variant="outlined"
            v-model="requet.icon"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            density="compact"
            variant="outlined"
            v-model="requet.name"
          ></v-text-field
        ></v-col>
      </v-row>
      <div class="d-flex justify-center">
        <v-btn color="primary" class="mr-2" type="submit">ບັກທືກ</v-btn>
        <v-btn color="warning" class="text-primary">
          <b>ຍົກເລີກ</b>
        </v-btn>
      </div>
    </v-col>
  </v-form>
</template>
