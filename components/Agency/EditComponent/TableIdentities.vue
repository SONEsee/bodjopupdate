<script lang="ts" setup>
import axios from "@/helpers/axios";
import { IdentitiesModel } from "@/models/";

const agencyStore = UseAgencyStore();
const globalStore = UseGlobalStore();
const response_data = computed(() => {
  return agencyStore.response_detail_query_data;
});

const headers = ref([
  { title: "ລຳດັບ", sortable: false, key: "no" },
  { title: "ຮູບພາບ", key: "image_url" },
  { title: "ປະເພດເອກະສານ", key: "type" },
  { title: "ເລກທີ", key: "identity_no" },
  { title: "actions", key: "actions" },
]);

const onCreateIdentity = async (req: any) => {
  try {
    const notification = await CallSwal({
      icon: "warning",
      title: "ຄຳເຕືອນ",
      text: `ທ່ານກຳລັງເພີ່ມຂໍ້ມູນປະຫວັດທ່ານແນ່ໃຈແລ້ວບໍ່?`,
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (notification.isConfirmed) {
      const request = {
        id: req.id ?? null,
        type: req.type ?? "",
        identity_no: req.identity_no ?? "",
        file: req.file ?? null,
      };

      var formData = new FormData();
      for (const [key, value] of Object.entries(request)) {
        if (key === "file") {
          if (value !== null) {
            if (typeof value === "object") {
              const file = value as File;
              formData.append("file", file, file.name);
            }
          }
        } else {
          formData.append(key, value);
        }
      }
      let path: string = "";

      if (req.id !== null || req.id !== "") {
        path = `/api/v1/agency/update-identity/${req.id}`;
      } else {
        path = `/api/v1/agency/indentity/new/${response_data?.value?.id}`;
      }

      console.log(`path`, path);

      const res = await axios.post(path, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        const notification = await CallSwal({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
        });
        if (notification.isConfirmed) {
          await agencyStore.onGetAndEditAgency(
            response_data?.value?.id ?? null
          );
        } else {
          await agencyStore.onGetAndEditAgency(
            response_data?.value?.id ?? null
          );
        }
      }
    } else if (notification.isDismissed) {
      agencyStore.identity_request.dialog = true;
    }
  } catch (error) {
    console.error(error);
    DefaultSwalError(error);
  }
};

const DeleteIdentity = async (id: string, name: string, no: string) => {
  try {
    const notification = await CallSwal({
      icon: "warning",
      title: "ຄຳເຕືອນ",
      text: `ທ່ານກຳລັງລົບ ${name} - ${no} ທ່ານແນ່ໃຈແລ້ວບໍ່?`,
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (notification.isConfirmed) {
      globalStore.loading_overlay = true;
      const res = await axios.delete(`/api/v1/agency/delete-identity/${id}`);
      globalStore.loading_overlay = false;
      if (res.status === 200) {
        const notification = await CallSwal({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
        });
        if (notification.isConfirmed) {
          await agencyStore.onGetAndEditAgency(
            response_data?.value?.id ?? null
          );
        } else {
          await agencyStore.onGetAndEditAgency(
            response_data?.value?.id ?? null
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
    globalStore.loading_overlay = false;
    DefaultSwalError(error);
  } finally {
    globalStore.loading_overlay = false;
  }
};

const oneditIdentity = (item: IdentitiesModel.GetIdentitiesResponse) => {
  agencyStore.identity_request.id = item.id;
  agencyStore.identity_request.type = item.type ?? 1;
  agencyStore.identity_request.identity_no = item.identity_no;
  agencyStore.identity_request.dialog = true;
};
</script>
<template>
  <section>
    <v-data-table
      :headers="headers"
      :items="response_data?.user_identities ?? []"
      density="comfortable"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          color="primary"
          icon="mdi-pencil"
          variant="text"
          size="small"
          @click="oneditIdentity(item)"
        ></v-btn>

        <v-btn
          color="error"
          variant="text"
          icon="mdi-delete"
          size="small"
          @click="
            DeleteIdentity(
              item.id,
              GetIdentitiesLabel(item.type),
              item.identity_no
            )
          "
        ></v-btn>
      </template>

      <template v-slot:item.type="{ item }">
        {{ GetIdentitiesLabel(item.type) }}
      </template>

      <template v-slot:item.image_url="{ item }">
        <div class="pa-2">
          <GlobalMenuSpanImage :image="item.image_url ?? 'N/A'" />
        </div>
      </template>

      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>
    </v-data-table>

    <AgencyCreateAgencyComponentsDialogCreateIdentities
      @emitform="onCreateIdentity"
    />
  </section>
</template>
