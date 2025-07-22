<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>

<template>
  <v-overlay
    :model-value="props.loading"
    class="align-center justify-center"
    persistent
    close-on-content-click
  >
    <GlobalLoadingIndicator />
  </v-overlay>
</template>
