<script setup lang="ts">
const title = "ໜ້າສ້າງເມນູຫຼັກ";
const form = ref();
const valid = ref(false);
const menuStore = useMenuStore();
const request = menuStore.form_create_data;
const Destription = ()=>{
    valid.value = !valid.value;
}
const handlSubmit = async ()=>{
    try {
        const valid = await form.value.validate();
        if(valid){
            await menuStore.creatMainmenu();
        }
    } catch (error) {
        console.error("Error creating main menu:", error);
        
    }
}
</script>
<template>
  <GlobalTextTitleLine :title="title" />
  <v-col cols="12">
    <v-form ref="form" @submit.prevent="handlSubmit" >
      <v-row>
        <v-col cols="12" md="6">
          <label>ຊື່ເມນູ</label>
          <v-text-field
          v-model="request.name"
          @click:append="Destription"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ']"
            placeholder="ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"
            density="compact"
            variant="outlined"
            hide-details="auto"
            class="pb-6"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <label>ໄອຄອນເມນູ</label>
          <v-text-field
            v-model="request.icon"
            :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ']"
            placeholder="ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"
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
