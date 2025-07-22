<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "~/stores/product";
import { CallSwal, goPath, GetImageUrl } from "~/composables/global";
import { useRoute } from "vue-router";
import AvatarProfileImage from "../Global/AvatarProfileImage.vue";
import notfoundImage from "@/assets/img/404.png";
import Barcode from "../Global/Barcode.vue";
import { UseCategoryStore } from "~/stores/category";

const product = useProductStore();
const categories = UseCategoryStore();
const route = useRoute();
const notfoundRef = ref(notfoundImage);
const form = ref<HTMLFormElement | null>(null);
const file = ref<HTMLInputElement | null>(null);

const res = computed(() => product.response_detail_query_data?.Items || []);
const item = computed(() => res.value[0] || null);
const type = computed(() => categories.categories);
const title = "ແກ້ໄຂສິນຄ້າ";

const selectedCategory = computed({
  get: () => {
    if (!item.value?.category_id) return null;
    return (
      type.value.find(
        (cat) => String(cat.ID) === String(item.value?.category_id)
      ) || null
    );
  },
  set: (newValue) => {
    if (item.value && newValue) {
      item.value.category_id = String(newValue.ID);
    }
  },
});

onMounted(() => {
  const id = route.query.id?.toString() ?? null;
  categories.GetListData();
  product.Getdata();
  if (id) {
    product.GetdetailData(id);
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
  if (files && files.length > 0 && item.value) {
    const selectedFile = files[0];
    console.log("Selected file:", selectedFile);
    item.value.product_image = selectedFile;
    target.value = "";
  }
};

const submit = async () => {
  try {
    if (!form.value?.reportValidity()) {
      CallSwal({
        title: "ຜິດພາດ",
        text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        icon: "warning",
        timer: 1500,
      });
      return;
    }

    if (item.value) {
      const payload = {
        ...item.value,
        expiry_date: item.value.expiry_date.split('T')[0], 
      };
     
      const id = route.query.id?.toString() ?? null;
      await product.UpdateData(id, payload);
    //   CallSwal({
    //     title: "ສຳເລັດ",
    //     text: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
    //     icon: "success",
    //     timer: 1500,
    //   });
    }
  } catch (error: any) {
    console.error("Submit error:", error);
    CallSwal({
      title: "ຜິດພາດ",
      text: error.message || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ",
      icon: "error",
      timer: 1500,
    });
  }
};
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
          <v-col cols="12" class="d-flex flex-wrap justify-center">
            <v-btn
              class="mt-4 mb-7"
              width="180px"
              height="40px"
              color="primary"
              flat
              prepend-icon="mdi-cloud-upload-outline"
              text="ອັບໂຫຼດຮູບພາບ"
              @click="openFile"
            />
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
        <v-form ref="form" v-if="item" @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ສິນຢາ']"
                label="ຊື່ສິນຢາ"
                density="compact"
                variant="outlined"
                placeholder="ຊື່ສິນຢາ"
                v-model="item.product_name"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
                <v-autocomplete
                :items="type"
                item-title="Name"
                item-value="ID"
                :rules="[(v) => !!v || 'ກະລຸນາເລືອກປະເພດສິນຄ້າ']"
                label="ປະເພດສິນຄ້າ"
                density="compact"
                variant="outlined"
                placeholder="ປະເພດສິນຄ້າ"
                v-model="selectedCategory"
                return-object
               
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
                :value="item.expiry_date ? item.expiry_date : ''"
                v-model="item.expiry_date"
                
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
                min="0"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນລະຫັດສິນຄ້າ ຫຼື ບາໂຄດ']"
              
                label="ລະຫັດສິນຄ້າ ຫຼື ບາໂຄດ (Barcode)"
                density="compact"
                variant="outlined"
                v-model="item.barcode"
                min="0"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <Barcode
                :barcode="item.barcode"
                :width="2"
                :height="50"
                :display-value="true"
              />
            </v-col>
            <v-col cols="12" md="6"></v-col>
            <v-col cols="12">
              <div class="d-flex justify-end">
                <v-btn color="primary" class="ma-1" type="submit">ບັນທຶກ</v-btn>
                <v-btn color="error" class="ma-1" @click="goPath('/product')">ຍົກເລີກ</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <v-col v-else>ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</v-col>
      </v-col>
    </v-row>
  </v-col>
</template>