<script lang="ts" setup>
import axios from "@/helpers/axios";
import notfounfimages from "@/assets/img/404.png";
const notfoundref = ref(notfounfimages);
import { AgencyModel } from "@/models/";

const agencyStore = UseAgencyStore();
const globalStore = UseGlobalStore();
const title = ref("ເພີ່ມຂໍ້ມູນຕົວແທນ");
const visible = ref(false);
const loading = ref(false);
const form = ref();
const file = ref();

const request = agencyStore.form_create_data;

const provinceChange = async (province_id: number | null) => {
  await globalStore.GetDistrictData(province_id, null);
  request.district_id = null;
  request.village_id = null;
};

const districtChange = async (district_id: string | null) => {
  await globalStore.GetVillagesData(district_id, null);
  request.village_id = null;
};

const onDebounceVillage = useDebounceFn(async (value: string) => {
  await globalStore.GetVillagesData(request.district_id, value ?? null);
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
    request.profile_image = value;
  }
};

const submitForm = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      loading.value = true;
      var formData = new FormData();
      let allowFileKey = ["profile_image"];
      for (const [key, value] of Object.entries(request)) {
        if (allowFileKey.includes(key)) {
          if (Array.isArray(value)) {
            //looping for upload
            const files = value as unknown as File[];
            if (files) {
              for (let i = 0; i < files.length; i++) {
                let file = files[i];
                formData.append(key, file, file.name);
              }
            }
          } else {
            let file = (value as File) ?? null;
            if (file !== null) {
              formData.append(key, file, file.name);
            }
          }
        } else if (key === "identities") {
          formData.append("identities", JSON.stringify(value));
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              const identity = value[i];
              if (identity.file !== null) {
                console.log(`iden`, identity.file.type);
                formData.append(
                  "identities_files",
                  identity.file,
                  `${i}.${identity.file.type.split("/")[1]}`
                );
              }
            }
          }
        } else {
          formData.append(key, value?.toString() ?? "");
        }
      }

      const res = await axios.post("/api/v1/agency/new", formData, {
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
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section>
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
                    :image="
                      request.profile_image === null
                        ? notfoundref
                        : GetImageUrl(request.profile_image)
                    "
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
                    v-model="request.agency_code"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຕົວແທນ']"
                    placeholder="ກະລຸນາປ້ອນລະຫັດຕົວແທນ"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                    class="pb-6"
                  ></v-text-field>

                  <label>ເມືອງ / Districts</label>
                  <v-select
                    v-model="request.district_id"
                    :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກເມືອງ']"
                    placeholder="ກາລຸນາເລືອກເມື່ອງ"
                    density="compact"
                    :items="globalStore.districts"
                    item-value="id"
                    item-title="dr_name"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                    @update:model-value="districtChange"
                  ></v-select>

                  <label>ລະຫັດຜ່ານ / Password</label>
                  <v-text-field
                    v-model="request.password"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
                    placeholder="ກະລຸນາປ້ອນລະຫັດຜ່ານ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-text-field>
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
                    v-model="request.agency_type"
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

                  <label>ຢືນຢັນລະຫັດຜ່ານ / Confirm password</label>
                  <v-text-field
                    v-model="request.confirm_password"
                    hide-details="auto"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
                    placeholder="ກະລຸນາປ້ອນລະຫັດຜ່ານ"
                    density="compact"
                    variant="outlined"
                    class="pb-6"
                  ></v-text-field>
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
                    v-model="request.province_id"
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

                  <label>ສະຖານະ / Status</label>
                  <v-select
                    v-model="request.status"
                    :rules="[(v: string) => !!v || 'ກະລຸນາເລືອກສິດເຂົ້ານຳໃຊ້']"
                    placeholder="ກາລຸນາເລືອກສິດເຂົ້ານຳໃຊ້"
                    density="compact"
                    :items="GetDefaultStatus()"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-select>
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
                  <AgencyCreateAgencyComponentsIdentitiesTable />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </section>
</template>
