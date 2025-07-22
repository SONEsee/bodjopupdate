<script lang="ts" setup>
import axios from "@/helpers/axios";
import notfounfimages from "@/assets/img/404.png";
import { UserStore } from "@/stores/user";
import { UseGlobalStore } from "@/stores/global";

import { CallSwal, GetImageUrl } from "~/composables/global";
import { useEmployeeStore } from "@/stores/employee"; 
import { ref, computed, onMounted } from "vue"; 
import { useRouter, useRoute } from "vue-router"; // ເພີ່ມ useRouter

const roleStore = useRoleStore(); // ແກ້ໄຂຊື່ຕົວແປ
const emStore = useEmployeeStore();
const router = useRouter(); // ແກ້ໄຂການໃຊ້ router
const route = useRoute(); // ເພີ່ມ route
const userStore = UserStore();
const globalStore = UseGlobalStore();

const detailuser = computed(() => {
  return userStore.user_detail;
});

const id = Number(route.query.id) || 0; // ແກ້ໄຂການໃຊ້ route

const response = computed(() => {
  return roleStore.response_data_role || []; // ແກ້ໄຂຊື່ຕົວແປ
});

const res = computed(() => {
  return emStore.respons_data_employee || []; // ເພີ່ມ fallback
});

const notfoundref = ref(notfounfimages);
const title = ref("ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້"); // ແກ້ໄຂ title
const visible = ref(false);
const loading = ref(false);
const form = ref();
const file = ref();

const imagePreview = ref<string | null>(null);

// ສ້າງ reactive form object
const request = ref({
  username: "",
  email: "",
  password: "",
  role_id: null as number | null,
  employee_id: null as number | null,
  profile_image: null as string | File | null
});

// ຟັງຊັນໂຫຼດຂໍ້ມູນ
const loadUserData = () => {
  if (userStore.user_detail) {
    const detail = userStore.user_detail;
    request.value = {
      username: detail.username || "",
      email: detail.email || "",
      password: "",
      role_id: detail.role_id || detail.role || null,
      employee_id: detail.employee_id || null,
      profile_image: detail.profile_image || null
    };
    imagePreview.value = GetImageUrl(detail.profile_image);
  }
};

onMounted(async () => {
  try {
    // ໂຫຼດຂໍ້ມູນຜູ້ໃຊ້ກ່ອນ
    if (id > 0) {
      await userStore.getUserDetail(id);
    }
    
    // ຫຼັງຈາກໂຫຼດຂໍ້ມູນແລ້ວ ກໍ່ປ້ອນເຂົ້າ form
    loadUserData();
    
    // ໂຫຼດຂໍ້ມູນອື່ນໆ
    await Promise.all([
      emStore.getDataEmployee(),
      roleStore.getRole()
    ]);
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

const openFile = () => {
  if (file.value) {
    file.value.click();
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    const selectedFile = files[0];
    console.log('Selected file:', selectedFile);
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG)');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('ຂະໜາດໄຟລ໌ໃຫຍ່ເກີນໄປ (ບໍ່ເກີນ 5MB)');
      return;
    }
    
    request.value.profile_image = selectedFile;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreview.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(selectedFile);
  }
};

const getDisplayImage = () => {
  if (imagePreview.value) return imagePreview.value;
  if (request.value.profile_image && typeof request.value.profile_image === 'string') {
    return GetImageUrl(request.value.profile_image);
  }
  return notfoundref.value;
};

const submitForm = async () => {
  try {
    if (!form.value) return;
    
    const { valid } = await form.value.validate();
    if (valid) {
      loading.value = true;
      
      // ອັບເດດຂໍ້ມູນໃນ store
      userStore.form_update_user = { ...request.value };
      
      // ເອີ້ນຟັງຊັນອັບເດດ (ບໍ່ແມ່ນ create)
      await userStore.updateUser(id);
      
      setTimeout(() => {
        router.push("/user"); // ແກ້ໄຂການໃຊ້ router
      }, 1200);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    CallSwal("error", "ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ", "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
  } finally {
    loading.value = false;
  }
};

const removeImage = () => {
  request.value.profile_image = null;
  imagePreview.value = null;
  if (file.value) {
    file.value.value = '';
  }
};

// ຟັງຊັນກັບໄປໜ້າລິສ
const goBack = () => {
  router.push("/user");
};
</script>

<template>
  <section>
    <!-- ສຳລັບ debug ເທົ່ານັ້ນ ລຶບອອກໃນ production -->
    <!-- <pre>{{ detailuser }}</pre> -->
    
    <v-form ref="form" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine :title="title" />
        </v-col>

        <v-col cols="12" class="d-flex flex-wrap justify-end gap-2">
          <v-btn 
            color="secondary" 
            variant="outlined"
            @click="goBack"
          >
            ກັບຄືນ
          </v-btn>
          <v-btn 
            color="primary" 
            type="submit" 
            :loading="loading || userStore.loading"
          >
            ບັນທຶກການແກ້ໄຂ
          </v-btn>
        </v-col>

        <v-col cols="12" class="pt-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-row>
                <v-col cols="12" class="d-flex flex-column align-center">
                  <v-avatar
                    size="220"
                    class="mx-auto"
                    :image="getDisplayImage()"
                  >
                    <v-img 
                      :src="getDisplayImage()" 
                      :alt="request.username || 'Profile Image'"
                      cover
                    />
                  </v-avatar>
                </v-col>

                <v-col cols="12" class="d-flex flex-column align-center gap-2">
                  <v-btn
                    width="180px"
                    height="40px"
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-cloud-upload-outline"
                    @click="openFile"
                  >
                    ອັບໂຫຼດຮູບພາບ
                  </v-btn>

                  <v-btn
                    v-if="request.profile_image"
                    width="180px"
                    height="40px"
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-delete-outline"
                    @click="removeImage"
                  >
                    ລຶບຮູບພາບ
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

            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    ຊື່ຜູ້ໃຊ້ງານ / Username <span class="text-error">*</span>
                  </label>
                  <v-text-field
                    v-model="request.username"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
                    placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="mb-4"
                  />

                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    ອີເມວ / Email <span class="text-error">*</span>
                  </label>
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
                    class="mb-4"
                  />

                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    ລະຫັດຜ່ານໃໝ່ / New Password
                    <small class="text-caption">(ຫວ່າງໄວ້ຖ້າບໍ່ຕ້ອງການປ່ຽນ)</small>
                  </label>
                  <v-text-field
                    v-model="request.password"
                    placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່ (ຖ້າຕ້ອງການປ່ຽນ)"
                    type="password"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="mb-4"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    ບົດບາດ / Role <span class="text-error">*</span>
                  </label>
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
                    class="mb-4"
                  />

                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    ພະນັກງານ / Employee
                  </label>
                  <v-select
                    v-model="request.employee_id"
                    placeholder="ກະລຸນາເລືອກພະນັກງານ"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    class="mb-4"
                    :items="res"
                    item-title="name"
                    item-value="employee_id"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </section>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>