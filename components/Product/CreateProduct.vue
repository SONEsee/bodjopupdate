<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CallSwal, GetImageUrl } from "~/composables/global";
import { useProductStore } from "~/stores/product";
import { UseCategoryStore } from "~/stores/category";
import notfoundImage from "@/assets/img/404.png";

const category = UseCategoryStore();
const useProductStor = useProductStore();
const file = ref<HTMLInputElement | null>(null);
const request = useProductStor.data_form_creat;
const notfoundRef = ref(notfoundImage);
const valid = ref(false);
const form = ref<HTMLFormElement | null>(null);

const title = "ເພີ່ມຂໍ້ມູນສິນຄ້າ";
const type = computed(() => category.categories);

onMounted(() => {
  category.GetListData();
});

const openFile = () => {
  if (file.value) {
    file.value.click();
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const selectedFile = files[0];
    console.log("Selected file:", selectedFile);
    request.product_image = selectedFile;
    target.value = "";
  }
};

const onSubmit = async () => {
  if (!form.value?.reportValidity()) {
    valid.value = false;
    CallSwal({
      title: "ຜິດພາດ",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
      icon: "warning",
      showCancelButton: false,
      timer: 1500,
    });
    return;
  }
  valid.value = true;
  if (valid.value) {
    await useProductStor.CreateData();
  }
};

const resetForm = () => {
  request.product_name = "";
  request.category_id = "";
  request.quantity_in_stock = 0;
  request.expiry_date = "";
  request.price = 0;
  request.reorder_level = 0;
  request.barcode = "";
  request.product_image = "";
  if (file.value) file.value.value = "";
};
</script>

<template>
  <GlobalTextTitleLine :title="title" />
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12" class="d-flex flex-wrap justify-center">
            <v-avatar
              style="border: 2px #e8eaf6 solid"
              size="220"
              class="mx-auto"
              :image="
                request.product_image
                  ? GetImageUrl(request.product_image)
                  : notfoundRef
              "
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
        <v-form ref="form" @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ສິນຢາ']"
                label="ຊື່ສິນຢາ"
                density="compact"
                variant="outlined"
                placeholder="ຊື່ສິນຢາ"
                v-model="request.product_name"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :rules="[(v) => !!v || 'ກະລຸນາເລືອກປະເພດຢາກອ່ນ']"
                :items="type"
                item-title="Name"
                item-value="ID"
                label="ປະເພດຢາ"
                density="compact"
                variant="outlined"
                placeholder="ປະເພດຢາ"
                v-model="request.category_id"
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
                v-model="request.quantity_in_stock"
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
                v-model="request.expiry_date"
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
                v-model="request.price"
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
                v-model="request.reorder_level"
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
                v-model="request.barcode"
                required
              />
            </v-col>
            <v-col cols="12" md="6"></v-col>
            <v-col cols="12">
              <div class="d-flex justify-end">
                <v-btn color="primary" class="ma-1" type="submit">ບັນທຶກ</v-btn>
                <v-btn color="error" class="ma-1" @click="resetForm"
                  >ຍົກເລີກ</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-col>
</template>
