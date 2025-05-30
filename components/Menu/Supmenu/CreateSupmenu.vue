<script setup lang="ts">
const title = "ໜ້າສ້າງເມນນູຍອ່ຍ";
const form = ref();
const valid = ref(false);
const menuStore = useMenuStore();
const res = computed(() => {
  return menuStore.respons_data_main_menu;
});
onMounted(() => {
  menuStore.getMainMenu();
});
const request = menuStore.form_create_supmenu_data;
const Destription = () => {
  valid.value = !valid.value;
};
const handlSubmit = async () => {
  try {
    const valid = await form.value.validate();
    if (valid) {
      await menuStore.createSupmenu();
    }
  } catch (error) {
    console.error("Error creating main menu:", error);
  }
};
</script>
<template>
  <GlobalTextTitleLine :title="title" />
  <v-col cols="12">
    <v-form ref="form" @submit.prevent="handlSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <label>ຊື່ເມນູ</label>
          <v-text-field
            v-model="request.name"
            @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເມນູ']"
            placeholder="ກະລຸນາປ້ອນເມນູ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
          ></v-text-field>
          <label>ເມນູຫຼັກ</label>
          <v-autocomplete
            v-model="request.main_id"
            label="Autocomplete"
            :items="res || []"
            item-title="name"
            item-value="main_id"
            variant="outlined"
            density="compact"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <label>ໄອຄອນເມນູ</label>
          <v-text-field
            v-model="request.icon"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນໄອຄອນເມນູ']"
            placeholder="ກະລຸນາປ້ອນໄອຄອນເມນູ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
          ></v-text-field>
          <label>ໄອຄອນເມນູ</label>
          <v-text-field
            v-model="request.url"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນໄອຄອນເມນູ']"
            placeholder="ກະລຸນາປ້ອນໄອຄອນເມນູ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn
            text="ບັນທຶກ"
            type="submit"
            color="primary"
            class="mr-4"
          ></v-btn>
          <v-btn
            text="ຍົກເລີກ"
            type="submit"
            color="error"
            @click="goPath(`/mainmenu`)"
          ></v-btn>
        </v-col> </v-row
    ></v-form>
  </v-col>
</template>
