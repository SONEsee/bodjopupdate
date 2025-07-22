<script lang="ts" setup>
const props = defineProps({
  page: {
    type: Number,
    required: true,
    default: 1,
  },

  limit: {
    type: Number,
    required: true,
    default: 20,
  },

  totalpage: {
    type: Number,
    required: true,
    default: 1,
  },
});
</script>

<template>
  <div class="d-flex flex-wrap justify-space-between pt-2">
    <div style="width: 250px">
      <label> ຈຳນວນລາຍການທີ່ສະແດງ</label>
      <v-select
        variant="outlined"
        density="compact"
        :model-value="limit"
        :items="GetItemPerPageOptions()"
        @update:model-value="$emit('onSelectionChange', $event)"
      ></v-select>
    </div>

    <div>
      <v-pagination
        class="text-black"
        :total-visible="8"
        :length="totalpage ?? 1"
        :model-value="page"
        @update:model-value="$emit('onPagechange', $event)"
      ></v-pagination>
    </div>
  </div>
</template>
