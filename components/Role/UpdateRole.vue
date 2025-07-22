<script setup lang="ts">

const visible = ref(false);
const form = ref();
const route = useRoute();
const id = parseInt(
  (Array.isArray(route.query.id) ? route.query.id[0] : route.query.id) ?? "0",
  10
);
const roleStore = useRoleStore();
onMounted(async () => {
  await roleStore.getRoleDetail(id);
});
onMounted(async () => {
  await roleStore.getRole();
  if (roleStore.response_data_role_detail) {
    const detail = roleStore.response_data_role_detail.data;
    roleStore.form_update_data = {
      name: detail.name,
      description: detail.description,
    };
  }
});
const Description = () => {
  visible.value = !visible.value;
};

const handleSubmit = async () => {
  try {
    const { valid } = await form.value.validate();
    const id = roleStore.response_data_role_detail?.data.role_id ?? 0;
    if (valid) {
      await roleStore.UpdateRole(id);

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
    <section
      style="width: 100%; height: 60vh"
      class="d-flex justify-center align-center"
    >
      <v-form
        style="width: 60vh"
        class="text-center"
        @submit.prevent="handleSubmit"
        ref="form"
        :disabled="roleStore.isloading"
      >
        <label class="d-flex justify-start">ຊື່ບົດບາດ / Role Name</label>
        <v-text-field
          @click:append-inner="Description"
          v-model="roleStore.form_update_data.name"
          :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ບົດບາດ']"
          placeholder="ກະລຸນາປ້ອນຊື່ບົດບາດ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="roleStore.isloading"
        ></v-text-field>

        <label class="d-flex justify-start">ລາຍລະອຽດ / Description</label>
        <v-text-field
          v-model="roleStore.form_update_data.description"
          :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລາຍລະອຽດ']"
          placeholder="ກະລຸນາປ້ອນລາຍລະອຽດ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="roleStore.isloading"
        ></v-text-field>

        <v-btn
          text="ບັນທືກ"
          color="primary"
          class="mr-4"
          type="submit"
          :loading="roleStore.isloading"
        ></v-btn>
        <v-btn
          text="ຍົກເລີກ"
          color="error"
          :disabled="roleStore.isloading"
          @click="handleCancel"
        ></v-btn>
      </v-form>
    </section>
  </v-col>
</template>
