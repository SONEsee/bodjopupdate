<template>
  <section>
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine
          :title="'ເພີ່ມຂໍ້ມູນປະເພດລາຍຈ່າຍ / Create new expense type'"
        />
      </v-col>

      <v-col cols="12">
        <v-form ref="form" @submit.prevent="Create">
          <v-row>
            <v-col cols="3">
              <label>ຊື່ພາສາລາວ / Name</label>
              <v-text-field
                v-model="name"
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ພາສາລາວ']"
                density="compact"
                variant="outlined"
                dense
              ></v-text-field
            ></v-col>

            <v-col cols="3">
              <label>ຊື່ພາສາອັງກິດ / Name English</label>
              <v-text-field
                v-model="name_en"
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ']"
                density="compact"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="d-flex flex-wrap justify-center">
              <div class="mr-3">
                <v-btn
                  color="primary"
                  flat
                  width="180px"
                  type="submit"
                  :loading="loading"
                  >ບັນທຶກ</v-btn
                >
              </div>

              <div>
                <v-btn
                  color="grey"
                  flat
                  width="180px"
                  @click="goPath('/expense_type_managements')"
                >
                  ຍົກເລີກ</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </section>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import axios from "@/helpers/axios";

const name = ref("");
const name_en = ref("");
const form = ref();
const loading = ref(false);

const Create = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      loading.value = true;
      const response = await axios.post("/api/v1/expense-types/new", {
        name: name.value,
        name_en: name_en.value,
      });

      if (response.status === 200) {
        const notification = await CallSwal({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ການເພີ່ມຂໍ້ມູນສຳເລັດ",
        });

        if (notification.isConfirmed) {
          delayGoPath("/expense_type_managements");
        } else {
          delayGoPath("/expense_type_managements");
        }
      }
    }
  } catch (e) {
    console.log(e);
    DefaultSwalError(e);
  } finally {
    loading.value = false;
  }
};
</script>
