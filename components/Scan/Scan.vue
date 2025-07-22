<script setup lang="ts">
const form = ref()
const valid = ref(false)
const loading = ref(false)
const scaner = scanStore()
const request = computed(() => scaner.form_scan)
const showScanner = ref(false)

const Destription = () => {
  valid.value = !valid.value
}

const handlSubmit = async () => {
  try {
    loading.value = true
    
    // Validate form
    const { valid: isValid } = await form.value.validate()
    
    if (isValid) {
      // Check if employee_id is not empty
      if (!request.value.employee_id.trim()) {
        CallSwal({
          title: "ຂໍ້ຜິດພາດ",
          text: "ກະລຸນາປ້ອນ Employee ID",
          icon: "error",
          confirmButtonText: "OK"
        })
        return
      }

      // Call the scan method from store
      await scaner.scanEmployee()
      console.log("Form submitted successfully:", request.value)
      
      // Reset form after successful submission
      form.value.reset()
      form.value.resetValidation()
      
    } else {
      console.log("Form validation failed")
    }
  } catch (error) {
    console.error("Error submitting form:", error)
    
    // Show error message
    CallSwal({
      title: "ຂໍ້ຜິດພາດ",
      text: "ເກີດຂໍ້ຜິດພາດໃນການສະແດງຂໍ້ມູນ",
      icon: "error",
      confirmButtonText: "OK"
    })
  } finally {
    loading.value = false
  }
}

// Quick scan presets
const quickScanIds = ['EMP001', 'EMP002', 'EMP003', 'EMP004']
const selectQuickId = (id: string) => {
  request.value.employee_id = id
  form.value.validate()
}

// Validation rules
const employeeIdRules = [
  (v: string) => !!v || 'ກະລຸນາປ້ອນ Employee ID',
  (v: string) => v?.trim().length >= 3 || 'Employee ID ຕ້ອງມີຢ່າງນ້ອຍ 3 ຕົວອັກສອນ',
  (v: string) => /^[a-zA-Z0-9]+$/.test(v?.trim() || '') || 'Employee ID ສາມາດມີແຕ່ຕົວອັກສອນ ແລະ ຕົວເລກເທົ່ານັ້ນ'
]

// Watch for form validity
watch(() => request.value.employee_id, () => {
  if (form.value) {
    form.value.validate()
  }
})

// Simulate scanning animation
const isScanning = ref(false)
const startScan = async () => {
  isScanning.value = true
  // Simulate scan delay
  setTimeout(() => {
    isScanning.value = false
    handlSubmit()
  }, 1500)
}
</script>

