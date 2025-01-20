<template>
  <div v-if="datarespons">
    <div v-for="(value, key) in datarespons" :key="key">
      <strong>{{ key }}</strong>: {{ datarespons.items.status }}
    </div>
  </div>
  <div v-else>
    <p v-if="error">{{ error }}</p>
    <p v-else>ບໍ່ມີຂໍ້ມູນ</p>
  </div>
</template>

<script lang="ts" setup>
import axios from "@/helpers/axios";
import { UsermeModel } from "@/models/";
import { ref, onMounted } from "vue";

const datarespons = ref<UsermeModel.UserMeResponse | null>(null);
const error = ref<string | null>(null);

const getdata = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Authorization token is missing.";
      return;
    }
    console.log("Token:", localStorage.getItem("token"));

    const res = await axios.get<UsermeModel.UserMeResponse>("/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data) {
      datarespons.value = res.data;
      console.log("datarespons", datarespons.value);
    }
  } catch (err: any) {
    if (err.response) {
     
      error.value = `Error ${err.response.status}: ${err.response.data.message || "ການເຂົ້າເຖິ່ງບໍ່ໄດ້ຮັບອານຸຍາດ."}`;
    } else {
      error.value = "Error fetching user data. Please try again.";
    }
    console.error("Error fetching user data:", err);
  }
};


onMounted(() => {
  getdata();
});
</script>
