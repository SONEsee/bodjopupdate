<script setup lang="ts">
const schedStore = useSchedulesStore();
const visible = ref(false);
const form = ref();
const title = "ແກ້ໄຂຂໍ້ມູນໂມງເຂົ້າອອກວຽກ";
const route = useRoute();
const id = Number(route.query.id) || 0;
onMounted(async () => {
  await schedStore.GetdataDetail(id);
  if(schedStore.resposns_data_schedules_detail){
    const detail = schedStore.resposns_data_schedules_detail
    schedStore.update_form_data={
        shift_start: detail.shift_start,
        shift_end: detail.shift_end,
    }
  }
});
const Description = () => {
  visible.value = !visible.value;
};

const request = schedStore.create_form_data;

const handleSubmit = async () => {
  try {
    const { valid } = await form.value.validate();
    
    if (valid) {
      await schedStore.UpdateSchedules(id);
      
      CallSwal({
        title: "ສໍາເລັດ",
        text: "ທ່ານສ້າງທຸກຢາງສໍາເລັດ",
        icon: "success",
      });
      
      
      form.value.reset();
      
      
      visible.value = false;
    }
  } catch (error) {
    console.error("Error creating schedule:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການສ້າງຂໍ້ມູນ",
      icon: "error",
    });
  }
};

const handleCancel = () => {
  form.value.reset();
  visible.value = false; 
};


const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) { // ທຸກໆ 30 ນາທີ
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push({
        value: timeString,
        title: displayTime
      });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();


const timeValidation = (v: string) => {
  if (!v) return 'ກະລຸນາເລືອກເວລາ';
  return true;
};


const validateTimeRange = () => {
  if (request.shift_start && request.shift_end) {
    const startTime = new Date(`1970-01-01T${request.shift_start}:00`);
    const endTime = new Date(`1970-01-01T${request.shift_end}:00`);
    
    if (startTime >= endTime) {
      return 'ເວລາເລີ່ມຕ້ອງນ້ອຍກວ່າເວລາສິ້ນສຸດ';
    }
  }
  return true;
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
        
      >
       
        <label class="d-flex justify-start">ເວລາເລີ່ມເຮັດວຽກ</label>
        <v-select
          v-model="schedStore.update_form_data.shift_start"
          :items="timeOptions"
          :rules="[timeValidation, validateTimeRange]"
          placeholder="ເລືອກເວລາເລີ່ມ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          
          prepend-inner-icon="mdi-clock-start"
        ></v-select>
        
        
        <label class="d-flex justify-start">ເວລາສິ້ນສຸດການເຮັດວຽກ</label>
        <v-select
          v-model="schedStore.update_form_data.shift_end"
          :items="timeOptions"
          :rules="[timeValidation, validateTimeRange]"
          placeholder="ເລືອກເວລາສິ້ນສຸດ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
         
          prepend-inner-icon="mdi-clock-end"
        ></v-select>

<!--        
        <label class="d-flex justify-start">ຊື່ກະຫນົດການ (ທາງເລືອກ)</label>
        <v-text-field
          v-model="request.schedule_name"
          placeholder="ຕົວຢ່າງ: ກະຫນົດການເຮັດວຽກປົກກະຕິ"
          density="compact"
          variant="outlined"
          hide-details="auto"
          class="pb-6"
          :disabled="schedStore.isloading"
        ></v-text-field> -->
        
        <div class="d-flex justify-center gap-4">
          <v-btn
            text="ບັນທືກ"
            color="primary"
            type="submit"
            
            prepend-icon="mdi-content-save"
          ></v-btn>
          <v-btn
            text="ຍົກເລີກ"
            color="error"
            :disabled="schedStore.isloading"
            @click="handleCancel"
            prepend-icon="mdi-close"
          ></v-btn>
        </div>
      </v-form>
    </section>
  </v-col>
</template>