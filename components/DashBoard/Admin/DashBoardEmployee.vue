<script setup lang="ts">
const employeeStore = otStore();

const response = computed(() => {
  return employeeStore.response_employee_data || {};
});

onMounted(() => {
  employeeStore.employeeMy();
});

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("lo-LA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateAge = (birthdate: string) => {
  if (!birthdate) return "";
  const today = new Date();
  const birth = new Date(birthdate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
};

const formatSalary = (amount: string) => {
  if (!amount) return "";
  return new Intl.NumberFormat("lo-LA").format(parseFloat(amount)) + " ກີບ";
};
</script>

<template>
  <div class="employee-profile">
    <!-- Loading State -->
    <div v-if="!response.employee_id" class="loading-container">
      <div class="spinner"></div>
      <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <!-- Employee Profile Content -->
    <div v-else class="profile-container">
      <!-- Header Section -->
      <div class="profile-header">
        <div class="avatar-container">
          <div class="avatar">
            <span class="avatar-text">{{
              response.name?.charAt(0) || "N"
            }}</span>
          </div>
          <div class="status-badge">
            <span class="status-dot"></span>
            ພວກເຮົາ
          </div>
        </div>
        <div class="basic-info">
          <h1 class="employee-name">{{ response.name }}</h1>
          <p class="employee-id">ID: {{ response.employee_id }}</p>
          <div class="position-info">
            <span class="position-badge">{{
              response.position?.position_name
            }}</span>
            <span
              class="gender-badge"
              :class="response.gender === 'ຍິງ' ? 'female' : 'male'"
            >
              {{ response.gender }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Personal Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3>ຂໍ້ມູນສ່ວນຕົວ</h3>
            <div class="card-icon">👤</div>
          </div>
          <div class="card-content">
            <div class="info-row">
              <span class="label">ວັນເດືອນປີເກີດ:</span>
              <span class="value">{{ formatDate(response.birthdate) }}</span>
            </div>
            <div class="info-row">
              <span class="label">ອາຍຸ:</span>
              <span class="value"
                >{{ calculateAge(response.birthdate) }} ປີ</span
              >
            </div>
            <div class="info-row">
              <span class="label">ເບີໂທ:</span>
              <span class="value phone">{{ response.phone }}</span>
            </div>
            <div class="info-row">
              <span class="label">ທີ່ຢູ່:</span>
              <span class="value address">{{ response.address }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <h3>ຕາຕະລາງການເຮັດວຽກ</h3>
            <div class="card-icon">⏰</div>
          </div>
          <div class="card-content">
            <div class="info-row">
              <span class="label">ກະ:</span>
              <span class="value shift-badge">{{
                response.schedule?.work_shift
              }}</span>
            </div>
            <div class="info-row">
              <span class="label">ເວລາເຂົ້າງານ:</span>
              <span class="value time">{{
                response.schedule?.shift_start
              }}</span>
            </div>
            <div class="info-row">
              <span class="label">ເວລາເລີກງານ:</span>
              <span class="value time">{{ response.schedule?.shift_end }}</span>
            </div>
            <div class="work-hours">
              <div class="hours-display">
                <span class="hours-number">9</span>
                <span class="hours-label">ຊົ່ວໂມງ/ວັນ</span>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <h3>ຕຳແໜ່ງ & ເງິນເດືອນ</h3>
            <div class="card-icon">💼</div>
          </div>
          <div class="card-content">
            <div class="info-row">
              <span class="label">ຕຳແໜ່ງ:</span>
              <span class="value position-highlight">{{
                response.position?.position_name
              }}</span>
            </div>
            <div class="info-row">
              <span class="label">ຄ່າ OT:</span>
              <span class="value salary">{{
                formatSalary(response.position?.rate_ot)
              }}</span>
            </div>
            <div class="info-row">
              <span class="label">ວັນທີ່ເຂົ້າວຽກ:</span>
              <span class="value">{{ formatDate(response.createdAt) }}</span>
            </div>
            <div class="info-row">
              <span class="label">ອັບເດດລ່າສຸດ:</span>
              <span class="value">{{ formatDate(response.updatedAt) }}</span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="card-header">
            <h3>ສະຖິຕິເງິນເດືອນໄດ້ຮັບ</h3>
            <div class="card-icon">💼</div>
          </div>

          <DashBoardSalary />
        </div>
        
      </div>
      <div class="info-card"><MongVeik /></div>
       
    </div>
  </div>
</template>

<style scoped>
.employee-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Noto Sans Lao", sans-serif;
  background: linear-gradient(135deg, #1f38aa 0%, #2f48d3 100%);
  min-height: 100vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(13, 25, 189, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.profile-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #251bb8 100%);
  color: white;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.avatar-text {
  font-size: 48px;
  font-weight: bold;
  color: white;
}

.status-badge {
  position: absolute;
  bottom: 10px;
  right: -10px;
  background: #10b981;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.basic-info {
  flex: 1;
}

.employee-name {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.employee-id {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 16px 0;
}

.position-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.position-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.gender-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.gender-badge.female {
  background: #ec4899;
  color: white;
}

.gender-badge.male {
  background: #3b82f6;
  color: white;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  padding: 40px;
}

.info-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.card-icon {
  font-size: 24px;
}

.card-content {
  padding: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #6b7280;
  min-width: 120px;
}

.value {
  color: #111827;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

.phone {
  color: #059669;
  font-family: monospace;
}

.address {
  font-size: 14px;
  line-height: 1.4;
}

.time {
  color: #dc2626;
  font-weight: 600;
  font-family: monospace;
}

.shift-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.salary {
  color: #047857;
  font-weight: 700;
}

.position-highlight {
  color: #7c3aed;
  font-weight: 700;
}

.work-hours {
  margin-top: 20px;
  text-align: center;
}

.hours-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  display: inline-block;
}

.hours-number {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.hours-label {
  font-size: 12px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .employee-profile {
    padding: 10px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }

  .employee-name {
    font-size: 24px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .value {
    text-align: left;
  }
}
</style>
