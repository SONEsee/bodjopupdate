<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";

const salaryStore = otStore();

const response = computed(() => {
  return salaryStore.response_data_salary?.data || [];
});


const employeeInfo = computed(() => {
  if (response.value.length > 0) {
    return response.value[0].employee;
  }
  return null;
});


const personalStats = computed(() => {
  const uniquePayments = sortedPayments.value;
  if (!uniquePayments.length) return null;
  
  const totalPayments = uniquePayments.length;
  const totalReceived = uniquePayments.reduce((sum, item) => sum + parseFloat(item.net_salary), 0);
  const totalBaseSalary = uniquePayments.reduce((sum, item) => sum + parseFloat(item.base_salary), 0);
  const totalCutMoney = uniquePayments.reduce((sum, item) => sum + parseFloat(item.cut_money), 0);
  const totalFoodAllowance = uniquePayments.reduce((sum, item) => sum + parseFloat(item.specialAllowance.food_money), 0);
  const totalOT = uniquePayments.reduce((sum, item) => sum + parseFloat(item.specialAllowance.ot), 0);
  const avgNetSalary = totalReceived / totalPayments;
  
 
  const latestPayment = uniquePayments[0]; 
  
  return {
    totalPayments,
    totalReceived,
    totalBaseSalary,
    totalCutMoney,
    totalFoodAllowance,
    totalOT,
    avgNetSalary,
    latestPayment
  };
});


const sortedPayments = computed(() => {
  const grouped = new Map();
  
 
  response.value.forEach(payment => {
    const dateKey = payment.payment_date;
    if (!grouped.has(dateKey) || 
        new Date(payment.createdAt) > new Date(grouped.get(dateKey).createdAt)) {
      grouped.set(dateKey, payment);
    }
  });
  
 
  return Array.from(grouped.values()).sort((a, b) => 
    new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
  );
});

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(amount) + ' ກີບ';
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

const formatDateTime = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

const getStatusColor = (cutMoney: string) => {
  const cut = parseFloat(cutMoney);
  if (cut === 0) return 'success';
  if (cut <= 100000) return 'warning';
  return 'error';
};

const getStatusText = (cutMoney: string) => {
  const cut = parseFloat(cutMoney);
  if (cut === 0) return 'ຈ່າຍເຕັມ';
  if (cut <= 100000) return 'ຕັດນ້ອຍ';
  return 'ຕັດຫຼາຍ';
};

onMounted(() => {
  salaryStore.getSalaryMy();
});
</script>

