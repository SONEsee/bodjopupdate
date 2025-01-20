<template>
  <v-section>
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine :title="'ເພີ່ມຂໍ້ມູນອຸປະກອນ'" />
      </v-col>

      <v-col cols="12">
        <v-form ref="form" @submit.prevent="Create">
          <v-row>
            <v-col cols="3">
              <label>ລະຫັດ POS / Pos No</label>
              <v-text-field
                v-model="pos_no"
                density="compact"
                class="pa-2"
                variant="outlined"
                hide-details="auto"
                :rules="[(val: string) => !!val || 'ກະລຸນາປ້ອນລະຫັດ POS']"
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <label>ລະຫັດ IMEI / IMEI Code</label>
              <v-text-field
                v-model="imei"
                density="compact"
                class="pa-2"
                variant="outlined"
                hide-details="auto"
                :rules="[(val:string) => !!val || 'ກະລຸນາປ້ອນລະຫັດ IMEI']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <div>
                <v-btn color="primary" width="180px" type="submit" flat>
                  ບັນທຶກ
                </v-btn>
                <v-btn
                  color="#90A4AE"
                  width="180px"
                  flat
                  class="ml-3"
                  @click="goPath('/devices')"
                >
                  ຍົກເລິກ
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "@/helpers/axios";
import type { DeviceModel } from "~/models";
import Swal from "sweetalert2";

const form = ref();
const pos_no = ref("");
const imei = ref("");

const Create = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      const respons = await axios.post<DeviceModel.DeviceResponse>(
        "/api/v1/devices/new",
        {
          pos_no: pos_no.value,
          imei: imei.value,
        }
      );
      if (respons.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ການເພີ່ມຂໍ້ມູນສຳເລັດ",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ການເພີ່ມຂໍ້ມູນຜິດພາດ",
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
};
</script>
