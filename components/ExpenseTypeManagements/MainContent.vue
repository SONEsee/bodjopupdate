<template>
  <section class="pa-6">
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine
          :title="`${title} (${formatnumber(
            datarespons?.items?.pagination?.total_count ?? 0
          )})`"
        />
      </v-col>

      <v-col cols="12" class="d-flex flex-wrap justify-end">
        <v-btn
          color="primary"
          flat
          width="180px"
          @click="goPath('/expense_type_managements/create')"
          >+ ເພີ່ມຂໍ້ມູນ</v-btn
        >
      </v-col>

      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="datarespons?.items.list_data ?? []"
          :loading="loading"
        >
          <template v-slot:body="{ items }">
            <tr v-for="(item, index) in items" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>

              <td>{{ item.name_en }}</td>
              <td>{{ item.user?.fullname }}</td>
              <td>{{ FormatDatetime(item.created_at) }}</td>
              <td>
                <GlobalDefaultStatusChip :status="item.status" />
              </td>
              <td>
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  color="primary"
                  size="small"
                  @click="
                    goPath(`/expense_type_managements/detail?id=${item.id}`)
                  "
                />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="
                    goPath(`/expense_type_managements/edit?id=${item.id}`)
                  "
                />

                <v-btn
                  icon="mdi-delete-outline"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteData(item.id)"
                />
              </td>
            </tr>
          </template>

          <template v-slot:bottom>
            <GlobalTablePaginations
              :page="request.page"
              :limit="request.limit"
              :totalpage="datarespons?.items?.pagination?.total_page ?? 1"
              @onPagechange="onPageChange"
              @onSelectionChange="onSelectionChange"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "@/helpers/axios";
import { ExpenseCreateModel } from "@/models/";
import Swal from "sweetalert2";
const datarespons = ref<ExpenseCreateModel.ExpenseCreateResponse | null>(null);
const title = ref("ໜ້າສະແດງຂໍ້ມູນປະເພດລາຍຈ່າຍ / Detail Expense type");
const loading = ref(false);

const request = ref({
  limit: 20,
  page: 1,
});
const headers = [
  { title: "ລຳດັບ", Value: "no" },
  { title: "ຊື່ພາສາລາວ", Value: "name" },
  { title: "ຊື່ພາສາອັງກິດ", Value: "name_en" },
  { title: "ຄົນສ້າງ", Value: "created_by" },
  { title: "ວັນທີສ້າງ", Value: "created_at" },
  { title: "ສະຖານະ", Value: "status" },
  { title: "actions", Value: "actions" },
];

const onPageChange = async (page: number) => {
  request.value.page = page;
  await getdata();
};

const onSelectionChange = async (selection: number) => {
  request.value.limit = selection;
  await getdata();
};

const getdata = async () => {
  try {
    loading.value = true;
    const res = await axios.get<ExpenseCreateModel.ExpenseCreateResponse>(
      "/api/v1/expense-types/get-data",
      {
        params: {
          ...request.value,
        },
      }
    );
    if (res.status === 200) {
      datarespons.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const deleteData = async (id: string) => {
  try {
    const confirmed = await Swal.fire({
      title: "ຢືນຢັນການລົບ?",
      text: "ເຈົ້າຈະບໍ່ສາມາດກູ້ຄືນຂໍ້ມູນນີ້ໄດ້!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ຢືນຢັນ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (confirmed.isConfirmed) {
      const res = await axios.delete<ExpenseCreateModel.ExpenseCreateResponse>(
        `/api/v1/expense-types/delete/${id}`
      );
      if (res.status === 200) {
        Swal.fire("ສໍາເລັດ!", "ຂໍ້ມູນຖືກລົບສໍາເລັດ.", "success");
        await getdata();
      }
    }
  } catch (error) {
    console.error(error);
    DefaultSwalError(error);
  }
};

onMounted(() => {
  getdata();
});
</script>
