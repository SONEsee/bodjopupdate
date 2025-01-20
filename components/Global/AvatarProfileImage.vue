<script lang="ts" setup>
import notFoundImage from "@/assets/img/404.png";
const notFoundUrl = ref(notFoundImage);
const image_url = ref(null as string | null);
const globalStore = UseGlobalStore();
const props = defineProps({
  image_url: {
    type: String,
    required: false,
    default: "N/A",
  },
});

const imageLink = computed(() => {
  return props.image_url ?? "N/A";
});

watch(
  imageLink,
  async (newval) => {
    if (newval !== null && newval !== "N/A") {
      const imageResponse = await globalStore.GetFileData(
        imageLink.value ?? "N/A"
      );
      if (imageResponse != "") {
        image_url.value = imageResponse;
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-avatar
    size="220"
    class="mx-auto d-flex align-center"
    color="grey lighten-2"
  >
    <v-img
      alt="Image profile"
      :src="image_url === null ? notFoundUrl : image_url"
    ></v-img>
  </v-avatar>
</template>
