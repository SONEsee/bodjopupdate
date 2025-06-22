<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = UserStore();

const userId = ref<number | null>(null);
const showPassword = ref(false);

// ດຶງ ID ຈາກ query params
onMounted(async () => {
  const id = route.query.id;
  if (id && !isNaN(Number(id))) {
    userId.value = Number(id);
    await userStore.getUserDetail(userId.value);
  } else {
    // ຖ້າບໍ່ມີ ID ໃຫ້ກັບໄປໜ້າລາຍການ
    router.push('/user');
  }
});

const form = computed(() => userStore.form_update_user);
const isLoading = computed(() => userStore.loading);

// ຟັງຊັນຈັດການຟອມ
const handleSubmit = async () => {
  await userStore.updateUser();
};

const handleCancel = () => {
  router.push('/user');
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    userStore.form_update_user.profile_image = target.files[0];
  }
};

// ຖ້າມີຮູບເກົ່າ
const currentImageUrl = computed(() => {
  if (userStore.form_update_user.profile_image instanceof File) {
    return URL.createObjectURL(userStore.form_update_user.profile_image);
  }
  return userStore.form_update_user.profile_image;
});
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="handleCancel"
            ></v-btn>
            <GlobalTextTitleLine title="ແກ້ໄຂຜູ້ໃຊ້ງານ / Edit User" />
          </div>
        </v-col>

        <v-col cols="12">
          <v-form @submit.prevent="handleSubmit">
            <v-row>
              <!-- ຮູບໂປຣໄຟລ໌ -->
              <v-col cols="12" md="6">
                <v-card elevation="1" class="pa-4">
                  <v-card-title class="text-h6 mb-4">ຮູບໂປຣໄຟລ໌</v-card-title>
                  
                  <div class="text-center mb-4" v-if="currentImageUrl">
                    <v-avatar size="120">
                      <v-img :src="currentImageUrl" cover></v-img>
                    </v-avatar>
                  </div>
                  
                  <v-file-input
                    label="ເລືອກຮູບໃໝ່"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    @change="handleFileChange"
                    clearable
                  ></v-file-input>
                </v-card>
              </v-col>

              <!-- ຂໍ້ມູນພື້ນຖານ -->
              <v-col cols="12" md="6">
                <v-card elevation="1" class="pa-4">
                  <v-card-title class="text-h6 mb-4">ຂໍ້ມູນພື້ນຖານ</v-card-title>
                  
                  <v-text-field
                    v-model="form.username"
                    label="ຊື່ຜູ້ໃຊ້ງານ *"
                    prepend-inner-icon="mdi-account"
                    required
                    :disabled="isLoading"
                  ></v-text-field>

                  <v-text-field
                    v-model="form.email"
                    label="ອີເມວ *"
                    type="email"
                    prepend-inner-icon="mdi-email"
                    required
                    :disabled="isLoading"
                  ></v-text-field>

                  <v-text-field
                    v-model="form.password"
                    :label="'ລະຫັດຜ່ານໃໝ່ (ປະໄວ້ເປົ່າຖ້າບໍ່ຕ້ອງການປ່ຽນ)'"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    :disabled="isLoading"
                  ></v-text-field>

                  <v-select
                    v-model="form.role_id"
                    label="ບົດບາດ"
                    :items="[]"
                    item-title="name"
                    item-value="id"
                    prepend-inner-icon="mdi-account-group"
                    clearable
                    :disabled="isLoading"
                  ></v-select>

                  <v-select
                    v-model="form.employee_id"
                    label="ພະນັກງານ"
                    :items="[]"
                    item-title="full_name"
                    item-value="id"
                    prepend-inner-icon="mdi-badge-account"
                    clearable
                    :disabled="isLoading"
                  ></v-select>

                  <v-switch
                    v-model="form.status"
                    label="ສະຖານະການໃຊ້ງານ"
                    color="primary"
                    :disabled="isLoading"
                  ></v-switch>
                </v-card>
              </v-col>

              <!-- ປຸ່ມບັນທຶກ -->
              <v-col cols="12">
                <div class="d-flex justify-end gap-3">
                  <v-btn
                    color="grey"
                    variant="outlined"
                    @click="handleCancel"
                    :disabled="isLoading"
                  >
                    ຍົກເລີກ
                  </v-btn>
                  
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                  >
                    ບັນທຶກການປ່ຽນແປງ
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>