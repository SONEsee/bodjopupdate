<template>
  <section
    style="min-height: 100vh"
    class="d-flex flex-wrap justify-center align-center"
  >
    <v-form ref="form" @submit.prevent="handleLogin">
      <v-card elevation="0" width="560px" class="pa-6">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-avatar color="" size="150" >
                <img src="../../assets/img/Logo.png" alt="" width="150">
              </v-avatar>
            </div>
            <h3 class="text-center">ເຂົ້າສູ່ລະບົບ ບໍລິສັດ ວີວີທີເອັສ ໂຊກໄຊຈະເລີນ ກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</h3>
          </v-col>

          <v-col cols="12">
            <label>ຊື່ຜູ້ໃຊ້ງານ / Username</label>
            <v-text-field
              v-model="username"
              density="comfortable"
              variant="outlined"
              hide-details="auto"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label>ລະຫັດຜ່ານ / Password</label>
            <v-text-field
              v-model="password"
              :type="visible ? 'text' : 'password'"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="visible = !visible"
              :rules="[(v: string) => !!v || 'Password is required']"
              density="comfortable"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="primary"
              type="submit"
              flat
              block
              height="40px"
              class="font-weight-black"
              :loading="loading"
            >
              ເຂົ້າສູ່ລະບົບ
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-0 my-0">
            <div style="font-size: 10px">
              version: ທົດລອງ
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </section>
</template>

<script lang="ts" setup>
import axios from "@/helpers/axios";
import { UserModel } from "@/models/";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const username = ref(null);
const password = ref(null);
const visible = ref(false);
const loading = ref(false);
const form = ref();
const router = useRouter();

const goPath = (path: string) => {
  router.push(path);
};

const DefaultSwalError = (error: any) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.message || 'Something went wrong!',
  });
};

const handleLogin = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      loading.value = true;
      
      const res = await axios.post("/api/auth/login", {
        username: username.value,
        password: password.value,
      });

     
      const { success, message, data } = res.data;
      
      if (success && data && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

      
        Swal.fire({
          icon: 'success',
          title: 'ສຳເລັດ',
          text: message || 'ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ',
          timer: 1500,
          showConfirmButton: false
        });

        
        let timerInterval: ReturnType<typeof setInterval>;
        Swal.fire({
          title: 'ກຳລັງເຂົ້າສູ່ລະບົບ',
          html: 'ຈະເຂົ້າສູ່ໜ້າຫຼັກໃນ <b></b> ວິນາທີ.',
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const htmlContainer = Swal.getHtmlContainer();
            if (htmlContainer) {
              const b = htmlContainer.querySelector('b');
              if (b) {
                timerInterval = setInterval(() => {
                  const timerLeft = Swal.getTimerLeft();
                  if (timerLeft !== undefined) {
                    b.textContent = Math.ceil(timerLeft / 1000).toString();
                  }
                }, 100);
              }
            }
          },
          willClose: () => {
            clearInterval(timerInterval);
            goPath("/");
          }
        });
      } else {
        throw new Error("ຂໍ້ມູນຕອບກັບບໍ່ຖືກຕ້ອງ");
      }
    }
  } catch (error: any) {
    console.error("Login error:", error);
    
    let errorMessage = "ມີຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ";
    
    if (error.response) {
      console.log("Response error data:", error.response.data);
      errorMessage = error.response.data.message || `ຂໍ້ຜິດພາດ: ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'ຂໍ້ຜິດພາດ',
      text: errorMessage,
    });
    
    loading.value = false;
  }
};
</script>