<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";

// Type definitions
interface SpecialAllowance {
  food_money: string;
  ot: string;
  bonus_money?: string;
  tigh_money?: string;
}

interface Employee {
  name: string;
  employee_id: string;
}

interface PaymentData {
  payroll_id: string;
  payment_date: string;
  createdAt: string;
  net_salary: string;
  bonus_money: string;
  tigh_money: string;
  base_salary: string;
  cut_money: string;
  specialAllowance: SpecialAllowance;
  employee: Employee;
}

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

// Helper function for safe parsing
const safeParseFloat = (value: string | undefined | null): number => {
  return parseFloat(value || '0') || 0;
};

const sortedPayments = computed(() => {
  const grouped = new Map();
  
  response.value.forEach((payment: PaymentData) => {
    if (!payment.payment_date) return; // Skip if no payment date
    
    const dateKey = payment.payment_date;
    const existingPayment = grouped.get(dateKey);
    
    if (!existingPayment || 
        dayjs(payment.createdAt).isAfter(dayjs(existingPayment.createdAt))) {
      grouped.set(dateKey, payment);
    }
  });
  
  return Array.from(grouped.values()).sort((a: PaymentData, b: PaymentData) => 
    dayjs(b.payment_date).diff(dayjs(a.payment_date))
  );
});

const personalStats = computed(() => {
  const uniquePayments = sortedPayments.value;
  if (!uniquePayments?.length) return null;
  
  const totalPayments = uniquePayments.length;
  
  // Calculate total received by summing all components
  const totalReceived = uniquePayments.reduce((sum, item) => {
    const baseSalary = safeParseFloat(item.base_salary);
    const foodMoney = safeParseFloat(item.specialAllowance?.food_money);
    const otMoney = safeParseFloat(item.specialAllowance?.ot);
    const bonusMoney = safeParseFloat(item.specialAllowance?.bonus_money);
    const tighMoney = safeParseFloat(item.specialAllowance?.tigh_money);
    const cutMoney = safeParseFloat(item.cut_money);
    
    return sum + (baseSalary + foodMoney + otMoney + bonusMoney + tighMoney - cutMoney);
  }, 0);
  
  const bonus = uniquePayments.reduce((sum, item) => 
    sum + safeParseFloat(item.bonus_money), 0
  );
  const tigh_money = uniquePayments.reduce((sum, item) => 
    sum + safeParseFloat(item.tigh_money), 0
  );
  const totalBaseSalary = uniquePayments.reduce((sum, item) => 
    sum + safeParseFloat(item.base_salary), 0
  );
  const totalCutMoney = uniquePayments.reduce((sum, item) => 
    sum + safeParseFloat(item.cut_money), 0
  );
  const totalFoodAllowance = uniquePayments.reduce((sum, item) => 
    sum + safeParseFloat(item.specialAllowance?.food_money), 0
  );
  const totalOT = uniquePayments.reduce((sum, item) => 
    sum + safeParseFloat(item.specialAllowance?.ot), 0
  );
  const avgNetSalary = totalPayments > 0 ? totalReceived / totalPayments : 0;
  
  const latestPayment = uniquePayments[0]; 
  
  return {
    bonus,
    totalPayments,
    totalReceived,
    totalBaseSalary,
    totalCutMoney,
    totalFoodAllowance,
    totalOT,
    avgNetSalary,
    latestPayment,
    tigh_money
  };
});

