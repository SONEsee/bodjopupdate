<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3 class="">ເພີ່ມຂໍ້ມູນໂຕແທນ</h3>
        <v-divider></v-divider>
        <div class="d-flex justify-end mt-2">
          <v-btn color="primary" class="rounded-lg"
            ><v-icon icon="mdi-lock-outline" class="mr-2"></v-icon
            >ອັບເດດລະຫັດຜ່ານ</v-btn
          >
        </div>
      </v-col>
    </v-row>

    <v-line></v-line>
    <v-container>
      <v-form widh="100%" ref="form" @submit.prevent="EditAgency">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="pa-4 text-center" outlined>
              <v-col cols="12">
                <v-avatar size="150" class="mx-auto" color="grey lighten-2">
                  <!-- <img src="" alt="Profile Picture" /> -->
                </v-avatar>
              </v-col>
              <v-col cols="12">
                <v-btn
                  type="submit"
                  class="mt-4 mb-7 rounded-lg"
                  style="width: 150"
                  color="primary"
                >
                  <v-icon icon="mdi-cloud-upload-outline" class="mr-2"></v-icon>
                  <p>ອັບໂຫຼດຮູບພາບ</p>
                </v-btn>
              </v-col>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-row style="font-size: 90%">
              <v-col cols="12" md="4">
                <label for="name">ຊື່ ແລະ ນາມສະກຸນ / Fullname</label>
                <v-text-field
                v-model="name"
                :rules = "[v => !!v || 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ']"
                  @click:append-inner="toggleVisibility"
                  id="name"
                  placeholder="ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"
                  density="compact"
                  variant="outlined"
                ></v-text-field>

                <label for="code">ລະຫັດຕົວແທນ / Agency code</label>
                <v-text-field
                  v-model="agencycode"
                  :rules = "[v => !!v || 'ກະລຸນາປ້ອນລະຫັດຕົວແທນ']"
                  id="code"
                  placeholder="ກະລຸນາປ້ອນລະຫັດຕົວແທນ"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                <label for="districts">ເມືອງ / Districts</label>
                <v-select
                v-moldel="districts"
                :rules = "[v => !!v || 'ກະລຸນາເລືອກເມື່ອງ']"
                  id="districts"
                  placeholder="ກາລຸນາເລືອກເມື່ອງ"
                  density="compact"
                  :items="['ພູຄາ', 'ນາປົງ', 'ປາກລາຍ', 'ວຽງຈັນ']"
                  variant="outlined"
                ></v-select>
                <label for="status">ສະຖານະ / Status</label>
                <v-select
                v-model="status"
                :rules = "[v => !!v || 'ກະລຸນາເລືອກສິດເຂົ້ານຳໃຊ້']"
                  id="status"
                  placeholder="ກາລຸນາເລືອກສິດເຂົ້ານຳໃຊ້"
                  density="compact"
                  :items="['ພູຄາ', 'ນາປົງ', 'ປາກລາຍ', 'ວຽງຈັນ']"
                  variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <label for="nickname">ຊື່ຫຼິ້ນ / Nickname</label>
                <v-text-field
                v-model="nickname"
                :rules = "[v => !!v || 'ກະລຸນາປ້ອນຊື່ຫຼິນ']"
                  id="nickname"
                  placeholder="ກະລຸນາປ້ອນຊື່ຫຼິນ"
                  density="compact"
                  variant="outlined"
                ></v-text-field>

                <label for="role">ສິດການເຂົ້າໃຊ້ງານ / Role access</label>
                <v-text-field
                v-model="role"
                :rules = "[v => !!v || 'ກະລຸນາປ້ອນສິດການເຂົ້ານຳໃຊ້']"
                  id="role"
                  placeholder="ກະລຸນາປ້ອນສິດການເຂົ້ານຳໃຊ້"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                <label for="villages">ບ້ານ / Villages</label>
                <v-select
                v-model="villages"
                :rules = "[v => !!v || 'ກະລຸນາເລືອກບ້ານ']"
                  id="villages"
                  placeholder="ກາລຸນາເລືອກບ້ານ"
                  density="compact"
                  :items="['ພູຄາ', 'ນາປົງ', 'ປາກລາຍ', 'ວຽງຈັນ']"
                  variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <label for="phone">ເບີໂທລະສັບ / phone number</label>
                <v-text-field
                v-model="phone"
                :rules = "[v => !!v || 'ກະລຸນາປ້ອນເບີໂທລະສັບ']"
                  id="phone"
                  placeholder="ກະລຸນາປ້ອນເບີໂທລະສັບ"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                <label for="provinces">ແຂວງ / Provinces</label>
                <v-select
                v-model="provinces"
                :rules = "[v => !!v || 'ກະລຸນາເລືອກແຂວງ']"
                  id="provinces"
                  placeholder="ກາລຸນາແຂວງ"
                  density="compact"
                  :items="['ພູຄາ', 'ນາປົງ', 'ປາກລາຍ', 'ວຽງຈັນ']"
                  variant="outlined"
                ></v-select>
                <label for="username">ຊື້ຜູ້ໃຊ້ງານ / Username</label>
                <v-text-field
                v-model="username"
                :rules = "[v => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
                  id="username"
                  placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col> </v-row
      ></v-form>
    </v-container>

    <v-row>
      <v-col cols="12" md="6">
        <v-file-input
          label="ການໃຫ້ເປີເຊັນ / Commissions"
          density="compact"
          variant="underlined"
          append-inner-icon="mdi-file-document-plus-outline"
          class="text-field-black-label"
        ></v-file-input>

        <v-data-table-virtual
          style="font-size: 80%"
          :items="commissions"
          :headers="headers"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" class="me-2" size="small">
              mdi-pencil
            </v-icon>
            <v-icon color="error" size="small"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data> </template>
        </v-data-table-virtual>
      </v-col>
      <v-col cols="12" md="6">
        <v-file-input
          id="username"
          label="ເອກະສານລະບຸຕົວຕົນ / Identifications"
          density="compact"
          variant="underlined"
          append-inner-icon="mdi-file-document-plus-outline"
          class="text-field-black-label hide-file-icon"
        ></v-file-input>

        <v-data-table-virtual
          style="font-size: 80%"
          :items="identifications"
          :headers="headers1"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" class="me-2" size="small">
              mdi-pencil
            </v-icon>
            <v-icon color="error" size="small"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data> </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

