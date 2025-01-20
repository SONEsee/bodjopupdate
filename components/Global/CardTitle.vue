<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "N/A",
  },

  text: {
    type: String,
    required: true,
    default: "N/A",
  },
});
</script>

<template>
  <section>
    <label> {{ props.title }} </label>
    <v-card
      min-height="50px"
      color="#E8E8E8"
      flat
      class="rounded-lg d-flex flex-wrap align-center"
    >
      <div class="ml-4">{{ props.text }}</div>
    </v-card>
  </section>
</template>
