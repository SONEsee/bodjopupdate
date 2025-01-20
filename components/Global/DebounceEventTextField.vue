<script lang="ts" setup>
const emit = defineEmits(["setinput"]);

defineProps<{
  input?: string | null;
  label: string;
}>();

const onDebounceInput = useDebounceFn((value: string) => {
  emit("setinput", value);
}, 800);
</script>

<template>
  <section>
    <label v-if="label">{{ label }}</label>
    <v-text-field
      variant="outlined"
      hide-details
      density="compact"
      :model-value="input"
      @update:model-value="onDebounceInput"
    ></v-text-field>
  </section>
</template>
