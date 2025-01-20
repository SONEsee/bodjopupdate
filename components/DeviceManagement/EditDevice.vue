<template>
  <section>
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine
          :title="'ການແກ້ໄຂຂໍ້ມູນອຸປະກອນ / Edit Device'"
        ></GlobalTextTitleLine>
      </v-col>

      <v-col cols="12">
        <v-form ref="form" @submit.prevent="handleEdit">
          <v-row>
            <v-col cols="3">
              <label for="id"><p class="ml-2">ລະຫັດ POS / Pos No</p></label>
              <v-text-field
                v-model="formData.pos_no"
                @click:append-inner="DeviceManagementEdit"
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນລະຫັດ POS']"
                density="compact"
                class="pa-2"
                color="primary"
                variant="outlined"
                label="ກະລຸນາປ້ອນລະຫັດ POS"
                outlined
                dense
              ></v-text-field
            ></v-col>

            <v-col cols="3">
              <label for="code"
                ><p class="ml-2">ລະຫັດ IMEI / IMEI Code</p></label
              >
              <v-text-field
                v-model="formData.imei"
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນລະຫັດ IMEI']"
                density="compact"
                class="pa-2"
                color="primary"
                label="ກະລຸນາປ້ອນລະຫັດ IMEI"
                variant="outlined"
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="d-flex justify-center">
            <v-btn color="primary" width="180px" flat type="submit"
              ><p class="">ບັນທຶກ</p></v-btn
            >

            <v-btn
              color="#90A4AE"
              class="ml-6"
              width="180px"
              flat
              @click="goPath('/devices')"
              >ຍົກເລິກ</v-btn
            >
          </div>
        </v-form>
      </v-col>
    </v-row>

    <GlobalOverlayLoading :loading="loading" />
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "@/helpers/axios";
import { DeviceModel } from "@/models/";
const loading = ref(false);
const route = useRoute();
const query = route.query;
const id = query.id?.toString() || "";
const form = ref();
const formData = ref({
  pos_no: "",
  imei: "",
});

const fetdata = async () => {
  try {
    loading.value = true;
    const response = await axios.get<DeviceModel.DeviceResponse>(
      `/api/v1/devices/detail/${id}`
    );

    if (response.status === 200) {
      formData.value = {
        pos_no: response.data.items.pos_no,
        imei: response.data.items.imei,
      };
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const validate = ref(false);
const DeviceManagementEdit = () => {
  validate.value = !validate.value;
};

const handleEdit = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      loading.value = true;
      const response = await axios.post<DeviceModel.DeviceResponse>(
        `/api/v1/devices/update-data/${id}`,
        formData.value
      );
      loading.value = false;
      if (response.status === 200) {
        const successNotification = await CallSwal({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ການແກ້ໄຂຂໍ້ມູນອຸປະກອນສຳເລັດ",
        });

        if (successNotification.isConfirmed) {
          delayGoPath("/devices");
        } else {
          delayGoPath("/devices");
        }
      }
    }
  } catch (error) {
    console.error(error);
    DefaultSwalError(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetdata();
});
</script>
