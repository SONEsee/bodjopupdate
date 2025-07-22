<template>
  <section>
    <v-row v-if="item !== null">
      <v-col cols="12">
        <GlobalTextTitleLine
          :title="'ໜ້າສະແເດງຂໍ້ມູນອຸປະກອນ / Detail of device'"
        ></GlobalTextTitleLine>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            <GlobalCardTitle
              :text="item?.pos_no ?? 'N/A'"
              :title="'ລະຫັດ POS / Pos No'"
            />
          </v-col>

          <v-col cols="3">
            <GlobalCardTitle
              :text="item?.imei ?? 'N/A'"
              :title="'ລະຫັດ IMEI / IMEI Code'"
            />
          </v-col>

          <v-col cols="3">
            <GlobalCardTitle
              :text="item?.create_fullname ?? 'N/A'"
              :title="'ຫຼ້າສຸດຢູ່ກັບໃຜ / Lastest owner'"
            />
          </v-col>

          <v-col cols="3">
            <GlobalCardTitle
              :text="item.create_username ?? 'N/A'"
              :title="'ຄົນສ້າງຂໍ້ມູນ / Create by user'"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="6">
            <h3>ຕຳແໜ່ງຫຼ້າສຸດ / Lastest location</h3>
            <v-divider></v-divider>
            <div class="mt-4">
              <v-img
                src="../../public/image/map.png"
                style="width: 90%"
              ></v-img>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <h3>ປະຫວັດການກະຈາຍອຸປະກອນ / History of device managements</h3>
            <v-divider></v-divider>

            <v-data-table
              :headers="headers"
              :items="item?.device_transactions"
              density="compact"
              item-key="name"
            >
              <template v-slot:body="{ items }">
                <tr v-for="(item, index) in items" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.pos_no }}</td>

                  <td>{{ item.imei }}</td>
                  <td>{{ FormatDatetime(item.created_at) }}</td>
                  <td>{{ item.status }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <GlobalOverlayLoading :loading="loading" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "@/helpers/axios";
import { DeviceDetailModels } from "@/models/";
const route = useRoute();
const item = ref(null as DeviceDetailModels.DeviceDetailidResponseItems | null);
const query = route.query;
const id = query.id?.toString() ?? null;
const loading = ref(false);
const headers = ref([
  { title: "ລ/ດ", Value: "index" },
  { title: "POS No.", Value: "pos_no" },
  { title: "IMEI", Value: "imei" },
  { title: "ວັນທີສ້າງ", Value: "created_at" },
  { title: "ສະຖານະ", Value: "status" },
  { title: "ການຈັດການ", Value: "actions" },
]);

const Getdata = async () => {
  try {
    loading.value = true;
    if (id === null) {
      return;
    }

    const res = await axios.get<DeviceDetailModels.DeviceDetailidResponse>(
      `/api/v1/devices/detail/${id}`
    );
    if (res.status === 200) {
      item.value = res.data.items;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  Getdata();
});
</script>
