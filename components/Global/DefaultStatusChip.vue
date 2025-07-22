<script lang="ts" setup>
const props = defineProps({
  status: {
    type: Number,
    required: true,
    default: 0,
  },
});

const list_status = ref({
  0: "ປິດໃຊ້ງານ",
  1: "ເປີດໃຊ້ງານ",
} as { [key: number]: string });

const statusColor = ref({
  0: "warning",
  1: "success",
} as { [key: number]: string });
</script>
<template>
  <div v-if="props.status !== null">
    <v-chip :color="statusColor[props.status]">{{
      list_status[props.status]
    }}</v-chip>
  </div>
</template>
