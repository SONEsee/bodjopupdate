<script lang="ts" setup>
import axios from "@/helpers/axios";
import notfounfimages from "@/assets/img/404.png";
import { UseAgencyStore } from "~/stores/agency";
import { UseGlobalStore } from "~/stores/global";
const notfoundref = ref(notfounfimages);
import { UseGetFormatDatePicker } from "~/composables/global";
import { CallSwal,GetImageUrl  } from "~/composables/global";

const agencyStore = UseAgencyStore();
const globalStore = UseGlobalStore();
const title = ref("ເພີ່ມຂໍ້ມູນຕົວແທນ");
const visible = ref(false);
const loading = ref(false);
const form = ref();
const file = ref();

const request = computed({
  get() {
    return agencyStore.response_detail_query_data;
  },
  set(value) {
    agencyStore.response_detail_query_data = value;
  },
});

const provinceChange = async (province_id: number | null) => {
  await globalStore.GetDistrictData(province_id, null);
  if (request.value !== null) {
    request.value.village.district_id = null;
    request.value.village_id = null;
  }
};

const districtChange = async (district_id: number | null) => {
  await globalStore.GetVillagesData(district_id?.toString() ?? null, null);
  if (request.value !== null) {
    request.value.village_id = null;
  }
};

const onDebounceVillage = useDebounceFn(async (value: string) => {
  await globalStore.GetVillagesData(
    request.value?.village.district_id?.toString() ?? null,
    value ?? null
  );
}, 1000);

const openFile = () => {
  file.value.click();
};

const onFileChange = (event: Event) => {
  console.log(`event`, event);
  //@ts-ignore
  const files = event.target.files;
  let file = files[0];
  console.log(`file`, file);
  if (file) {
    const value = file as File;
    if (request.value !== null) {
      request.value.image_profile = value;
    }
  }
};

