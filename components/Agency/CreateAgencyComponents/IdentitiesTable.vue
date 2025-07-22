<script lang="ts" setup>
import type { AgencyModel } from "~/models";

const agencyStore = UseAgencyStore();
const request = agencyStore.form_create_data;
const headers = ref([
  { title: "ລຳດັບ", sortable: false, key: "no" },
  { title: "ປະເພດເອກະສານ", key: "type" },
  { title: "ເລກທີ", key: "identity_no" },
  { title: "ຮູບພາບ", key: "file" },
  { title: "Actions", key: "actions" },
]);

function onEmitFormCreateIdentity(item: AgencyModel.IdentitiesAgency) {
  request.identities.push({
    type: item.type,
    identity_no: item.identity_no,
    file: item.file ?? null,
  });
}
</script>
<template>
  <section>
    <v-data-table
      :headers="headers"
      :items="agencyStore.form_create_data.identities ?? []"
      density="comfortable"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          color="error"
          variant="text"
          icon="mdi-delete"
          size="small"
        ></v-btn>
      </template>

      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>
    </v-data-table>

    <AgencyCreateAgencyComponentsDialogCreateIdentities
      @emitform="onEmitFormCreateIdentity"
    />
  </section>
</template>
