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

// ຄຳນວນວັນທີ່ເຮັດງານ
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
    
    <div class="page-header">
      <div class="header-content">
        <v-icon name="mdi-account-circle" size="32" class="header-icon"></v-icon>
        <div>
          <h1 class="page-title">ຂໍ້ມູນບັດພະນັກງານ</h1>
         
        </div>
      </div>
    </div>

  
    

   
    <v-card class="employee-card mt-6" elevation="4">
      <div class="card-front">
        
        <div class="card-header">
          <div class="company-logo">
            <img src="../../assets/img/Logo.png" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
          <div class="company-info">
            <h3>ບໍລິສັດ ວີວີທີເອັສ</h3>
            <p>ໂຊກໄຊຈະເລີນ ກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</p>
            <small>Employee ID Card</small>
          </div>
        </div>
        
        <div class="card-body">
          <div class="employee-section">
            <div class="employee-photo">
              <v-avatar size="80" :color="getGenderColor(response.gender || 'ຊາຍ')" class="employee-avatar">
                <v-icon :name="getGenderIcon(response.gender || 'ຊາຍ')" size="40" color="white"></v-icon>
              </v-avatar>
            </div>
            
            <div class="employee-details">
              <h2 class="employee-card-name">{{ response.name || 'ບໍ່ມີຂໍ້ມູນ' }}</h2>
              <div class="employee-position">{{ response.position?.position_name || 'ບໍ່ມີຕຳແໜ່ງ' }}</div>
              
              <div class="employee-info-grid">
                <div class="info-row">
                  <span class="info-label">ລະຫັດ:</span>
                  <span class="info-value">{{ response.employee_id }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">ກະ:</span>
                  <span class="info-value">{{ response.schedule?.work_shift || 'ບໍ່ມີຂໍ້ມູນ' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">ເວລາ:</span>
                  <span class="info-value">
                    {{ response.schedule?.shift_start ? formatTime(response.schedule.shift_start) : '--:--' }} - 
                    {{ response.schedule?.shift_end ? formatTime(response.schedule.shift_end) : '--:--' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">ເລີ່ມງານ:</span>
                  <span class="info-value">{{ response.createdAt ? formatDate(response.createdAt) : 'ບໍ່ມີຂໍ້ມູນ' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="qr-section">
            <div class="qr-code-container">
              <div class="qr-code">
                <!-- QR Code Pattern -->
                <svg width="100" height="100" viewBox="0 0 100 100" class="qr-svg">
                  <!-- Corner markers -->
                  <rect x="5" y="5" width="25" height="25" fill="black"/>
                  <rect x="10" y="10" width="15" height="15" fill="white"/>
                  <rect x="13" y="13" width="9" height="9" fill="black"/>
                  
                  <rect x="70" y="5" width="25" height="25" fill="black"/>
                  <rect x="75" y="10" width="15" height="15" fill="white"/>
                  <rect x="78" y="13" width="9" height="9" fill="black"/>
                  
                  <rect x="5" y="70" width="25" height="25" fill="black"/>
                  <rect x="10" y="75" width="15" height="15" fill="white"/>
                  <rect x="13" y="78" width="9" height="9" fill="black"/>
                  
                  <!-- Data pattern -->
                  <rect x="35" y="10" width="3" height="3" fill="black"/>
                  <rect x="40" y="10" width="3" height="3" fill="black"/>
                  <rect x="50" y="10" width="3" height="3" fill="black"/>
                  <rect x="60" y="10" width="3" height="3" fill="black"/>
                  
                  <rect x="10" y="35" width="3" height="3" fill="black"/>
                  <rect x="15" y="35" width="3" height="3" fill="black"/>
                  <rect x="20" y="35" width="3" height="3" fill="black"/>
                  <rect x="35" y="35" width="3" height="3" fill="black"/>
                  <rect x="45" y="35" width="3" height="3" fill="black"/>
                  <rect x="55" y="35" width="3" height="3" fill="black"/>
                  <rect x="65" y="35" width="3" height="3" fill="black"/>
                  <rect x="75" y="35" width="3" height="3" fill="black"/>
                  <rect x="85" y="35" width="3" height="3" fill="black"/>
                  
                  <rect x="35" y="40" width="3" height="3" fill="black"/>
                  <rect x="50" y="40" width="3" height="3" fill="black"/>
                  <rect x="65" y="40" width="3" height="3" fill="black"/>
                  <rect x="80" y="40" width="3" height="3" fill="black"/>
                  
                  <rect x="10" y="45" width="3" height="3" fill="black"/>
                  <rect x="25" y="45" width="3" height="3" fill="black"/>
                  <rect x="40" y="45" width="3" height="3" fill="black"/>
                  <rect x="55" y="45" width="3" height="3" fill="black"/>
                  <rect x="70" y="45" width="3" height="3" fill="black"/>
                  <rect x="85" y="45" width="3" height="3" fill="black"/>
                  
                  <rect x="35" y="50" width="3" height="3" fill="black"/>
                  <rect x="45" y="50" width="3" height="3" fill="black"/>
                  <rect x="60" y="50" width="3" height="3" fill="black"/>
                  <rect x="75" y="50" width="3" height="3" fill="black"/>
                  
                  <rect x="15" y="55" width="3" height="3" fill="black"/>
                  <rect x="30" y="55" width="3" height="3" fill="black"/>
                  <rect x="50" y="55" width="3" height="3" fill="black"/>
                  <rect x="65" y="55" width="3" height="3" fill="black"/>
                  <rect x="80" y="55" width="3" height="3" fill="black"/>
                  
                  <rect x="35" y="60" width="3" height="3" fill="black"/>
                  <rect x="40" y="60" width="3" height="3" fill="black"/>
                  <rect x="55" y="60" width="3" height="3" fill="black"/>
                  <rect x="70" y="60" width="3" height="3" fill="black"/>
                  <rect x="85" y="60" width="3" height="3" fill="black"/>
                  
                  <rect x="20" y="65" width="3" height="3" fill="black"/>
                  <rect x="45" y="65" width="3" height="3" fill="black"/>
                  <rect x="60" y="65" width="3" height="3" fill="black"/>
                  <rect x="75" y="65" width="3" height="3" fill="black"/>
                  
                  <rect x="35" y="75" width="3" height="3" fill="black"/>
                  <rect x="50" y="75" width="3" height="3" fill="black"/>
                  <rect x="65" y="75" width="3" height="3" fill="black"/>
                  <rect x="80" y="75" width="3" height="3" fill="black"/>
                  
                  <rect x="40" y="80" width="3" height="3" fill="black"/>
                  <rect x="55" y="80" width="3" height="3" fill="black"/>
                  <rect x="70" y="80" width="3" height="3" fill="black"/>
                  <rect x="85" y="80" width="3" height="3" fill="black"/>
                  
                  <rect x="35" y="85" width="3" height="3" fill="black"/>
                  <rect x="45" y="85" width="3" height="3" fill="black"/>
                  <rect x="60" y="85" width="3" height="3" fill="black"/>
                  <rect x="75" y="85" width="3" height="3" fill="black"/>
                  <rect x="90" y="85" width="3" height="3" fill="black"/>
                </svg>
              </div>
              <div class="qr-label">
                <small>ສະແກນເພື່ອຢັ້ງຢືນຕົວຕົນ</small>
                <div class="qr-id">EMP-{{ response.employee_id }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="security-strip"></div>
          <div class="footer-info">
            <small>ບັດນີ້ມີຜົນບັງຄັບໃຊ້ຕັ້ງແຕ່ {{ response.createdAt ? formatDate(response.createdAt) : '' }}</small>
            <small class="validity">ໃຊ້ໄດ້ຈົນກວ່າຈະມີການແຈ້ງເຕືອນ</small>
          </div>
        </div>
      </div>
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
  color: rgb(var(--v-theme-on-surface-variant));
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
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.2;
}

/* ບັດພະນັກງານ */
.employee-card {
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  max-width: 400px;
  margin: 0 auto;
}

.card-front {
  padding: 0;
  position: relative;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.company-logo {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.company-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.company-info p {
  margin: 2px 0 0 0;
  font-size: 13px;
  opacity: 0.9;
}

.company-info small {
  font-size: 11px;
  opacity: 0.8;
}

.card-body {
  padding: 20px 24px;
  display: flex;
  gap: 20px;
}

.employee-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.employee-photo {
  align-self: flex-start;
}

.employee-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.employee-details {
  flex: 1;
}

.employee-card-name {
  margin: 0 0 6px 0;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.employee-position {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
  font-weight: 500;
}

.employee-info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.info-label {
  opacity: 0.8;
  font-weight: 500;
  min-width: 60px;
}

.info-value {
  font-weight: 600;
  text-align: right;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-code {
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.qr-svg {
  display: block;
}

.qr-label {
  text-align: center;
}

.qr-label small {
  font-size: 10px;
  opacity: 0.8;
  display: block;
  margin-bottom: 2px;
}

.qr-id {
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.card-footer {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px 24px;
}

.security-strip {
  height: 4px;
  background: linear-gradient(90deg, 
    #ff6b6b 0%, 
    #4ecdc4 25%, 
    #45b7d1 50%, 
    #96ceb4 75%, 
    #feca57 100%
  );
  border-radius: 2px;
  margin-bottom: 8px;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info small {
  font-size: 10px;
  opacity: 0.7;
}

.validity {
  font-weight: 600;
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
    gap: 16px;
  }
  
  .employee-section {
    width: 100%;
  }
  
  .qr-section {
    width: 100%;
  }
  
  .employee-card {
    max-width: 100%;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}
</style>