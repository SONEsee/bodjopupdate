<script setup lang="ts">
const title = "ບັນທືກພະນັກງານ";
const form = ref();
const valid = ref(false);
const menuStore = useEmployeeStore();
const positoin = usePositoinStore();
const schedStore = useSchedulesStore();
const position = computed(() => {
  return positoin.respons_data_positoin || [];
});

const schedul = computed(() => {
  return schedStore.respons_data_schedules || [];
});


onMounted(async () => {
  await schedStore.GetData();
  await menuStore.getDataEmployee();
  await positoin.getData();
});
const request = menuStore.form_create_data;
const Destription = () => {
  valid.value = !valid.value;
};
const handlSubmit = async () => {
  try {
    const { valid: isValid } = await form.value.validate();
    if (isValid) {
      await menuStore.CreateEmployee();
      CallSwal({
        title: "ສໍາເລັດ",
        text: "ທ່ານບັນທຶກຂໍ້ມູນສໍາເລັດ",
        icon: "success",
      });
      form.value.reset();
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
  <GlobalTextTitleLine :title="title" />
  
  <v-col cols="12">
    <v-form ref="form" @submit.prevent="handlSubmit">
      <v-row>
        <v-col cols="12" md="4">
          <label>ຊື່ພະນັກງານ</label>
          <v-text-field
            v-model="request.name"
            @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ']"
            placeholder="ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-text-field>

          <label>ເພດ</label>
          <v-select
            v-model="request.gender"
            :items="['ຊາຍ', 'ຍິງ']"
            :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກເພດ']"
            placeholder="ເລືອກເພດ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-select>

          <label>ຕຳແໜ່ງ</label>
          <v-autocomplete
            placeholder="ກະລຸນາທີ່ເລືອກຕຳແໜ່ງ"
            v-model="request.position_id"
            density="compact"
            :items="position"
            variant="outlined"
            item-title="position_name"
            item-value="position_id"
          ></v-autocomplete>
          <!-- <v-text-field
          v-model="request.position_id"
          @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກຕຳແໜ່ງ']"
            placeholder="ກະລຸນາທີ່ເລືອກຕຳແໜ່ງ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-text-field> -->
        </v-col>

        <v-col cols="12" md="4">
          <label>ວັນເດືອນປີເກີດ</label>
          <v-text-field
            v-model="request.birthdate"
            type="date"
            :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກວັນເກີດ']"
            placeholder="ກະລຸນາເລືອກວັນເກີດ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-text-field>
          <label>ທີ່ຢູ່</label>
          <v-text-field
            v-model="request.address"
            @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາທີ່ຢູ່']"
            placeholder="ກະລຸນາທີ່ຢູ່"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <label>ເບີໂທ</label>
          <v-text-field
            v-model="request.phone"
            @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາເບີໂທ']"
            placeholder="ກະລຸນາເບີໂທ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-text-field>
          <label>ການເຮັດວຽກ</label>
          <v-autocomplete
            placeholder="ກະລຸນາທີ່ເລືອກຕຳແໜ່ງ"
            v-model="request.schedule_id"
            density="compact"
            :items="schedul"
            variant="outlined"
            item-title="schedule_id"
            item-value="schedule_id"
          ></v-autocomplete>
          <!-- <v-text-field
            v-model="request.schedule_id"
            @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາເລືອການເຮັດວຽກ']"
            placeholder="ກະລຸນາເລືອກການເຮັດວຽກ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-4"
          ></v-text-field> -->
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
