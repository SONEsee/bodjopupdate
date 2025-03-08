<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CallSwal, GetImageUrl } from "~/composables/global";
import { useProductStore } from "~/stores/product";
import notfoundImage from "@/assets/img/404.png";
import { UseCategoryStore } from "~/stores/category";
const category = UseCategoryStore();
const type = computed(() => category.categories);
onMounted(() => {
  category.GetListData();
});
const notfoundRef = ref(notfoundImage);
const useProductStor = useProductStore();
const file = ref<HTMLInputElement | null>(null);
const request = useProductStor.data_form_creat;

const title = "ເພີ່ມຂໍ້ມູນສິນຄ້າ";

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
  }
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
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="ຊື່ສິນຢາ"
                density="compact"
                variant="outlined"
                placeholder="ຊື່ສິນຢາ"
                v-model="request.product_name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="type"
                item-title="Name"
                item-value="id"
                label="ປະເພດຢາ"
                density="compact"
                variant="outlined"
                placeholder="ປະເພດຢາ"
                v-model="request.category_id"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                type="number"
                label="ຈຳນວນສິນຄ້າ"
                density="compact"
                variant="outlined"
                placeholder="ຈຳນວນສິນຄ້າ"
                v-model="request.quantity_in_stock"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                type="date"
                label="ວັນໝົດອາຍຸ"
                density="compact"
                variant="outlined"
                v-model="request.expiry_date"
              ></v-text-field>
            </v-col> 
            <v-col cols="12" md="6">
              <v-text-field
                type="number"
                label="ລາຄາຂາຍ"
                density="compact"
                variant="outlined"
                v-model="request.price"
              ></v-text-field>
            </v-col> 
            <v-col cols="12" md="6">
              <v-text-field
                type="number"
                label="ຄວາມແຮງຂອງຢາ"
                density="compact"
                variant="outlined"
                v-model="request.reorder_level"
              ></v-text-field>
            </v-col> 
            
            <v-col cols="12" md="6">
              <v-text-field
                label="ລະຫັດສິນຄ້າ ຫຼື ບາໂຄດ (Barcode)"
                density="compact"
                variant="outlined"
                v-model="request.barcode"
              ></v-text-field>
            </v-col> 
            <v-col cols="12" md="6">
                
            </v-col> 
            <v-col cols="12"><div class="d-flex justify-end">
                <v-btn color="primary" class="ma-1">ບັນທຶກ</v-btn >
                <v-btn color="error"  class="ma-1">ຍົກເລີກ</v-btn></div>
                
            </v-col>
            </v-row
        ></v-form>
      </v-col>
    </v-row>
  </v-col>
</template>
