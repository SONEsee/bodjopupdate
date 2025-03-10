<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "~/stores/product";
import { CallSwal, goPath, GetImageUrl, } from "~/composables/global";
import Barcode from "@/components/Global/Barcode.vue"
import { useRoute } from "vue-router";
import notfoundImage from "@/assets/img/404.png";
import AvatarProfileImage from "../Global/AvatarProfileImage.vue";

const product = useProductStore();
const route = useRoute();
const id = route.query.id?.toString() ?? null;
const notfoundRef = ref(notfoundImage);


const res = computed(() => product.response_detail_query_data?.Items || []);

const item = computed(() => res.value[0] || null);
console.log(item.value);

onMounted(() => {
  product.Getdata();
  if (id) {
    product.GetdetailData(id);
  }
});

const title = "ລາຍລະອຽດສິນຄ້າ";
</script>

<template>
   
  <GlobalTextTitleLine :title="title" />
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="4" v-if="item">
        <v-row>
          <v-col cols="12" class="d-flex flex-wrap justify-center">
            <AvatarProfileImage
             :image_url="item?.product_image ?? ''"
              :alt="item.product_name"
              :width="200"
              :height="200"
              :notfound="notfoundRef"
            />
           
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="8">
        <v-form ref="form" v-if="item">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ສິນຢາ']"
                label="ຊື່ສິນຢາ"
                density="compact"
                variant="outlined"
                placeholder="ຊື່ສິນຢາ"
                v-model="item.product_name"
                readonly
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນປະເພດສິນຄ້າ']"
                label="ປະເພດສິນຄ້າ"
                density="compact"
                variant="outlined"
                placeholder="ປະເພດສິນຄ້າ"
                v-model="item.Category.Name"
                readonly
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຈຳນວນສິນຄ້າ']"
                type="number"
                label="ຈຳນວນສິນຄ້າ"
                density="compact"
                variant="outlined"
                placeholder="ຈຳນວນສິນຄ້າ"
                v-model="item.quantity_in_stock"
                readonly
                min="0"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນວັນໝົດອາຍຸ']"
                type="date"
                label="ວັນໝົດອາຍຸ"
                density="compact"
                variant="outlined"
                :value="item.expiry_date ? item.expiry_date.split('T')[0] : ''"
                readonly
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນລາຄາຂາຍ']"
                type="number"
                label="ລາຄາຂາຍ"
                density="compact"
                variant="outlined"
                v-model="item.price"
                readonly
                min="0"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຄວາມແຮງຂອງຢາ']"
                type="number"
                label="ຄວາມແຮງຂອງຢາ"
                density="compact"
                variant="outlined"
                v-model="item.reorder_level"
                readonly
                min="0"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <!-- <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນລະຫັດສິນຄ້າ ຫຼື ບາໂຄດ']"
                label="ລະຫັດສິນຄ້າ ຫຼື ບາໂຄດ (Barcode)"
                density="compact"
                variant="outlined"
                v-model="item.barcode"
                readonly
                required
              /> -->
              <Barcode :barcode="item.barcode"
                :width="2"
                :height="50"
                :display-value="true" />
            </v-col>

            <v-col cols="12" md="6"></v-col>
            <v-col cols="12">
             
            </v-col>
          </v-row>
        </v-form>
        <v-col v-else>ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</v-col>
      </v-col>
    </v-row>
  </v-col>
</template>