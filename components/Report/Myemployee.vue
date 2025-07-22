<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";

const employeeStore = otStore();

const response = computed(() => {
  return employeeStore.response_employee_data || {};
});

// ຄຳນວນອາຍຸ
const age = computed(() => {
  if (response.value.birthdate) {
    return dayjs().diff(dayjs(response.value.birthdate), 'year');
  }
  return 0;
});

// ຄຳນວນວັນທີ່ເຮັດວຽກ
const workingDays = computed(() => {
  if (response.value.createdAt) {
    return dayjs().diff(dayjs(response.value.createdAt), 'day');
  }
  return 0;
});

// ຟໍແມັດວັນທີ່
const formatDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

// ຟໍແມັດເວລາ
const formatTime = (timeString: string) => {
  return timeString.slice(0, 5); // ເອົາແຕ່ HH:MM
};

// ຟໍແມັດເງິນ
const formatMoney = (amount: string) => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(parseFloat(amount)) + ' ກີບ';
};

// ຟັງຊັນສຳລັບໄອຄອນເພດ
const getGenderIcon = (gender: string) => {
  return gender === 'ຍິງ' ? 'mdi-gender-female' : 'mdi-gender-male';
};

const getGenderColor = (gender: string) => {
  return gender === 'ຍິງ' ? 'pink' : 'blue';
};

onMounted(() => {
  employeeStore.employeeMy();
});
</script>

