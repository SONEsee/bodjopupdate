<script setup lang="ts">
const roleStore = useRoleStore();
const visible = ref(false);
const form = ref();
const title = "ເພີ່ມຂໍ້ມູນສິດການໍາໃຊ້";

const Description = () => {
  visible.value = !visible.value;
};

const request = roleStore.form_create_data;

const handleSubmit = async () => {
  try {
    const { valid } = await form.value.validate();
    
    if (valid) {
      await roleStore.CreateRole();
      
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
        :disabled="roleStore.isloading"
      >
        <label class="d-flex justify-start">ຊື່ບົດບາດ / Role Name</label>
        <v-text-field
          @click:append-inner="Description"
          v-model="request.name"
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
          v-model="request.description"
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