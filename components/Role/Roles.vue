<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const userStore = useRoleStore();

const response = computed(() => {
  return userStore.response_data_role || [];
});


const loading = computed(() => {
  return userStore.loading || false; 
});

onMounted(async () => {
  userStore.getRole();
});

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຊື່ສິດນຳໃຊ້ລະບົບ", key: "name", sortable: false },
  { title: "ລາຍລະອຽດ", key: "description", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const goPath = (path: string) => {
  router.push(path);
};

const Delete = async (id: string) => {
  if (id) {
    await userStore.DeleteRole(id);
    await userStore.getRole();
  }
};
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດສິດນຳໃຊ້ລະບົບ / Manage User (${formatNumber(
              response?.length || 0
            )})`"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-wrap justify-space-between align-center"
        >
          <div class="d-flex flex-wrap align-center">
            <v-btn
              color="primary"
              elevation="0"
              @click="goPath('/role/create')"
            >
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມຜູ້ໃຊ້ງານ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="response || []"
            :loading="loading"
          >
            <template v-slot:item.no="{ item, index }">
              {{ index + 1 }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/role/edit?id=${item.role_id}`)"
                size="small"
              ></v-btn>

              <v-btn
                color="primary"
                icon="mdi-eye"
                variant="text"
                @click="goPath(`/role/detail?id=${item.role_id}`)"
                size="small"
              ></v-btn>

              <v-btn
                color="primary"
                icon="mdi-delete"
                variant="text"
                @click="Delete(item.role_id ?? '')"
                size="small"
              ></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>