<script lang="ts" setup>
const menu = ref(false);
import { UseGlobalStore } from '~/stores/global';
const globalStore = UseGlobalStore();
const image_url = ref("" as string | "");
const props = defineProps({
  image: {
    type: String,
    requried: true,
    default: "N/A",
  },
});

const imageLink = computed(() => {
  return props.image;
});

watch(
  imageLink,
  async (newval, oldval) => {
    if (newval != null && newval != "N/A") {
      const res = await globalStore.GetFileData(newval);
      if (res !== "") {
        image_url.value = res;
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-menu v-model="menu" location="top center" open-on-hover>
    <template v-slot:activator="{ props }">
      <v-card height="65px" width="65px" :image="image_url" v-bind="props">
      </v-card>
    </template>

    <v-card max-width="300px">
      <v-img :src="image_url" width="280px" height="280px" alt="image"></v-img>
    </v-card>
  </v-menu>
</template>