const submitForm = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      const notification = await CallSwal({
        icon: "warning",
        title: "ຄຳເຕືອນ",
        text: `ທ່ານກຳລັງແກ້ໄຂຂໍ້ມູນທ່ານແນ່ໃຈແລ້ວບໍ່?`,
        showCancelButton: true,
        confirmButtonText: "ຕົກລົງ",
        cancelButtonText: "ຍົກເລີກ",
      });

      if (notification.isConfirmed) {
        loading.value = true;
        let req = {
          fullname: request.value?.fullname ?? "",
          nick_name: request.value?.nick_name ?? "",
          phone_number: request.value?.phone_number ?? "",
          agency_code: request?.value?.agent_code ?? "",
          agency_type: request?.value?.agent_type ?? "",
          village_id: request?.value?.village_id ?? "",
          username: request?.value?.username ?? "",
          status: request?.value?.status ?? 0,
          file: request?.value?.image_profile,
        };

        var formData = new FormData();
        for (const [key, value] of Object.entries(req)) {
          if (key === "file") {
            if (typeof value === "object") {
              const file = value as File;
              formData.append("profile_image", file, file.name);
            }
          } else {
            formData.append(key, value?.toString() ?? "");
          }
        }
        const path = `/api/v1/agency/update-data/${request.value?.id ?? ""}`;
        const res = await axios.put(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 200) {
          const notification = await CallSwal({
            icon: "success",
            title: "ສຳເລັດ",
            text: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
          });
          if (notification.isConfirmed) {
            setTimeout(() => {
              goPath("/agency");
            }, 1200);
          } else {
            setTimeout(() => {
              goPath("/agency");
            }, 1200);
          }
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
</script>

<template>
  <section v-if="request != null">
    <v-form ref="form" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine :title="title" />
        </v-col>

        <v-col cols="12" class="d-flex flex-wrap justify-end">
          <v-btn color="primary" flat type="submit" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </v-col>

        <v-col cols="12" class="pt-12">
          <v-row>
            <v-col cols="4">
              <v-row>
                <v-col cols="12" class="d-flex flex-wrap justify-center">
                  <v-avatar
                    size="220"
                    class="mx-auto"
                    :image="GetImageUrl(request.image_profile)"
                  >
                  </v-avatar>
                </v-col>

                <v-col cols="12" class="d-flex flex-wrap justify-center">
                  <v-btn
                    class="mt-4 mb-7"
                    width="180px"
                    height="40px"
                    color="primary"
                    flat
                    prepend-icon="mdi-cloud-upload-outline"
                    text="ອັບໂຫຼດຮູບພາບ"
                    @click="openFile"
                  >
                  </v-btn>

                  <input
                    type="file"
                    ref="file"
                    style="display: none"
                    accept="image/jpg,image/png,image/jpeg"
                    @change="onFileChange"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="8">
              <v-row>
                <v-col cols="12" md="4">
                  <label>ຊື່ ແລະ ນາມສະກຸນ / Fullname</label>
                  <v-text-field
                    @click:append-inner="visible = !visible"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ']"
                    v-model="request.fullname"
                    placeholder="ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-text-field>

                  <label>ລະຫັດຕົວແທນ / Agency code</label>
                  <v-text-field
                    v-model="request.agent_code"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຕົວແທນ']"
                    placeholder="ກະລຸນາປ້ອນລະຫັດຕົວແທນ"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                    class="pb-6"
                  ></v-text-field>

                  <label>ເມືອງ / Districts</label>
                  <v-select
                    v-model="request.village.district_id"
                    :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກເມືອງ']"
                    placeholder="ກາລຸນາເລືອກເມືອງ"
                    density="compact"
                    :items="globalStore.districts"
                    item-value="id"
                    item-title="dr_name"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                    @update:model-value="districtChange"
                  ></v-select>

                  <label>ສະຖານະ / Status</label>
                  <v-select
                    v-model="request.status"
                    placeholder="ກາລຸນາເລືອກສິດເຂົ້ານຳໃຊ້"
                    density="compact"
                    :items="GetDefaultStatus()"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-select>
                </v-col>

                <v-col cols="4">
                  <label>ຊື່ຫຼິ້ນ / Nickname</label>
                  <v-text-field
                    v-model="request.nick_name"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຫຼິນ']"
                    placeholder="ກະລຸນາປ້ອນຊື່ຫຼິນ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-text-field>

                  <label>ສິດການເຂົ້າໃຊ້ງານ / Role access</label>
                  <v-select
                    v-model="request.agent_type"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນສິດການເຂົ້ານຳໃຊ້']"
                    placeholder="ກະລຸນາປ້ອນສິດການເຂົ້ານຳໃຊ້"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                    :items="GetAgencyType()"
                  ></v-select>

                  <label>ບ້ານ / Villages</label>
                  <v-autocomplete
                    v-model="request.village_id"
                    :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກບ້ານ']"
                    placeholder="ກາລຸນາເລືອກບ້ານ"
                    density="compact"
                    :items="globalStore.villages"
                    item-value="id"
                    item-title="vill_name"
                    variant="outlined"
                    hide-details="auto"
                    @update:search="onDebounceVillage"
                    class="pb-6"
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <label>ເບີໂທລະສັບ / Phone number</label>
                  <v-text-field
                    v-model="request.phone_number"
                    hide-details="auto"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນເບີໂທລະສັບ']"
                    placeholder="ກະລຸນາປ້ອນເບີໂທລະສັບ"
                    density="compact"
                    variant="outlined"
                    class="pb-6"
                  ></v-text-field>

                  <label>ແຂວງ / Provinces</label>
                  <v-select
                    v-model="request.village.district.province_id"
                    hide-details="auto"
                    :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກແຂວງ']"
                    placeholder="ກາລຸນາແຂວງ"
                    density="compact"
                    :items="globalStore.provinces"
                    item-title="pr_name"
                    item-value="id"
                    variant="outlined"
                    class="pb-6"
                    @update:model-value="provinceChange"
                  ></v-select>

                  <label>ຊື້ຜູ້ໃຊ້ງານ / Username</label>
                  <v-text-field
                    v-model="request.username"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
                    placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row>
            <v-col cols="6"></v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <div class="d-flex flex-wrap justify-space-between">
                    <div class="d-flex flex-wrap align-center">
                      <h4>ເອກະສານລະບຸຕົວຕົນ</h4>
                    </div>

                    <div>
                      <v-btn
                        variant="text"
                        icon="mdi-note-plus"
                        size="medium"
                        @click="agencyStore.identity_request.dialog = true"
                      ></v-btn>
                    </div>
                  </div>

                  <v-col cols="12" class="pa-0 ma-0">
                    <v-divider color="black" :thickness="2"></v-divider>
                  </v-col>
                </v-col>
                <v-col cols="12">
                  <AgencyEditComponentTableIdentities />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </section>
</template>
