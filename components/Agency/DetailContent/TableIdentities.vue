<script lang="ts" setup>
const agencyStore = UseAgencyStore();
const response_data = computed(() => {
  return agencyStore.response_detail_query_data;
});

const headers = ref([
  { title: "ລຳດັບ", sortable: false, key: "no" },
  { title: "ຮູບພາບ", key: "image_url" },
  { title: "ປະເພດເອກະສານ", key: "type" },
  { title: "ເລກທີ", key: "identity_no" },
]);
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
          color="error"
          variant="text"
          icon="mdi-delete"
          size="small"
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
  </section>
</template>
