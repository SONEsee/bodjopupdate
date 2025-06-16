<script setup lang="ts">
const emStore = useEmployeeStore();
const ot = otStore();

const resot = computed(() => {
  return ot.response_data_response_ot;
});

const res = computed(() => {
  return emStore.respons_data_employee;
});

onMounted(() => {
  ot.getOtTotal();
  emStore.getDataEmployee();
});
</script>

<template>
  <v-col cols="12">
    <div style="border: green solid 1px; border-radius: 5px">
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-card
              style="background-color: #e91e63; height: 30vh"
              class="d-flex flex-column align-center justify-center"
              elevation="3"
              rounded="lg"
            >
              <div class="d-flex flex-column align-center">
                <v-icon
                  icon="mdi-account-group"
                  color="white"
                  size="90"
                  class="mb-2"
                ></v-icon>

                <v-card-title
                  class="text-white text-center pa-0 mb-1"
                  style="font-size: 80%"
                >
                  ພະນັກງານທັງໝົດ
                </v-card-title>

                <v-card-subtitle
                  class="text-white text-center font-weight-bold pa-0"
                >
                  {{ res?.length || 0 }} ຄົນ
                </v-card-subtitle>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card
              style="background-color: #9c27b0; height: 30vh"
              class="d-flex flex-column align-center justify-center"
              elevation="3"
              rounded="lg"
            >
              <div class="d-flex flex-column align-center">
                <v-icon
                  icon="mdi-cash-multiple"
                  color="white"
                  size="90"
                  class="mb-2"
                ></v-icon>

                <v-card-title
                  class="text-white text-center pa-0 mb-1"
                  style="font-size: 80%"
                >
                  ເງິນໂບນັດທີ່ຕ້ອງຈ່າຍພາຍໃນເດທອນນີ້
                </v-card-title>

                <v-card-subtitle
                  class="text-white text-center font-weight-bold pa-0"
                >
                  {{ formatNumber(Number(resot?.data.totalOt) || 0) }} ກີບ
                </v-card-subtitle>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card
              style="background-color: #f44336; height: 30vh"
              class="d-flex flex-column align-center justify-center"
              elevation="3"
              rounded="lg"
            >
              <div class="d-flex flex-column align-center">
                <v-icon
                  icon="mdi-update"
                  color="white"
                  size="90"
                  class="mb-2"
                ></v-icon>

                <v-card-title
                  class="text-white text-center pa-0 mb-1"
                  style="font-size: 80%"
                >
                  <p>ຈຳນວນພະນັກງານເຂົ້າວຽກສວຍກາຍໂມງໃນມື້ນີ້</p>
                </v-card-title>

                <v-card-subtitle
                  class="text-white text-center font-weight-bold pa-0"
                >
                  {{ formatNumber(Number(resot?.data.totalOt) || 0) }} ຄົນ
                </v-card-subtitle>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card
              style="background-color: #f06292; height: 30vh"
              class="d-flex flex-column align-center justify-center"
              rounded="lg"
            >
              <v-container>
                <div class="d-flex flex-column align-center">
                  <v-icon
                    icon="mdi-account-off"
                    color="white"
                    size="90"
                    class="mb-2"
                  ></v-icon>

                  <v-card-title
                    class="text-white text-center pa-0 mb-1"
                    style="font-size: 80%"
                  >
                    ຈຳນວນພະນັກງານຂາດວຽກໃນມື້ນີ້
                  </v-card-title>

                  <v-card-subtitle
                    class="text-white text-center font-weight-bold pa-0"
                  >
                    {{ formatNumber(Number(resot?.data.totalOt) || 0) }} ຄົນ
                  </v-card-subtitle>
                </div></v-container
              >
            </v-card>
          </v-col>
        </v-row></v-container
      >
    </div>
    <div style="border: green solid 1px; border-radius: 5px" class="mt-4">
      <v-container>
        <v-row>
            <v-col md="4">
                <Employeepah />
            </v-col>
          <v-col cols="12" md="8">
            <v-container>
            <Unemployed /></v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-col>
</template>

<script lang="ts">
function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
</script>
