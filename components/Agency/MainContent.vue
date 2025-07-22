<script lang="ts" setup>
const agencyStore = UseAgencyStore();

const response_data = computed(() => {
  return agencyStore.response_query_data;
});

const request = agencyStore.request_query_data;

async function onSelectionChange(limit: number) {
  request.limit = limit;
  await agencyStore.GetListData();
}

async function onPageChange(page: number) {
  request.page = page;
  await agencyStore.GetListData();
}

const headers = ref([
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "ຮູບພາບ", key: "image", sortable: false },
  { title: "ລະຫັດຕົວແທນ", key: "agent_code", sortable: false },
  { title: "ຊື່ ແລະ ນາມສະກຸນ", key: "fullname", sortable: false },
  { title: "ເບີໂທລະສັບ", key: "phone_number", sortable: false },
  { title: "ບ້ານ ເມືອງ ແຂວງ", key: "villages", sortable: false },
  { title: "ສະຖານະ", key: "status", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
]);

const onDeleteUser = async (id: string) => {
  const res = await agencyStore.OndeleteAgency(id);
  if (res instanceof Error) {
    return DefaultSwalError(res.message);
  }

  const notification = await CallSwal({
    icon: "success",
    title: "ສຳເລັດ",
    text: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
  });

  if (notification.isConfirmed) {
    await agencyStore.GetListData();
  } else {
    await agencyStore.GetListData();
  }
};

const onsetinput = async (input: string | null) => {
  if (request !== null) {
    request.q = input ?? null;
    await agencyStore.GetListData();
  }
};
</script>
<template>
  <div class="pa-6">
    <v-card elevation="0" tile width="100%" min-height="95vh" class="pa-6">
      <v-row>
        <v-col cols="12">
          <GlobalTextTitleLine
            :title="`ໜ້າຈັດການຂອງຕົວແທນ / Agency's homepage (${formatnumber(
              response_data?.pagination?.total_count ?? 0
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
                @click="agencyStore.GetListData()"
                >ຄົ້ນຫາ</v-btn
              >
            </div>
          </div>

          <div class="d-flex flex-wrap align-center">
            <v-btn
              color="primary"
              elevation="0"
              @click="goPath('/agency/create')"
            >
              <v-icon class="mr-2"> mdi-plus</v-icon>
              ເພີ່ມຂໍ້ມູນຂອງຕົວແທນ
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="response_data?.list_data ?? []"
            :loading="request.loading"
          >
            <template v-slot:item.no="{ item, index }">
              {{ index + 1 }}
            </template>

            <template v-slot:item.image="{ item }">
              <div class="pa-2">
                <GlobalMenuSpanImage :image="item.image_profile" />
              </div>
            </template>

            <template v-slot:item.villages="{ item }">
              {{ item?.village?.vill_name ?? "" }},
              {{ item?.village?.district?.dr_name ?? "" }},
              {{ item?.village?.district?.province?.pr_name ?? "" }}
            </template>

            <template v-slot:item.status="{ item }">
              <GlobalDefaultStatusChip :status="item.status" />
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                color="primary"
                icon="mdi-pencil"
                variant="text"
                @click="goPath(`/agency/edit?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-btn
                color="primary"
                icon="mdi-eye"
                variant="text"
                @click="goPath(`/agency/detail?id=${item.id}`)"
                size="small"
              ></v-btn>

              <v-btn
                color="error"
                icon="mdi-delete"
                variant="text"
                size="small"
                @click="onDeleteUser(item.id)"
              ></v-btn>
            </template>

            <template v-slot:bottom>
              <GlobalTablePaginations
                :page="request.page"
                :limit="request.limit"
                :totalpage="response_data?.pagination?.total_page ?? 1"
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