<template>
  <v-container class="salary-history-container">
    
    <div class="page-header">
      <div class="header-content">
        <v-icon name="mdi-account-cash" size="32" class="header-icon"></v-icon>
        <div>
          <h1 class="page-title">ປະຫວັດການຈ່າຍເງິນເດືອນ</h1>
          <p class="page-subtitle">ຂໍ້ມູນການຈ່າຍເງິນເດືອນສ່ວນຕົວຂອງເຈົ້າ</p>
        </div>
      </div>
    </div>

    <v-card class="employee-info-card mb-6" elevation="2">
      <v-card-text>
        <div class="employee-info" v-if="employeeInfo">
          <div class="employee-avatar">
            <v-icon name="mdi-account-circle" size="48" color="primary"></v-icon>
          </div>
          <div class="employee-details">
            <h2 class="employee-name">{{ employeeInfo.name }}</h2>
            <p class="employee-id">ລະຫັດພະນັກງານ: {{ employeeInfo.employee_id }}</p>
            <div class="status-badge">
              <v-chip color="success" size="small">
                <v-icon name="mdi-check-circle" size="16" class="mr-1"></v-icon>
                ພະນັກງານປົກກະຕິ
              </v-chip>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

   
    <div class="stats-grid mb-6" v-if="personalStats">
      <v-card class="stat-card" elevation="2">
        <v-card-text>
          <div class="stat-content">
            <v-icon name="mdi-calendar-check" size="24" class="stat-icon success"></v-icon>
            <div>
              <div class="stat-value">{{ personalStats.totalPayments }}</div>
              <div class="">ຄັ້ງທີ່ຈ່າຍ</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="stat-card" elevation="2">
        <v-card-text>
          <div class="stat-content">
            <v-icon name="mdi-cash-multiple" size="24" class="stat-icon primary"></v-icon>
            <div>
              <div class="stat-value">{{ formatMoney(personalStats.totalReceived) }}</div>
              <div class="stat-label">ລວມທີ່ໄດ້ຮັບ</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="stat-card" elevation="2">
        <v-card-text>
          <div class="stat-content">
            <v-icon name="mdi-trending-up" size="24" class="stat-icon info"></v-icon>
            <div>
              <div class="stat-value">{{ formatMoney(personalStats.avgNetSalary) }}</div>
              <div class="stat-label">ເຉລີ່ຍຕໍ່ເດືອນ</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="stat-card" elevation="2">
        <v-card-text>
          <div class="stat-content">
            <v-icon name="mdi-minus-circle" size="24" class="stat-icon warning"></v-icon>
            <div>
              <div class="stat-value">{{ formatMoney(personalStats.totalCutMoney) }}</div>
              <div class="stat-label">ລວມເງິນຕັດ</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- ລາຍການປະຫວັດ -->
    <v-card class="history-card" elevation="2">
      <v-card-title class="card-title">
        <v-icon name="mdi-history" class="mr-2"></v-icon>
        ປະຫວັດການຈ່າຍເງິນເດືອນ
        <v-spacer></v-spacer>
        <v-chip color="info" size="small">
          {{ response.length }} ລາຍການ
        </v-chip>
      </v-card-title>

      <v-card-text class="pa-0">
        <div v-if="sortedPayments.length === 0" class="empty-state">
          <v-icon name="mdi-file-document-outline" size="64" color="grey"></v-icon>
          <h3>ບໍ່ມີຂໍ້ມູນ</h3>
          <p>ຍັງບໍ່ມີປະຫວັດການຈ່າຍເງິນເດືອນ</p>
        </div>

        <div v-else class="payment-list">
          <div 
            v-for="(payment, index) in sortedPayments" 
            :key="payment.payroll_id"
            class="payment-item"
            :class="{ 'latest-payment': index === 0 }"
          >
            <div class="payment-header">
              <div class="payment-date">
                <v-icon name="mdi-calendar" size="16" class="mr-1"></v-icon>
                {{ formatDate(payment.payment_date) }}
              </div>
              <v-chip 
                :color="getStatusColor(payment.cut_money)" 
                size="small"
                class="status-chip"
              >
                {{ getStatusText(payment.cut_money) }}
              </v-chip>
            </div>

            <div class="payment-details">
              <div class="detail-row">
                <span class="detail-label">ເງິນເດືອນພື້ນຖານ:</span>
                <span class="detail-value">{{ formatMoney(parseFloat(payment.base_salary)) }}</span>
              </div>
              
              <div class="detail-row" v-if="parseFloat(payment.specialAllowance.food_money) > 0">
                <span class="detail-label">ເງິນອາຫານ:</span>
                <span class="detail-value text-success">+{{ formatMoney(parseFloat(payment.specialAllowance.food_money)) }}</span>
              </div>
              
              <div class="detail-row" v-if="parseFloat(payment.specialAllowance.ot) > 0">
                <span class="detail-label">ເງິນ OT:</span>
                <span class="detail-value text-success">+{{ formatMoney(parseFloat(payment.specialAllowance.ot)) }}</span>
              </div>
              
              <div class="detail-row" v-if="parseFloat(payment.cut_money) > 0">
                <span class="detail-label">ເງິນຕັດ:</span>
                <span class="detail-value text-error">-{{ formatMoney(parseFloat(payment.cut_money)) }}</span>
              </div>
              
              <div class="detail-row total-row">
                <span class="detail-label"><strong>ລວມທີ່ໄດ້ຮັບ:</strong></span>
                <span class="detail-value total-amount">{{ formatMoney(parseFloat(payment.net_salary)) }}</span>
              </div>
            </div>

            <div class="payment-footer">
              <small class="payment-time">
                <v-icon name="mdi-clock-outline" size="12" class="mr-1"></v-icon>
                ບັນທຶກເມື່ອ: {{ formatDateTime(payment.createdAt) }}
              </small>
              <small class="payment-id">ID: {{ payment.payroll_id }}</small>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.salary-history-container {
  max-width: 900px;
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

/* ຂໍ້ມູນພະນັກງານ */
.employee-info-card {
  border-radius: 12px;
  overflow: hidden;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.employee-avatar {
  flex-shrink: 0;
}

.employee-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: rgb(var(--v-theme-on-surface));
}

.employee-id {
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0 0 8px 0;
  font-size: 14px;
}

.status-badge {
  margin-top: 8px;
}

/* ສະຖິຕິ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: 12px;
  overflow: hidden;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  padding: 8px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
}

.stat-icon.success {
  color: rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.1);
}

.stat-icon.primary {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.stat-icon.info {
  color: rgb(var(--v-theme-info));
  background: rgba(var(--v-theme-info), 0.1);
}

.stat-icon.warning {
  color: rgb(var(--v-theme-warning));
  background: rgba(var(--v-theme-warning), 0.1);
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

/* ປະຫວັດການຈ່າຍ */
.history-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  font-weight: 600;
  padding: 16px 20px;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-state h3 {
  margin: 16px 0 8px 0;
}

.payment-list {
  padding: 0;
}

.payment-item {
  padding: 20px;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: background-color 0.2s ease;
}

.payment-item:hover {
  background: rgba(var(--v-theme-surface-variant), 0.1);
}

.payment-item:last-child {
  border-bottom: none;
}

.latest-payment {
  background: rgba(var(--v-theme-primary), 0.05);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.payment-date {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
}

.status-chip {
  font-size: 12px;
}

.payment-details {
  margin-bottom: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.detail-label {
  
  font-size: 14px;
}

.detail-value {
  font-weight: 500;
 
  font-size: 14px;
}

.total-row {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
  margin-top: 8px;
  padding-top: 8px;
}

.total-amount {
  font-size: 16px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.text-success {
  color: rgb(var(--v-theme-success)) !important;
}

.text-error {
  color: rgb(var(--v-theme-error)) !important;
}

.payment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 12px;
}

.payment-time, .payment-id {
  display: flex;
  align-items: center;
}


@media (max-width: 768px) {
  .salary-history-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .employee-info {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .payment-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .payment-footer {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}
</style>