<template>
  <v-container class="employee-profile-container">
    <!-- ຫົວຂໍ້ຫຼັກ -->
    <div class="page-header">
      <div class="header-content">
        <v-icon name="mdi-account-circle" size="32" class="header-icon"></v-icon>
        <div>
          <h1 class="page-title">ຂໍ້ມູນຕຳແໜ່ງສວນຕົວຂອງພະນັກງານ</h1>
          <p class="page-subtitle">ຂໍ້ມູນສ່ວນຕົວ ແລະ ລາຍລະອຽດການເຮັດວຽກ</p>
        </div>
      </div>
    </div>

    <!-- ຂໍ້ມູນພາບລວມ -->
    <v-card class="profile-overview mb-6" elevation="3">
      <div class="profile-banner">
        <div class="profile-avatar">
          <v-avatar size="80" :color="getGenderColor(response.gender || 'ຊາຍ')">
            <v-icon :name="getGenderIcon(response.gender || 'ຊາຍ')" size="40" color="white"></v-icon>
          </v-avatar>
          <div class="status-indicator">
            <v-chip color="success" size="small">
              <v-icon name="mdi-check-circle" size="14" class="mr-1"></v-icon>
              ເຮັດວຽກຢູ່
            </v-chip>
          </div>
        </div>
        
        <div class="profile-info">
          <h2 class="employee-name">{{ response.name || 'ບໍ່ມີຂໍ້ມູນ' }}</h2>
          <div class="employee-meta">
            <div class="meta-item">
              <v-icon name="mdi-badge-account" size="16" class="mr-1"></v-icon>
              ລະຫັດ: {{ response.employee_id }}
            </div>
            <div class="meta-item">
              <v-icon name="mdi-briefcase" size="16" class="mr-1"></v-icon>
              {{ response.position?.position_name || 'ບໍ່ມີຕຳແໜ່ງ' }}
            </div>
            <div class="meta-item">
              <v-icon name="mdi-calendar-clock" size="16" class="mr-1"></v-icon>
              {{ response.schedule?.work_shift || 'ບໍ່ມີກະ' }}
            </div>
          </div>
        </div>
      </div>
    </v-card>

  
    <div class="details-grid">
      
      <v-card class="detail-card" elevation="2">
        <v-card-title class="card-title">
          <v-icon name="mdi-account" class="mr-2"></v-icon>
          ຂໍ້ມູນສ່ວນຕົວ
        </v-card-title>
        <v-card-text>
          <div class="detail-list">
            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-account-outline" size="16" class="mr-2"></v-icon>
                ຊື່ ແລະ ນາມສະກຸນ
              </div>
              <div class="detail-value">{{ response.name || 'ບໍ່ມີຂໍ້ມູນ' }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon :name="getGenderIcon(response.gender || 'ຊາຍ')" size="16" class="mr-2"></v-icon>
                ເພດ
              </div>
              <div class="detail-value">
                <v-chip :color="getGenderColor(response.gender || 'ຊາຍ')" size="small">
                  {{ response.gender || 'ບໍ່ມີຂໍ້ມູນ' }}
                </v-chip>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-cake-variant" size="16" class="mr-2"></v-icon>
                ວັນເກີດ
              </div>
              <div class="detail-value">
                {{ response.birthdate ? formatDate(response.birthdate) : 'ບໍ່ມີຂໍ້ມູນ' }}
                <span v-if="response.birthdate" class="">
                  ({{ age }} ປີ)
                </span>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-map-marker" size="16" class="mr-2"></v-icon>
                ທີ່ຢູ່
              </div>
              <div class="detail-value">{{ response.address || 'ບໍ່ມີຂໍ້ມູນ' }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-phone" size="16" class="mr-2"></v-icon>
                ເບີໂທລະສັບ
              </div>
              <div class="detail-value">
                <a :href="`tel:${response.phone}`" class="phone-link">
                  {{ response.phone || 'ບໍ່ມີຂໍ້ມູນ' }}
                </a>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- ຂໍ້ມູນການເຮັດວຽກ -->
      <v-card class="detail-card" elevation="2">
        <v-card-title class="card-title">
          <v-icon name="mdi-briefcase" class="mr-2"></v-icon>
          ຂໍ້ມູນການເຮັດວຽກ
        </v-card-title>
        <v-card-text>
          <div class="detail-list">
            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-account-tie" size="16" class="mr-2"></v-icon>
                ຕຳແໜ່ງວຽກ
              </div>
              <div class="detail-value">{{ response.position?.position_name || 'ບໍ່ມີຂໍ້ມູນ' }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-clock-outline" size="16" class="mr-2"></v-icon>
                ກະເຮັດວຽກ
              </div>
              <div class="detail-value">
                <v-chip color="info" size="small">
                  {{ response.schedule?.work_shift || 'ບໍ່ມີຂໍ້ມູນ' }}
                </v-chip>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-clock-start" size="16" class="mr-2"></v-icon>
                ເວລາເຂົ້າວຽກ
              </div>
              <div class="detail-value">
                {{ response.schedule?.shift_start ? formatTime(response.schedule.shift_start) : 'ບໍ່ມີຂໍ້ມູນ' }}
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-clock-end" size="16" class="mr-2"></v-icon>
                ເວລາອອກວຽກ
              </div>
              <div class="detail-value">
                {{ response.schedule?.shift_end ? formatTime(response.schedule.shift_end) : 'ບໍ່ມີຂໍ້ມູນ' }}
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-cash" size="16" class="mr-2"></v-icon>
                ອັດຕາ OT
              </div>
              <div class="detail-value">
                <span class="money-value">
                  {{ response.position?.rate_ot ? formatMoney(response.position.rate_ot) : 'ບໍ່ມີຂໍ້ມູນ' }}
                </span>
                <small v-if="response.position?.rate_ot" class="per-hour">/ຊົ່ວໂມງ</small>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <v-icon name="mdi-calendar-plus" size="16" class="mr-2"></v-icon>
                ເລີ່ມເຮັດວຽກ
              </div>
              <div class="detail-value">
                {{ response.createdAt ? formatDate(response.createdAt) : 'ບໍ່ມີຂໍ້ມູນ' }}
                <span v-if="response.createdAt" class="work-days">
                  ({{ workingDays }} ວັນ)
                </span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- ສະຖິຕິການເຮັດວຽກ -->
    <v-card class="stats-card mt-6" elevation="2">
      <v-card-title class="card-title">
        <v-icon name="mdi-chart-line" class="mr-2"></v-icon>
        ສະຖິຕິການເຮັດວຽກ
      </v-card-title>
      <v-card-text>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon-wrapper primary">
              <v-icon name="mdi-calendar-check" size="24" color="white"></v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ workingDays }}</div>
              <div class="stat-label">ວັນທີ່ເຮັດວຽກ</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon-wrapper success">
              <v-icon name="mdi-account-check" size="24" color="white"></v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">ດີເລີດ</div>
              <div class="stat-label">ສະຖານະ</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon-wrapper info">
              <v-icon name="mdi-clock-outline" size="24" color="white"></v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">
                {{ response.schedule?.shift_start && response.schedule?.shift_end ? 
                    (parseInt(response.schedule.shift_end.split(':')[0]) - parseInt(response.schedule.shift_start.split(':')[0])) : 0 }}
              </div>
              <div class="stat-label">ຊົ່ວໂມງ/ວັນ</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon-wrapper warning">
              <v-icon name="mdi-currency-usd" size="24" color="white"></v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ response.position?.rate_ot ? formatMoney(response.position.rate_ot) : '0' }}</div>
              <div class="stat-label">ອັດຕາ OT</div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

   
    <v-card class="employee-card mt-6" elevation="3">
      <div class="card-background"></div>
      <v-card-text class="employee-card-content">
        <div class="card-header">
          <div class="company-logo">
            <v-icon name="mdi-domain" size="24" color="white"></v-icon>
          </div>
          <div class="company-info">
            <h3>ບໍລິສັດ ວີວີທີເອັສ</h3>
            <p>Employee ID Card</p>
          </div>
        </div>
        
        <div class="card-body">
          <div class="">
            <v-avatar size="60" :color="getGenderColor(response.gender || 'ຊາຍ')">
              <v-icon :name="getGenderIcon(response.gender || 'ຊາຍ')" size="30" color="white"></v-icon>
            </v-avatar>
          </div>
          
          <div class="card-details">
            <h4>{{ response.name || 'ບໍ່ມີຂໍ້ມູນ' }}</h4>
            <p>{{ response.position?.position_name || 'ບໍ່ມີຕຳແໜ່ງ' }}</p>
            <p>ID: {{ response.employee_id }}</p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.employee-profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

