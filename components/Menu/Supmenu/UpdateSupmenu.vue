<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const id = Number(route.query.id) || 0;

const title = "ໜ້າແກ້ໄຂເມນູຍ່ອຍ";
const form = ref();
const valid = ref(false);
const menuStore = useMenuStore();

const res = computed(() => {
  return menuStore.respons_data_main_menu;
});

const request = menuStore.form_update_supmenu_data;

onMounted(async () => {
  try {
    await Promise.all([menuStore.getMainMenu(), menuStore.getDetail(id)]);

    if (menuStore.respone_sup_menu_detail) {
      const detail = menuStore.respone_sup_menu_detail;
      menuStore.form_update_supmenu_data = {
        name: detail.name || "",
        icon: detail.icon || "",
        url: detail.url || "",
        main_id: detail.main_id || 0,
      };
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

const Destription = () => {
  valid.value = !valid.value;
};

const handlSubmit = async () => {
  try {
    const { valid: isValid } = await form.value.validate();

    if (isValid) {
      await menuStore.updateSupmenu(id);
    } else {
      console.log("Form validation failed");
    }
  } catch (error) {
    console.error("Error updating submenu:", error);
  }
};
</script>

<template>
  <GlobalTextTitleLine :title="title" />

  <v-col cols="12">
    <v-form ref="form" v-model="valid" @submit.prevent="handlSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <label>ຊື່ເມນູ</label>
          <v-text-field
            v-model="menuStore.form_update_supmenu_data.name"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ເມນູ']"
            placeholder="ກະລຸນາປ້ອນຊື່ເມນູ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
            required
          />

          <label>ເມນູຫຼັກ</label>
          <v-autocomplete
            v-model="menuStore.form_update_supmenu_data.main_id"
            label="ເລືອກເມນູຫຼັກ"
            :items="res || []"
            item-title="name"
            item-value="main_id"
            variant="outlined"
            density="compact"
            :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກເມນູຫຼັກ']"
            class="pb-6"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <label>ໄອຄອນເມນູ</label>
          <v-text-field
            v-model="menuStore.form_update_supmenu_data.icon"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນໄອຄອນເມນູ']"
            placeholder="ກະລຸນາປ້ອນໄອຄອນເມນູ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
            required
          />

          <label>ລິງເມນູ</label>
          <v-text-field
            v-model="menuStore.form_update_supmenu_data.url"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລິງເມນູ']"
            placeholder="ກະລຸນາປ້ອນລິງເມນູ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
            required
          />
        </v-col>

        <v-col cols="12" class="text-center">
          <v-btn
            text="ບັນທຶກ"
            type="submit"
            color="primary"
            class="mr-4"
            :loading="menuStore.isloading"
            :disabled="!valid"
          />
          <v-btn text="ຍົກເລີກ" color="error" @click="goPath('/supmenu')" />
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>