<template>
  <div class="scan-container">
    <!-- Header Section -->
    <div class="scan-header">
      <div class="scan-icon-wrapper">
        <v-icon 
          :class="['scan-icon', { 'scanning': isScanning }]" 
          size="60"
          color="primary"
        >
          mdi-qrcode-scan
        </v-icon>
      </div>
      <h2 class="scan-title">ສະແກນພະນັກງານ</h2>
      <p class="scan-subtitle">ປ້ອນ Employee ID ເພື່ອບັນທຶກການເຂົ້າງານ</p>
    </div>

    
    <v-card 
      class="scan-card" 
      elevation="8"
      rounded="xl"
    >
      <v-card-text class="pa-8">
        <v-form ref="form" @submit.prevent="startScan" v-model="valid">
          
          <div class="input-section">
            <v-text-field 
              v-model="request.employee_id"
             
              label="Employee ID"
              placeholder="ເຊັ່ນ: EMP001"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              class="modern-input"
              :disabled="loading || isScanning"
              clearable
              autofocus
              counter
              maxlength="20"
              prepend-inner-icon="mdi-account-badge"
            >
              <template #append-inner>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="showScanner = !showScanner"
                  :disabled="loading || isScanning"
                >
                  <v-icon>mdi-camera</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>

          
          <!-- <div class="quick-select-section" v-if="!loading && !isScanning">
            <p class="quick-select-title">ເລືອກດ່ວນ:</p>
            <div class="quick-buttons">
              <v-chip
                v-for="id in quickScanIds"
                :key="id"
                @click="selectQuickId(id)"
                :color="request.employee_id === id ? 'primary' : 'default'"
                :variant="request.employee_id === id ? 'flat' : 'outlined'"
                class="quick-chip"
                size="small"
              >
                {{ id }}
              </v-chip>
            </div>
          </div> -->

          
          <div class="scan-button-section">
            <v-btn 
              type="submit"
              :color="isScanning ? 'warning' : 'primary'"
              :loading="loading"
              :disabled="!valid || loading"
              size="x-large"
              block
              rounded="xl"
              class="scan-button"
              elevation="4"
            >
              <v-icon 
                start 
                :class="{ 'scanning-icon': isScanning }"
                size="24"
              >
                {{ isScanning ? 'mdi-radar' : 'mdi-qrcode-scan' }}
              </v-icon>
              {{ isScanning ? 'ກຳລັງສະແກນ...' : 'ສະແກນພະນັກງານ' }}
            </v-btn>
          </div>

         
          <v-expand-transition>
            <div v-if="showScanner" class="camera-section">
              <v-card 
                class="camera-mock" 
                rounded="lg"
                color="grey-lighten-5"
              >
                <v-card-text class="text-center py-8">
                  <v-icon size="80" color="grey">mdi-camera</v-icon>
                  <p class="text-body-2 mt-2">Camera Scanner (Demo)</p>
                  <v-btn 
                    size="small" 
                    variant="outlined" 
                    class="mt-2"
                    @click="showScanner = false"
                  >
                    ປິດ Camera
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-expand-transition>

        </v-form>
      </v-card-text>
    </v-card>

    
    <div class="status-section">
      <v-chip
        :color="valid ? 'success' : 'warning'"
        :prepend-icon="valid ? 'mdi-check-circle' : 'mdi-alert-circle'"
        variant="flat"
        size="small"
      >
        {{ valid ? 'ພ້ອມສະແກນ' : 'ກະລຸນາປ້ອນຂໍ້ມູນ' }}
      </v-chip>
    </div>
  </div>
</template>

<style scoped>
.scan-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.scan-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.scan-icon-wrapper {
  margin-bottom: 16px;
}

.scan-icon {
  transition: all 0.3s ease;
}

.scan-icon.scanning {
  animation: scan-pulse 1.5s infinite;
}

@keyframes scan-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.scan-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.scan-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.scan-card {
  flex: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-section {
  margin-bottom: 24px;
}

.modern-input :deep(.v-field) {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.modern-input :deep(.v-field:hover) {
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.modern-input :deep(.v-field--focused) {
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.2);
}

.quick-select-section {
  margin-bottom: 32px;
  text-align: center;
}

.quick-select-title {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.scan-button-section {
  margin-bottom: 24px;
}

.scan-button {
  height: 64px !important;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.scan-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3) !important;
}

.scanning-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.camera-section {
  margin-top: 16px;
}

.camera-mock {
  border: 2px dashed #ccc;
}

.status-section {
  text-align: center;
  margin-top: 24px;
}


@media (max-width: 600px) {
  .scan-container {
    padding: 16px;
  }
  
  .scan-title {
    font-size: 1.75rem;
  }
  
  .scan-card {
    margin: 0 -8px;
  }
  
  .scan-card .v-card-text {
    padding: 24px 16px;
  }
}


@media (prefers-color-scheme: dark) {
  .scan-container {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
  
  .quick-select-title {
    color: #999;
  }
}


.scan-button:focus-visible {
  outline: 3px solid rgba(25, 118, 210, 0.5);
  outline-offset: 2px;
}

.quick-chip:focus-visible {
  outline: 2px solid rgba(25, 118, 210, 0.5);
  outline-offset: 1px;
}
</style>