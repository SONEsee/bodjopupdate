<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserStore } from '@/stores/user';

const router = useRouter();
const userStore = UserStore();

const response = computed(() => {
  return userStore.respons_data_query;
});

onMounted(async () => {
  userStore.getUser();
});

const request = userStore.request_query_data;

async function onSelectionChange(limit: number) {
  request.limit = limit;
  await userStore.getUser();
}

async function onPageChange(page: number) {
  request.page = page;
  await userStore.getUser();
}

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຮູບພາບ", key: "image", sortable: false },
  { title: "ຊື່ຜູ້ໃຊ້ງານ", key: "username", sortable: false },
  { title: "ອີເມວ", key: "email", sortable: false },
  { title: "ຊື່ແທ້", key: "full_name", sortable: false },
  { title: "ສະຖານະ", key: "status", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const goPath = (path: string) => {
  router.push(path);
};

const onsetinput = async (input: string | null) => {
  if (request !== null) {
    request.q = input ?? null;
    await userStore.getUser();
  }
};

// ຟັງຊັນໃໝ່ສຳລັບການກະທຳຕ່າງໆ
const handleEdit = (userId: number) => {
  router.push(`/user/edit?id=${userId}`);
};

const handleDetail = (userId: number) => {
  router.push(`/user/detail?id=${userId}`);
};

const handleDelete = async (userId: number, username: string) => {
  await userStore.deleteUser(userId, username);
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດການຜູ້ໃຊ້ງານ / Manage User (${formatNumber(
              response?.pagination?.total ?? 0
            )})`"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-wrap justify-space-between align-center"
        >
          <div class="d-flex flex-wrap">
            <div style="width: 280px">
              <GlobalDebounceEventTextField
                :input="request.q"
                :label="'ຄົ້ນຫາ'"
                @setinput="onsetinput"
              />
            </div>

            <div class="ml-4 pt-6">
              <v-btn
                color="primary"
                flat
                :loading="request.loading"
                @click="userStore.getUser()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div class="d-flex flex-wrap align-center">
            <v-btn
              color="primary"
              elevation="0"
              @click="goPath('/user/create')"
            >
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມຜູ້ໃຊ້ງານ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="response?.users ?? []"
            :loading="request.loading"
          >
            <template v-slot:item.no="{ item, index }">
              {{ index + 1 }}
            </template>

            <template v-slot:item.image="{ item }">
              <div class="pa-2">
                <GlobalMenuSpanImage :image="item.profile_image" />
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <span v-if="item.status === true">
                <v-chip color="success" size="small">ເປີດໃຊ້ງານ</v-chip>
              </span>
              <span v-else>
                <v-chip color="error" size="small">ປີດໃຊ້ງານ</v-chip>
              </span>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex align-center">
                <v-tooltip text="ແກ້ໄຂ">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="primary"
                      icon="mdi-pencil"
                      variant="text"
                      @click="handleEdit(item.id)"
                      size="small"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="ເບິ່ງລາຍລະອຽດ">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="info"
                      icon="mdi-eye"
                      variant="text"
                      @click="handleDetail(item.id)"
                      size="small"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="ລຶບ">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="error"
                      icon="mdi-delete"
                      variant="text"
                      @click="handleDelete(item.id, item.username)"
                      size="small"
                      :loading="userStore.loading"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <template v-slot:bottom>
              <GlobalTablePaginations
                :page="request.page"
                :limit="request.limit"
                :totalpage="response?.pagination?.total ?? 1"
                @onSelectionChange="onSelectionChange"
                @onPagechange="onPageChange"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>