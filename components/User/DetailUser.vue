<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = UserStore();

const userId = ref<number | null>(null);


onMounted(async () => {
  const id = route.query.id;
  if (id && !isNaN(Number(id))) {
    userId.value = Number(id);
    await userStore.getUserDetail(userId.value);
  } else {
   
    router.push('/user');
  }
});

const userDetail = computed(() => userStore.user_detail);
const isLoading = computed(() => userStore.loading);

const handleBack = () => {
  router.push('/user');
};

const handleEdit = () => {
  if (userId.value) {
    router.push(`/user/edit?id=${userId.value}`);
  }
};

const handleDelete = async () => {
  if (userDetail.value) {
    await userStore.deleteUser(userDetail.value.id, userDetail.value.username);
    // ຫຼັງຈາກລຶບສຳເລັດໃຫ້ກັບໄປໜ້າລາຍການ
    router.push('/user');
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('lo-LA');
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                @click="handleBack"
              ></v-btn>
              <GlobalTextTitleLine title="ລາຍລະອຽດຜູ້ໃຊ້ງານ / User Details" />
            </div>
            
          
          </div>
        </v-col>

        
        <v-col cols="12" v-if="isLoading">
          <div class="text-center pa-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <div class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</div>
          </div>
        </v-col>

        <!-- User Detail Content -->
        <template v-else-if="userDetail">
          <!-- ຮູບໂປຣໄຟລ໌ແລະຂໍ້ມູນພື້ນຖານ -->
          <v-col cols="12" md="4">
            <v-card elevation="2" class="pa-6">
              <div class="text-center mb-4">
                <v-avatar size="150" class="mb-4">
                  <v-img 
                    :src="userDetail.profile_image || '/default-avatar.png'" 
                    cover
                  ></v-img>
                </v-avatar>
                
                <h2 class="text-h5 mb-2">{{ userDetail.username }}</h2>
                
                <v-chip 
                  :color="userDetail.status ? 'success' : 'error'"
                  size="small"
                >
                  {{ userDetail.status ? 'ເປີດໃຊ້ງານ' : 'ປີດໃຊ້ງານ' }}
                </v-chip>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="text-center">
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-pencil"
                  @click="handleEdit"
                  block
                >
                  ແກ້ໄຂຂໍ້ມູນ
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- ຂໍ້ມູນລາຍລະອຽດ -->
          <v-col cols="12" md="8">
            <v-row>
              <!-- ຂໍ້ມູນສ່ວນຕົວ -->
              <v-col cols="12">
                <v-card elevation="2" class="pa-6">
                  <v-card-title class="text-h6 mb-4">
                    <v-icon class="mr-2">mdi-account</v-icon>
                    ຂໍ້ມູນສ່ວນຕົວ
                  </v-card-title>
                  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ຊື່ຜູ້ໃຊ້ງານ:</strong>
                        <div class="mt-1">{{ userDetail.username }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ອີເມວ:</strong>
                        <div class="mt-1">{{ userDetail.email }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ຊື່ແທ້:</strong>
                        <div class="mt-1">{{ userDetail.full_name || '-' }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ເບີໂທ:</strong>
                        <div class="mt-1">{{ userDetail.phone || '-' }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- ຂໍ້ມູນລະບົບ -->
              <v-col cols="12">
                <v-card elevation="2" class="pa-6">
                  <v-card-title class="text-h6 mb-4">
                    <v-icon class="mr-2">mdi-cog</v-icon>
                    ຂໍ້ມູນລະບົບ
                  </v-card-title>
                  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ID:</strong>
                        <div class="mt-1">{{ userDetail.id }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ບົດບາດ:</strong>
                        <div class="mt-1">{{ userDetail.role?.name || '-' }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ພະນັກງານ:</strong>
                        <div class="mt-1">{{ userDetail.employee?.full_name || '-' }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ສະຖານະ:</strong>
                        <div class="mt-1">
                          <v-chip 
                            :color="userDetail.status ? 'success' : 'error'"
                            size="small"
                          >
                            {{ userDetail.status ? 'ເປີດໃຊ້ງານ' : 'ປີດໃຊ້ງານ' }}
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- ຂໍ້ມູນວັນທີ -->
              <v-col cols="12">
                <v-card elevation="2" class="pa-6">
                  <v-card-title class="text-h6 mb-4">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    ຂໍ້ມູນວັນທີ
                  </v-card-title>
                  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ວັນທີສ້າງ:</strong>
                        <div class="mt-1">{{ formatDate(userDetail.created_at) }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ວັນທີອັບເດດ:</strong>
                        <div class="mt-1">{{ formatDate(userDetail.updated_at) }}</div>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <div class="mb-3">
                        <strong>ເຂົ້າສູ່ລະບົບຄັ້ງສຸດທ້າຍ:</strong>
                        <div class="mt-1">{{ formatDate(userDetail.last_login) || '-' }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </template>

        <!-- Error State -->
        <v-col cols="12" v-else>
          <v-card elevation="2" class="pa-8">
            <div class="text-center">
              <v-icon size="64" color="error">mdi-alert-circle</v-icon>
              <h3 class="text-h5 mt-4 mb-2">ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້</h3>
              <p class="text-body-1 mb-4">ອາດຈະເປັນເພາະ ID ບໍ່ຖືກຕ້ອງ ຫຼື ຂໍ້ມູນຖືກລຶບໄປແລ້ວ</p>
              <v-btn color="primary" @click="handleBack">
                ກັບໄປໜ້າລາຍການ
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>