import { ref } from "vue";
const form = ref();
const visible = ref(false);
const name = ref(null);
const agencycode = ref(null);
const districts = ref(null);
const status = ref(null);
const nickname = ref(null);
const role = ref(null);
const villages = ref(null);
const phone = ref(null);
const provinces = ref(null);
const username = ref(null);
const password = ref(null);


const toggleVisibility = () => {
  visible.value = !visible.value;
};
const EditAgency = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      console.log("name");
    }
  } catch (e) {
    console.log(e);
  }
};



const headers = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ປະເພດໃຫ້ການ", value: "type" },
  { title: "ເປີເຊັນ ຫຼື ຈຳນວນເງິນ", value: "percent" },
  { title: "ສ່ວນແບ່ງທີ່ໃຫ້", value: "carbs" },
  { title: "ຈຳນວນເງິນ", value: "money" },
  { title: "Actions", value: "actions" },
];
const headers1 = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ປະເພດໃຫ້ການ", value: "type" },
  { title: "ເລກທີ", value: "no" },
  { title: "ຮູບພາບ", value: "image" },
  { title: "Actions", value: "actions" },
];
const commissions = [
  {
    id: "1",
    type: 159,
    percent: 6,
    carbs: 24,
    money: 4,
  },
];
const identifications = [
  {
    id: "1",
    type: 159,
    no: 6,
    image: 24,
    protein: 4,
  },
];
</script>

<style scoped>
.text-h5 {
  margin-bottom: 16px;
}
.text-field-black-label .v-label {
  color: #000000 !important;
}
.hide-file-icon .v-input__control .v-icon {
  display: none;
}
</style>