const formatMoney = (amount: number): string => {
  if (isNaN(amount)) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(amount) + ' ກີບ';
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  return dayjs(dateString).format('DD/MM/YYYY');
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

const getStatusColor = (cutMoney: string): string => {
  const cut = safeParseFloat(cutMoney);
  if (cut === 0) return 'success';
  if (cut <= 100000) return 'warning';
  return 'error';
};

const getStatusText = (cutMoney: string): string => {
  const cut = safeParseFloat(cutMoney);
  if (cut === 0) return 'ຈ່າຍເຕັມ';
  if (cut <= 100000) return 'ຕັດນ້ອຍ';
  return 'ຕັດຫຼາຍ';
};

// Enhanced function to get allowance value safely
const getAllowanceValue = (payment: PaymentData, type: keyof SpecialAllowance): number => {
  return safeParseFloat(payment.specialAllowance?.[type]);
};

onMounted(async () => {
  try {
    await salaryStore.getSalaryMy();
  } catch (error) {
    console.error('Error loading salary data:', error);
    // Handle error appropriately - maybe show a toast notification
  }
});
</script>

<template>
  <v-container class="salary-history-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <v-icon name="mdi-account-cash" size="32" class="header-icon"></v-icon>
        <div>
          <h1 class="page-title">ປະຫວັດການຈ່າຍເງິນເດືອນ</h1>
          <p class="page-subtitle">ຂໍ້ມູນການຈ່າຍເງິນເດືອນສ່ວນຕົວຂອງເຈົ້າ</p>
        </div>
      </div>
    </div>

    <!-- Employee Info Card -->
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
        <div v-else class="employee-info-loading">
          <v-skeleton-loader type="avatar, text, text"></v-skeleton-loader>
        </div>
      </v-card-text>
    </v-card>

    <!-- Statistics Grid -->
    <div class="stats-grid mb-6" v-if="personalStats">
      <v-card class="stat-card" elevation="2">
        <v-card-text>
          <div class="stat-content">
            <v-icon name="mdi-calendar-check" size="24" class="stat-icon success"></v-icon>
            <div>
              <div class="stat-value">{{ personalStats.totalPayments }}</div>
              <div class="stat-label">ຄັ້ງທີ່ຈ່າຍ</div>
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

    <!-- Loading State for Stats -->
    <div v-else class="stats-grid mb-6">
      <v-card v-for="i in 4" :key="i" class="stat-card" elevation="2">
        <v-card-text>
          <v-skeleton-loader type="avatar, text, text"></v-skeleton-loader>
        </v-card-text>
      </v-card>
    </div>

    <!-- Payment History Card -->
    <v-card class="history-card" elevation="2">
      <v-card-title class="card-title">
        <v-icon name="mdi-history" class="mr-2"></v-icon>
        ປະຫວັດການຈ່າຍເງິນເດືອນ
        <v-spacer></v-spacer>
        <v-chip color="info" size="small">
          {{ sortedPayments.length }} ລາຍການ
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
                <span class="detail-value">{{ formatMoney(safeParseFloat(payment.base_salary)) }}</span>
              </div>
              
              <div class="detail-row" v-if="getAllowanceValue(payment, 'food_money') > 0">
                <span class="detail-label">ເງິນອາຫານ:</span>
                <span class="detail-value text-success">+{{ formatMoney(getAllowanceValue(payment, 'food_money')) }}</span>
              </div>
              
              <div class="detail-row" v-if="getAllowanceValue(payment, 'ot') > 0">
                <span class="detail-label">ເງິນ OT:</span>
                <span class="detail-value text-success">+{{ formatMoney(getAllowanceValue(payment, 'ot')) }}</span>
              </div>
              
              <div class="detail-row" v-if="getAllowanceValue(payment, 'bonus_money') > 0">
                <span class="detail-label">ເງິນໂບນັດ:</span>
                <span class="detail-value text-success">+{{ formatMoney(getAllowanceValue(payment, 'bonus_money')) }}</span>
              </div>
              
              <div class="detail-row" v-if="getAllowanceValue(payment, 'tigh_money') > 0">
                <span class="detail-label">ເງິນດຸໝັ່ນ:</span>
                <span class="detail-value text-success">+{{ formatMoney(getAllowanceValue(payment, 'tigh_money')) }}</span>
              </div>
              
              <div class="detail-row" v-if="safeParseFloat(payment.cut_money) > 0">
                <span class="detail-label">ເງິນຖືກຕັດ:</span>
                <span class="detail-value text-error">-{{ formatMoney(safeParseFloat(payment.cut_money)) }}</span>
              </div>
              
              <div class="detail-row total-row">
                <span class="detail-label"><strong>ລວມທີ່ໄດ້ຮັບ:</strong></span>
                <span class="detail-value total-amount">{{ formatMoney(
                  safeParseFloat(payment.base_salary) + 
                  getAllowanceValue(payment, 'food_money') + 
                  getAllowanceValue(payment, 'ot') + 
                  getAllowanceValue(payment, 'bonus_money') + 
                  getAllowanceValue(payment, 'tigh_money') - 
                  safeParseFloat(payment.cut_money)
                ) }}</span>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.page-subtitle {
  color: #666;
  margin: 4px 0 0 0;
}

.employee-info-card {
  border-radius: 12px;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.employee-details {
  flex: 1;
}

.employee-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.employee-id {
  color: #666;
  margin: 0 0 8px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: 12px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.history-card {
  border-radius: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #666;
}

.payment-list {
  padding: 16px;
}

.payment-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.payment-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.latest-payment {
  border-color: #2196f3;
  background-color: #f3f9ff;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.payment-date {
  font-weight: 600;
  display: flex;
  align-items: center;
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
  color: #666;
}

.detail-value {
  font-weight: 500;
}

.total-row {
  border-top: 1px solid #e0e0e0;
  margin-top: 8px;
  padding-top: 8px;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #2196f3;
}

.payment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.text-success {
  color: #4caf50 !important;
}

.text-error {
  color: #f44336 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .salary-history-container {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .payment-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>