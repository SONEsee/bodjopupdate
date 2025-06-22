<template>
  <section class="login-container">
    <div class="background-overlay">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>

    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-form ref="form" @submit.prevent="handleLogin">
            <v-card class="login-card pa-8" elevation="24" rounded="xl">
              <!-- Logo Section -->
              <div class="text-center mb-8">
                <div class="logo-container">
                  <v-avatar size="120" class="logo-avatar elevation-8">
                    <img
                      src="../../assets/img/Logo.png"
                      alt="Logo"
                      width="120"
                    />
                  </v-avatar>
                </div>
                <h2 class="company-title mt-6">
                  ບໍລິສັດ ວີວີທີເອັສ ໂຊກໄຊຈະເລີນ
                </h2>
                <p class="subtitle-text">ກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</p>
                <div class="title-underline"></div>
              </div>

              <!-- Login Form -->
              <div class="form-section">
                <!-- Username Field -->
                <div class="input-group mb-6">
                  <label class="field-label">
                    <v-icon size="18" class="mr-2">mdi-account</v-icon>
                    ຊື່ຜູ້ໃຊ້ງານ / Username
                  </label>
                  <v-text-field
                    v-model="username"
                    density="comfortable"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
                    prepend-inner-icon="mdi-account-outline"
                  ></v-text-field>
                </div>

                <!-- Password Field -->
                <div class="input-group mb-8">
                  <label class="field-label">
                    <v-icon size="18" class="mr-2">mdi-lock</v-icon>
                    ລະຫັດຜ່ານ / Password
                  </label>
                  <v-text-field
                    v-model="password"
                    :type="visible ? 'text' : 'password'"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="visible = !visible"
                    :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
                    density="comfortable"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    prepend-inner-icon="mdi-lock-outline"
                  ></v-text-field>
                </div>

                <!-- Login Button -->
                <v-btn
                  color="#6495ED"
                  type="submit"
                  block
                  size="large"
                  class="login-btn mb-4"
                  :loading="loading"
                  rounded="lg"
                  elevation="4"
                >
                  <v-icon left class="mr-2">mdi-login</v-icon>
                  ເຂົ້າສູ່ລະບົບ
                </v-btn>

                <!-- Version Info -->
                <div class="version-info text-center">
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="#6495ED"
                    class="version-chip"
                  >
                    <v-icon size="14" class="mr-1">mdi-information</v-icon>
                    Version: ທົດລອງ
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
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
    icon: "error",
    title: "ຂໍ້ຜິດພາດ",
    text: error.message || "ມີບາງຢ່າງຜິດພາດ!",
    confirmButtonColor: "#6495ED",
    background: "#ffffff",
    color: "#333333",
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
        localStorage.setItem(
          "employee_id",
          JSON.stringify(data.user.employee_id)
        );
        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ!",
          text: message || "ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#6495ED",
          background: "#ffffff",
          color: "#333333",
        });

        let timerInterval: ReturnType<typeof setInterval>;
        Swal.fire({
          title: "ກຳລັງເຂົ້າສູ່ລະບົບ",
          html: "ຈະເຂົ້າສູ່ໜ້າຫຼັກໃນ <b></b> ວິນາທີ.",
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: "#6495ED",
          background: "#ffffff",
          color: "#333333",
          didOpen: () => {
            Swal.showLoading();
            const htmlContainer = Swal.getHtmlContainer();
            if (htmlContainer) {
              const b = htmlContainer.querySelector("b");
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
          },
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
      errorMessage =
        error.response.data.message || `ຂໍ້ຜິດພາດ: ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      icon: "error",
      title: "ຂໍ້ຜິດພາດ",
      text: errorMessage,
      confirmButtonColor: "#6495ED",
      background: "#ffffff",
      color: "#333333",
    });

    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #6495ed 0%, #87ceeb 50%, #e6f3ff 100%);
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  bottom: 15%;
  right: 10%;
  animation-delay: 1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.v-container {
  position: relative;
  z-index: 2;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(100, 149, 237, 0.2) !important;
}

.logo-container {
  position: relative;
  display: inline-block;
}

.logo-avatar {
  background: linear-gradient(135deg, #6495ed, #87ceeb);
  border: 4px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.logo-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(100, 149, 237, 0.3);
}

.company-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle-text {
  color: #6495ed;
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 16px;
}

.title-underline {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #6495ed, #87ceeb);
  margin: 0 auto;
  border-radius: 2px;
}

.form-section {
  margin-top: 32px;
}

.input-group {
  position: relative;
}

.field-label {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-input :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(100, 149, 237, 0.2);
}

.custom-input :deep(.v-field__outline) {
  --v-field-border-color: #e0e7ff;
}

.custom-input :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #6495ed;
  border-width: 2px;
}

.custom-input :deep(.v-field__input) {
  padding: 16px;
  font-size: 1rem;
}

.login-btn {
  background: linear-gradient(135deg, #6495ed 0%, #4169e1 100%) !important;
  color: white !important;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: none;
  letter-spacing: 0.5px;
  height: 56px !important;
  transition: all 0.3s ease;
  border: none;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(100, 149, 237, 0.4) !important;
  background: linear-gradient(135deg, #4169e1 0%, #6495ed 100%) !important;
}

.login-btn:active {
  transform: translateY(0);
}

.version-info {
  margin-top: 24px;
}

.version-chip {
  background: rgba(100, 149, 237, 0.1) !important;
  color: #6495ed !important;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    padding: 24px !important;
  }

  .company-title {
    font-size: 1.2rem;
  }

  .subtitle-text {
    font-size: 0.9rem;
  }

  .floating-shape {
    display: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(30, 41, 59, 0.95);
    color: white;
  }

  .company-title {
    color: white;
  }

  .field-label {
    color: #e2e8f0;
  }
}
</style>
