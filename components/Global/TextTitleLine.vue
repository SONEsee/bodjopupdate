<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "",
  },
});
</script>

<template>
  <section>
    <v-row>
      <v-col cols="12">
        <h3>
          {{ props.title }}
        </h3>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </section>
</template>
