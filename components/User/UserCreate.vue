<script lang="ts" setup>
import axios from "@/helpers/axios";
import notfounfimages from "@/assets/img/404.png";
import { UserStore } from "@/stores/user";
import { UseGlobalStore } from "@/stores/global";

import { useEmployeeStore } from "@/stores/employee"; // ແກ້ໄຂ import
import { ref, computed, onMounted } from "vue"; // ແກ້ໄຂ import
import { useRouter } from "vue-router";

const roleSore = useRoleStore();
const emStore = useEmployeeStore();
const router = useRouter();
const userStore = UserStore();
const globalStore = UseGlobalStore();

const response = computed(() => {
  return roleSore.response_data_role || [];
});

const res = computed(() => {
  return emStore.respons_data_employee;
});

const notfoundref = ref(notfounfimages);
const title = ref("ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້");
const visible = ref(false);
const loading = ref(false);
const form = ref();
const file = ref();

// ເພີ່ມ ref ສຳລັບ preview ຮູບ
const imagePreview = ref<string | null>(null);

const request = userStore.form_create_user;

onMounted(() => {
  emStore.getDataEmployee();
  roleSore.getRole();
});

const openFile = () => {
  file.value.click();
};

// ແກ້ໄຂ function onFileChange
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    const selectedFile = files[0];
    console.log('Selected file:', selectedFile);
    
    // ກວດສອບປະເພດໄຟລ໌
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG)');
      return;
    }
    
    // ກວດສອບຂະໜາດໄຟລ໌ (ບໍ່ເກີນ 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('ຂະໜາດໄຟລ໌ໃຫຍ່ເກີນໄປ (ບໍ່ເກີນ 5MB)');
      return;
    }
    
    // ເກັບໄຟລ໌ສຳລັບສົ່ງໄປ server
    request.profile_image = selectedFile;
    
    // ສ້າງ preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }
};

// ແກ້ໄຂ function GetImageUrl
const GetImageUrl = (image: string | File | null) => {
  if (!image) return notfoundref.value;
  
  // ຖ້າມີ preview ໃຫ້ໃຊ້ preview
  if (imagePreview.value) return imagePreview.value;
  
  if (typeof image === 'string') return image;
  if (image instanceof File) return URL.createObjectURL(image);
  
  return notfoundref.value;
};

const goPath = (path: string) => {
  router.push(path);
};

const submitForm = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      loading.value = true;
      
      await userStore.createUser();
      
      setTimeout(() => {
        goPath("/user");
      }, 1200);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// ເພີ່ມ function ລຶບຮູບ
const removeImage = () => {
  request.profile_image = null;
  imagePreview.value = null;
  if (file.value) {
    file.value.value = '';
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
          <v-btn 
            color="primary" 
            flat 
            type="submit" 
            :loading="loading || userStore.loading"
          >
            ບັນທຶກ
          </v-btn>
        </v-col>

        <v-col cols="12" class="pt-12">
          <v-row>
            <v-col cols="4">
              <v-row>
                <v-col cols="12" class="d-flex flex-wrap justify-center">
                  <v-avatar
                    size="220"
                    class="mx-auto"
                    :image="GetImageUrl(request.profile_image)"
                  >
                  </v-avatar>
                </v-col>

                <v-col cols="12" class="d-flex flex-wrap justify-center">
                  <div class="d-flex flex-column align-center">
                    <v-btn
                      class="mt-4 mb-2"
                      width="180px"
                      height="40px"
                      color="primary"
                      flat
                      prepend-icon="mdi-cloud-upload-outline"
                      text="ອັບໂຫຼດຮູບພາບ"
                      @click="openFile"
                    >
                    </v-btn>
                    
                    <!-- ເພີ່ມປຸ່ມລຶບຮູບ -->
                    <v-btn
                      v-if="request.profile_image"
                      class="mb-4"
                      width="180px"
                      height="40px"
                      color="error"
                      flat
                      prepend-icon="mdi-delete"
                      text="ລຶບຮູບພາບ"
                      @click="removeImage"
                    >
                    </v-btn>
                  </div>

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
                  <label>ຊື່ຜູ້ໃຊ້ງານ / Username</label>
                  <v-text-field
                    v-model="request.username"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
                    placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-text-field>

                  <label>ອີເມວ / Email</label>
                  <v-text-field
                    v-model="request.email"
                    :rules="[
                      (v: string) => !!v || 'ກະລຸນາປ້ອນອີເມວ',
                      (v: string) => /.+@.+\..+/.test(v) || 'ອີເມວບໍ່ຖືກຕ້ອງ'
                    ]"
                    placeholder="ກະລຸນາປ້ອນອີເມວ"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                    class="pb-6"
                  ></v-text-field>

                  <label>ລະຫັດຜ່ານ / Password</label>
                  <v-text-field
                    v-model="request.password"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
                    placeholder="ກະລຸນາປ້ອນລະຫັດຜ່ານ"
                    type="password"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <label>ບົດບາດ / Role</label>
                  <v-select
                    v-model="request.role_id"
                    :rules="[(v: number) => !!v || 'ກະລຸນາເລືອກບົດບາດ']"
                    placeholder="ກະລຸນາເລືອກບົດບາດ"
                    :items="response"
                    item-title="name"
                    item-value="role_id"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                  ></v-select>

                  <label>ພະນັກງານ / Employee</label>
                  <v-select
                    v-if="res"
                    v-model="request.employee_id"
                    placeholder="ກະລຸນາເລືອກພະນັກງານ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="pb-6"
                    :items="res"
                    item-title="name"
                    item-value="employee_id"
                  ></v-select>
                </v-col>

                <v-col cols="4">
                  <!-- ພື້ນທີ່ວ່າງ -->
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </section>
</template>