/* ຫົວຂໍ້ */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  color: rgb(var(--v-theme-primary));
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

.page-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 4px 0 0 0;
  font-size: 14px;
}

/* ໂປຣໄຟລ໌ພາບລວມ */
.profile-overview {
  border-radius: 16px;
  overflow: hidden;
}

.profile-banner {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  color: white;
}

.profile-avatar {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.profile-info {
  flex: 1;
}

.employee-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.employee-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  opacity: 0.9;
}

/* ລາຍລະອຽດ */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  font-weight: 600;
  padding: 16px 20px;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  display: flex;
  align-items: center;
  
  font-size: 14px;
  font-weight: 500;
  min-width: 140px;
}

.detail-value {
  text-align: right;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.phone-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.age-badge, .work-days {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 12px;
  margin-left: 8px;
}

.money-value {
  color: rgb(var(--v-theme-success));
  font-weight: 600;
}

.per-hour {
  color: rgb(var(--v-theme-on-surface-variant));
  margin-left: 4px;
}

/* ສະຖິຕິ */
.stats-card {
  border-radius: 12px;
  overflow: hidden;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 8px;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.primary {
  background: rgb(var(--v-theme-primary));
}

.stat-icon-wrapper.success {
  background: rgb(var(--v-theme-success));
}

.stat-icon-wrapper.info {
  background: rgb(var(--v-theme-info));
}

.stat-icon-wrapper.warning {
  background: rgb(var(--v-theme-warning));
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
 
  line-height: 1.2;
}

/* ບັດພະນັກວຽກ */
.employee-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
}

.employee-card-content {
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.company-logo {
  width: 40px;
  height: 40px;
  background: rgb(var(--v-theme-primary));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.company-info p {
  margin: 0;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.card-body {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-details h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.card-details p {
  margin: 2px 0;
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Responsive */
@media (max-width: 768px) {
  .employee-profile-container {
    padding: 16px;
  }
  
  .profile-banner {
    flex-direction: column;
    text-align: center;
    padding: 24px 16px;
  }
  
  .employee-meta {
    justify-content: center;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .detail-value {
    text-align: left;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .card-body {
    flex-direction: column;
    text-align: center;
  }
}
</style>