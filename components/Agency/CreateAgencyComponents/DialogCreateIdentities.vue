<script lang="ts" setup>
const form = ref();
const agencyStore = UseAgencyStore();
const emit = defineEmits(["emitform"]);
const form_request = computed({
  get() {
    return agencyStore.identity_request;
  },
  set(value) {
    agencyStore.identity_request = value;
  },
});

const submitForm = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      emit("emitform", form_request.value);
      form_request.value.dialog = false;
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <v-dialog :model-value="form_request.dialog" max-width="650" persistent>
    <v-form ref="form" @submit.prevent="submitForm">
      <v-card prepend-icon="mdi-map-marker" title="ເພີ່ມຂໍ້ມູນເອກະສານ">
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <label>ປະເພດເອກະສານ</label>
              <v-select
                :items="GetIdentitiesList()"
                variant="outlined"
                hide-details="auto"
                density="comfortable"
                :rules="[(v: string) => !!v||'This field is required']"
                v-model="form_request.type"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <label>ເອກະສານເລກທີ</label>
              <v-text-field
                variant="outlined"
                hide-details="auto"
                density="comfortable"
                :rules="[(v: string) => !!v||'This field is required']"
                v-model="form_request.identity_no"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <label>ຮູບພາບ</label>
              <v-file-input
                label="File input"
                variant="outlined"
                hide-details="auto"
                density="comfortable"
                prepend-icon=""
                accept="image/png,image/jpeg,image/png"
                v-model="form_request.file"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" class="font-weight-black" type="submit"
            >ຕົກລົງ</v-btn
          >
          <v-btn
            color="grey"
            class="font-weight-black"
            @click="agencyStore.onCloseDialogIdentities"
            >ຍົກເລີກ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
