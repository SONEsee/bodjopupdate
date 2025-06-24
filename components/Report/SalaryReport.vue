<script lang="ts" setup>
import dayjs from "#build/dayjs.imports.mjs";

const salaryStore = otStore();
const title = "ລາຍງານເງິນເດືອນປະຈຳເດືອນ";

const res = computed(() => {
  return salaryStore.response_data_salary?.data || [];
});
console.log(res.value);
// ສະຖິຕິຂໍ້ມູນເງິນເດືອນ
const payrollStatistics = computed(() => {
  if (!res.value.length) return null;
  
  const totalEmployees = res.value.length;
  
  // ຄຳນວນຈຳນວນເງິນລວມ
  const totalBaseSalary = res.value.reduce((sum, item) => sum + parseFloat(item.base_salary || '0'), 0);
  const totalCutMoney = res.value.reduce((sum, item) => sum + parseFloat(item.cut_money || '0'), 0);
  const totalNetSalary = res.value.reduce((sum, item) => sum + parseFloat(item.net_salary || '0'), 0);
  
  // ຄຳນວນເງິນພັກເສີມລວມ
  const totalBonus = res.value.reduce((sum, item) => sum + parseFloat(item.specialAllowance?.bonus_money || '0'), 0);
  const totalTigh = res.value.reduce((sum, item) => sum + parseFloat(item.specialAllowance?.tigh_money || '0'), 0);
  const totalFood = res.value.reduce((sum, item) => sum + parseFloat(item.specialAllowance?.food_money || '0'), 0);
  const totalOt = res.value.reduce((sum, item) => sum + parseFloat(item.specialAllowance?.ot || '0'), 0);
  const totalAllowances = totalBonus + totalTigh + totalFood + totalOt;
  
  // ຄຳນວນເງິນເດືອນລວມທັງໝົດ (ຮວມເງິນພັກເສີມ)
  const grandTotalGross = totalBaseSalary + totalAllowances;
  const grandTotalNet = totalNetSalary + totalAllowances;
  
  // ຄຳນວນຄ່າສະເລ່ຍ
  const avgBaseSalary = totalEmployees > 0 ? totalBaseSalary / totalEmployees : 0;
  const avgNetSalary = totalEmployees > 0 ? totalNetSalary / totalEmployees : 0;
  const avgCutMoney = totalEmployees > 0 ? totalCutMoney / totalEmployees : 0;
  const avgAllowances = totalEmployees > 0 ? totalAllowances / totalEmployees : 0;
  
  // ນັບຈຳນວນຄົນທີ່ຖືກຕັດເງິນ
  const employeesWithDeductions = res.value.filter(item => parseFloat(item.cut_money || '0') > 0).length;
  const employeesWithAllowances = res.value.filter(item => {
    const allowance = item.specialAllowance;
    return parseFloat(allowance?.bonus_money || '0') > 0 ||
           parseFloat(allowance?.tigh_money || '0') > 0 ||
           parseFloat(allowance?.food_money || '0') > 0 ||
           parseFloat(allowance?.ot || '0') > 0;
  }).length;
  
  // ການວິເຄາະອັດຕາ
  const deductionRate = totalBaseSalary > 0 ? ((totalCutMoney / totalBaseSalary) * 100).toFixed(2) : 0;
  const allowanceRate = totalBaseSalary > 0 ? ((totalAllowances / totalBaseSalary) * 100).toFixed(2) : 0;
  
  return {
    totalEmployees,
    totalBaseSalary,
    totalCutMoney,
    totalNetSalary,
    totalAllowances,
    totalBonus,
    totalTigh,
    totalFood,
    totalOt,
    grandTotalGross,
    grandTotalNet,
    avgBaseSalary,
    avgNetSalary,
    avgCutMoney,
    avgAllowances,
    employeesWithDeductions,
    employeesWithAllowances,
    deductionRate,
    allowanceRate
  };
});

// ຟັງຊັນຈັດການເງິນ
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(amount) + ' ກີບ';
};

// ຟັງຊັນຈັດການວັນທີ່
const formatDate = (dateString: string | Date) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

// ຄຳນວນເງິນພັກເສີມລວມຕໍ່ຄົນ
const calculateTotalAllowances = (specialAllowance: any) => {
  if (!specialAllowance) return 0;
  return parseFloat(specialAllowance.bonus_money || '0') + 
         parseFloat(specialAllowance.tigh_money || '0') + 
         parseFloat(specialAllowance.food_money || '0') + 
         parseFloat(specialAllowance.ot || '0');
};

// ຄຳນວນເງິນເດືອນລວມສຸດທ້າຍ (ເງິນເດືອນສຸດທິ + ເງິນພັກເສີມ)
const calculateFinalSalary = (item: any) => {
  return parseFloat(item.net_salary || '0') + calculateTotalAllowances(item.specialAllowance);
};

// ການຈັດລຽງຂໍ້ມູນ
const sortedData = computed(() => {
  return [...res.value].sort((a, b) => {
    const finalA = calculateFinalSalary(a);
    const finalB = calculateFinalSalary(b);
    return finalB - finalA; // ຈັດລຽງຈາກສູງໄປຕ່ຳ
  });
});

// ສ້າງເດືອນປີຈາກວັນທີ່ຈ່າຍເງິນ
const paymentPeriod = computed(() => {
  if (!res.value.length) return '';
  const firstPayment = res.value[0].payment_date;
  const months = [
    '', 'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
    'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
  ];
  const date = dayjs(firstPayment);
  return `ເດືອນ${months[date.month() + 1]} ປີ ${date.format('YYYY')}`;
});

// ຟັງຊັນພິມ
const exportToPDF = () => {
  const sidebar = document.querySelector('.sidebar');
  const nav = document.querySelector('.navigation');
  const header = document.querySelector('.header');
  
  if (sidebar) sidebar.style.display = 'none';
  if (nav) nav.style.display = 'none';
  if (header) header.style.display = 'none';
  
  window.print();
  
  setTimeout(() => {
    if (sidebar) sidebar.style.display = '';
    if (nav) nav.style.display = '';
    if (header) header.style.display = '';
  }, 1000);
};

// ເລກທີ່ເອກະສານ
const documentNumber = computed(() => {
  return `${dayjs().format('YYYY')}/PAY/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
});

onMounted(() => {
  salaryStore.getSalary();
});
</script>

<template>
  <v-container>
    <div class="official-report">
      
      <!-- ຫົວເອກະສານ -->
      <div class="official-header">
        <div class="government-seal">
          <img src="../../assets/img/Logo.png" alt="" width="50">
        </div>
        
        <div class="header-text">
          <h1 class="country-name">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</h1>
          <h2 class="motto">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ</h2>
          <div class="separator-line"></div>
          <h3 class="ministry">ບໍລິສັດ ວີວີທີເອັສ ໂຊກໄຊຈະເລີນ ກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</h3>
          <h4 class="department">ພະແນກບໍລິຫານງານບຸກຄະລາກອນ</h4>
        </div>

        <div class="document-actions">
          <button @click="exportToPDF" class="print-btn">
            ພິມເອກະສານ
          </button>
        </div>
      </div>

      <!-- ຂໍ້ມູນເອກະສານ -->
      <div class="document-info">
        <div class="doc-number">
          <strong>ເລກທີ່: {{ documentNumber }}</strong>
        </div>
        <div class="doc-date">
          <strong>ວັນທີ່: {{ dayjs().format('DD') }} ເດືອນ{{ ['', 'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ', 'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'][dayjs().month() + 1] }} ປີ {{ dayjs().format('YYYY') }}</strong>
        </div>
      </div>

      <!-- ຫົວຂໍ້ເອກະສານ -->
      <div class="document-title">
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ paymentPeriod }} - ການຈ່າຍເງິນເດືອນ ແລະ ຄ່າຕອບແທນ</p>
      </div>

      <!-- ແນະນຳ -->
      <div class="introduction">
        <p>ຕາມການສັ່ງການຂອງຫົວໜ້າພະແນກບໍລິຫານງານບຸກຄະລາກອນ, ໄດ້ທຳການລວບລວມ ແລະ ສັງລວມຂໍ້ມູນການຈ່າຍເງິນເດືອນປະຈຳເດືອນ {{ paymentPeriod }} ປະກອບດ້ວຍ ເງິນເດືອນພື້ນຖານ, ເງິນພັກເສີມຕ່າງໆ, ການຫັກເງິນ ແລະ ເງິນເດືອນສຸດທິທີ່ພະນັກງານໄດ້ຮັບຈິງ ສະເພາະການນຳສະເໜີ ແລະ ເພື່ອເປັນຂໍ້ມູນປະກອບການພິຈາລະນາ.</p>
      </div>

      <!-- ສະຫຼຸບສະຖິຕິ -->
      <div class="summary-section">
        <h2>ສະຫຼຸບຂໍ້ມູນການຈ່າຍເງິນເດືອນ {{ paymentPeriod }}</h2>
        <div class="summary-grid" v-if="payrollStatistics">
          <div class="summary-item total-emp">
            <span class="label">ຈຳນວນພະນັກງານທັງໝົດ:</span>
            <span class="value">{{ payrollStatistics.totalEmployees }} ຄົນ</span>
          </div>
          <div class="summary-item base-salary">
            <span class="label">ເງິນເດືອນພື້ນຖານລວມ:</span>
            <span class="value">{{ formatMoney(payrollStatistics.totalBaseSalary) }}</span>
          </div>
          <div class="summary-item allowances">
            <span class="label">ເງິນພັກເສີມລວມ:</span>
            <span class="value">{{ formatMoney(payrollStatistics.totalAllowances) }}</span>
          </div>
          <div class="summary-item gross-total">
            <span class="label">ເງິນເດືອນລວມ (ກ່ອນຫັກ):</span>
            <span class="value">{{ formatMoney(payrollStatistics.grandTotalGross) }}</span>
          </div>
          
          <div class="summary-item deductions">
            <span class="label">ເງິນຫັກລວມ:</span>
            <span class="value">{{ formatMoney(payrollStatistics.totalCutMoney) }}</span>
          </div>
          <div class="summary-item net-total">
            <span class="label">ເງິນເດືອນສຸດທິລວມ:</span>
            <span class="value">{{ formatMoney(payrollStatistics.totalNetSalary) }}</span>
          </div>
          <div class="summary-item final-total">
            <span class="label">ເງິນຈ່າຍຈິງລວມ:</span>
            <span class="value">{{ formatMoney(payrollStatistics.grandTotalNet) }}</span>
          </div>
          <div class="summary-item avg-salary">
            <span class="label">ຄ່າສະເລ່ຍຕໍ່ຄົນ:</span>
            <span class="value">{{ formatMoney(payrollStatistics.avgNetSalary + payrollStatistics.avgAllowances) }}</span>
          </div>
          
          <div class="summary-item rate-info">
            <span class="label">ອັດຕາການຫັກເງິນ:</span>
            <span class="value">{{ payrollStatistics.deductionRate }}%</span>
          </div>
          <div class="summary-item rate-info">
            <span class="label">ອັດຕາເງິນພັກເສີມ:</span>
            <span class="value">{{ payrollStatistics.allowanceRate }}%</span>
          </div>
          <div class="summary-item count-info">
            <span class="label">ຖືກຫັກເງິນ:</span>
            <span class="value">{{ payrollStatistics.employeesWithDeductions }} ຄົນ</span>
          </div>
          <div class="summary-item count-info">
            <span class="label">ໄດ້ຮັບເງິນພັກເສີມ:</span>
            <span class="value">{{ payrollStatistics.employeesWithAllowances }} ຄົນ</span>
          </div>
        </div>
      </div>

      <!-- ຂໍ້ມູນລາຍລະອຽດ -->
      <div class="data-section">
        <h2>ລາຍລະອຽດການຈ່າຍເງິນເດືອນແຕ່ລະຄົນ</h2>
        
        <table class="official-table">
          <thead>
            <tr>
              <th class="col-no">ລຳດັບ</th>
              <th class="col-emp-id">ID</th>
              <th class="col-name">ຊື່ພະນັກງານ</th>
              <th class="col-base">ເງິນເດືອນພື້ນຖານ<br>(ກີບ)</th>
              <th class="col-allowance">ເງິນພັກເສີມ<br>(ກີບ)</th>
              <th class="col-gross">ລວມ (ກ່ອນຫັກ)<br>(ກີບ)</th>
              <th class="col-cut">ເງິນຫັກ<br>(ກີບ)</th>
              <th class="col-net">ເງິນເດືອນສຸດທິ<br>(ກີບ)</th>
              <th class="col-final">ໄດ້ຮັບຈິງ<br>(ກີບ)</th>
              <th class="col-date">ວັນທີ່ຈ່າຍ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in sortedData" :key="item.payroll_id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.employee_id }}</td>
              <td class="name-cell">{{ item.employee.name }}</td>
              <td class="money-cell base-cell">{{ formatMoney(parseFloat(item.base_salary)) }}</td>
              <td class="money-cell allowance-cell">
                {{ formatMoney(calculateTotalAllowances(item.specialAllowance)) }}
              </td>
              <td class="money-cell gross-cell">
                {{ formatMoney(parseFloat(item.base_salary) + calculateTotalAllowances(item.specialAllowance)) }}
              </td>
              <td class="money-cell cut-cell">
                {{ parseFloat(item.cut_money) > 0 ? formatMoney(parseFloat(item.cut_money)) : '-' }}
              </td>
              <td class="money-cell net-cell">{{ formatMoney(parseFloat(item.net_salary)) }}</td>
              <td class="money-cell final-cell">{{ formatMoney(calculateFinalSalary(item)) }}</td>
              <td class="date-cell">{{ formatDate(item.payment_date) }}</td>
            </tr>
            
            <!-- ແຖວລວມ -->
            <tr class="summary-row" v-if="payrollStatistics">
              <td colspan="3" class="summary-label"><strong>ລວມທັງໝົດ</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(payrollStatistics.totalBaseSalary) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(payrollStatistics.totalAllowances) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(payrollStatistics.grandTotalGross) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(payrollStatistics.totalCutMoney) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(payrollStatistics.totalNetSalary) }}</strong></td>
              <td class="money-cell grand-summary-cell"><strong>{{ formatMoney(payrollStatistics.grandTotalNet) }}</strong></td>
              <td class="summary-cell">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ການວິເຄາະ -->
      <div class="analysis-section" v-if="payrollStatistics">
        <h2>ການວິເຄາະຂໍ້ມູນ</h2>
        <div class="analysis-content">
          <div class="analysis-item">
            <strong>ການວິເຄາະງົບປະມານ:</strong>
            <p>ບໍລິສັດໄດ້ຈ່າຍເງິນເດືອນລວມທັງໝົດ {{ formatMoney(payrollStatistics.grandTotalNet) }} ໃນເດືອນນີ້, ເຊິ່ງປະກອບດ້ວຍ ເງິນເດືອນພື້ນຖານ {{ formatMoney(payrollStatistics.totalBaseSalary) }} ({{ (100 - parseFloat(payrollStatistics.allowanceRate)).toFixed(1) }}%) ແລະ ເງິນພັກເສີມ {{ formatMoney(payrollStatistics.totalAllowances) }} ({{ payrollStatistics.allowanceRate }}%).</p>
          </div>
          <div class="analysis-item">
            <strong>ຄ່າສະເລ່ຍເງິນເດືອນ:</strong>
            <p>ພະນັກງານໄດ້ຮັບເງິນເດືອນສະເລ່ຍ {{ formatMoney(payrollStatistics.avgNetSalary + payrollStatistics.avgAllowances) }} ຕໍ່ຄົນ, ເຊິ່ງສາມາດຖືວ່າເປັນອັດຕາທີ່{{ payrollStatistics.avgNetSalary + payrollStatistics.avgAllowances >= 3000000 ? 'ດີ' : 'ມາດຕະຖານ' }}ສຳລັບຕະຫຼາດແຮງງານ.</p>
          </div>
          <div class="analysis-item">
            <strong>ການຫັກເງິນ:</strong>
            <p>ມີພະນັກງານ {{ payrollStatistics.employeesWithDeductions }} ຄົນ ({{ ((payrollStatistics.employeesWithDeductions / payrollStatistics.totalEmployees) * 100).toFixed(1) }}%) ທີ່ຖືກຫັກເງິນ, ລວມເປັນເງິນ {{ formatMoney(payrollStatistics.totalCutMoney) }}.</p>
          </div>
        </div>
      </div>

      <!-- ບົດສະຫຼຸບ -->
      <div class="conclusion">
        <p>ຈາກຂໍ້ມູນການຈ່າຍເງິນເດືອນ{{ paymentPeriod }}ດັ່ງກ່າວຂ້າງເທິງນີ້, ບໍລິສັດໄດ້ຈ່າຍເງິນທັງໝົດ {{ formatMoney(payrollStatistics?.grandTotalNet || 0) }} ໃຫ້ແກ່ພະນັກງານ {{ payrollStatistics?.totalEmployees || 0 }} ຄົນ. ຂໍ້ມູນນີ້ໄດ້ຖືກລວບລວມ ແລະ ກວດສອບຄວາມຖືກຕ້ອງແລ້ວ ເຊິ່ງສາມາດນຳໃຊ້ເປັນຂໍ້ມູນອ້າງອີງ ສຳລັບການບັນຊີ, ການວາງແຜນງົບປະມານ ແລະ ການບໍລິຫານງານດ້ານການເງິນຕໍ່ໄປ.</p>
      </div>

      <!-- ລາຍເຊັນ -->
      <div class="signature-section">
        <v-row>
          <v-col cols="4">
            <div class="signature-left">
              <p><strong>ຜູ້ກຽມລາຍງານ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
              <p>ຕຳແໜ່ງ: ນັກບັນຊີ</p>
              <p>ວັນທີ່: {{ formatDate(new Date()) }}</p>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="signature-center">
              <p><strong>ຜູ້ກວດສອບ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
              <p>ຕຳແໜ່ງ: ຫົວໜ້າພະແນກການເງິນ</p>
              <p>ວັນທີ່: ........../........../.........</p>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="signature-right">
              <p><strong>ຜູ້ອະນຸມັດ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
              <p>ຕຳແໜ່ງ: ຜູ້ອຳນວຍການບໍລິຫານ</p>
              <p>ວັນທີ່: ........../........../.........</p>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- QR ແລະ Footer -->
      <div class="qr-section">
        <div class="qr-placeholder">
          <div class="qr-code">
            <div class="qr-pattern">
              <div class="qr-dots"></div>
            </div>
          </div>
          <p class="qr-text">ສະແກນເພື່ອກວດສອບຄວາມຖືກຕ້ອງ</p>
        </div>
        <div class="document-footer">
          <p>ລາຍງານເງິນເດືອນ{{ paymentPeriod }} - ສ້າງໂດຍລະບົບ ວັນທີ່ {{ formatDate(new Date()) }} {{ dayjs().format('HH:mm') }}</p>
          <p>ສຳນັກງານບໍລິຫານງານບຸກຄະລາກອນ - ພະແນກການເງິນ ແລະ ບັນຊີ</p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.official-report {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 10mm 15mm 15mm 15mm;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', serif;
  line-height: 1.4;
  color: #000;
  position: relative;
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* ຫົວເອກະສານ */
.official-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  position: relative;
  min-height: 80px;
}

.government-seal {
  margin-right: 12px;
  flex-shrink: 0;
}

.header-text {
  flex: 1;
  text-align: center;
}

.country-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #000;
}

.motto {
  font-size: 11px;
  font-weight: normal;
  margin: 2px 0;
  color: #333;
  font-style: italic;
}

.separator-line {
  height: 1px;
  background: linear-gradient(to right, transparent, #8B4513, transparent);
  margin: 6px 0;
}

.ministry {
  font-size: 13px;
  font-weight: bold;
  margin: 6px 0 2px 0;
  color: #000;
}

.department {
  font-size: 11px;
  font-weight: normal;
  margin: 0;
  color: #333;
}

.document-actions {
  position: absolute;
  top: 0;
  right: 0;
}

.print-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
}

.print-btn:hover {
  background: #45a049;
}

/* ຂໍ້ມູນເອກະສານ */
.document-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}

/* ຫົວຂໍ້ເອກະສານ */
.document-title {
  text-align: center;
  margin-bottom: 15px;
}

.document-title h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #000;
  text-decoration: underline;
}

.subtitle {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* ແນະນຳ */
.introduction {
  margin-bottom: 15px;
  text-align: justify;
  text-indent: 20px;
  font-size: 12px;
}

/* ສ່ວນສະຫຼຸບ */
.summary-section {
  margin-bottom: 15px;
}

.summary-section h2 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #000;
  border-bottom: 1px solid #8B4513;
  padding-bottom: 2px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: #f9f9f9;
  border-left: 2px solid #8B4513;
  font-size: 10px;
  border-radius: 3px;
}

.summary-item .label {
  font-weight: normal;
}

.summary-item .value {
  font-weight: bold;
  color: #8B4513;
}

/* ປະເພດສີແຕກຕ່າງ */
.total-emp {
  border-left-color: #2196F3;
}

.base-salary {
  border-left-color: #4CAF50;
}

.allowances {
  border-left-color: #FF9800;
}

.gross-total, .final-total {
  border-left-color: #9C27B0;
}

.deductions {
  border-left-color: #F44336;
}

.net-total {
  border-left-color: #00BCD4;
}

.avg-salary {
  border-left-color: #607D8B;
}

.rate-info, .count-info {
  border-left-color: #795548;
}

/* ການວິເຄາະ */
.analysis-section {
  margin-bottom: 15px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 5px;
  border-left: 4px solid #007bff;
}

.analysis-section h2 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-item {
  font-size: 11px;
  line-height: 1.5;
}

.analysis-item strong {
  color: #007bff;
  display: block;
  margin-bottom: 3px;
}

/* ສ່ວນຂໍ້ມູນ */
.data-section {
  margin-bottom: 15px;
  flex: 1;
}

.data-section h2 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #000;
  border-bottom: 1px solid #8B4513;
  padding-bottom: 2px;
}

/* ຕາຕະລາງທາງການ */
.official-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 8px;
}

.official-table th {
  background: #f0f0f0;
  border: 1px solid #000;
  padding: 3px 2px;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  line-height: 1.2;
}

.official-table td {
  border: 1px solid #000;
  padding: 2px 1px;
  vertical-align: middle;
  line-height: 1.2;
}

.text-center {
  text-align: center;
  font-weight: 500;
}

.name-cell {
  font-weight: 500;
  text-align: left;
  font-size: 8px;
}

.money-cell {
  text-align: right;
  font-size: 7px;
  font-weight: 500;
}

.date-cell {
  text-align: center;
  font-size: 7px;
}

/* สีพื้นหลังแต่ละคอลัมน์ */
.base-cell {
  background-color: #e8f5e8;
}

.allowance-cell {
  background-color: #fff3e0;
}

.gross-cell {
  background-color: #f3e5f5;
}

.cut-cell {
  background-color: #ffebee;
}

.net-cell {
  background-color: #e3f2fd;
}

.final-cell {
  background-color: #e8f5e8;
  font-weight: bold;
  color: #1976d2;
}

/* ແຖວສະຫຼຸບ */
.summary-row {
  background-color: #f5f5f5;
  font-weight: bold;
}

.summary-label {
  text-align: center;
  font-size: 9px;
  color: #000;
}

.summary-cell {
  background-color: #e0e0e0;
  color: #000;
  font-size: 8px;
}

.grand-summary-cell {
  background-color: #1976d2;
  color: white;
  font-size: 8px;
}

/* ຄວາມກວ້າງຄໍລັມ */
.col-no { width: 6%; }
.col-emp-id { width: 7%; }
.col-name { width: 15%; }
.col-base { width: 12%; }
.col-allowance { width: 10%; }
.col-gross { width: 12%; }
.col-cut { width: 10%; }
.col-net { width: 12%; }
.col-final { width: 12%; }
.col-date { width: 8%; }

/* ບົດສະຫຼຸບ */
.conclusion {
  margin-bottom: 15px;
  text-align: justify;
  text-indent: 20px;
  font-size: 12px;
}

/* ສ່ວນລາຍເຊັນ */
.signature-section {
  margin-bottom: 15px;
  margin-top: auto;
}

.signature-left,
.signature-center,
.signature-right {
  font-size: 10px;
  text-align: center;
}

.signature-space {
  height: 25px;
  border-bottom: 1px solid #ccc;
  margin: 8px 0;
}

/* ສ່ວນ QR */
.qr-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  margin-top: auto;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code {
  width: 50px;
  height: 50px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin-bottom: 5px;
}

.qr-pattern {
  width: 40px;
  height: 40px;
  background: 
    repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px),
    repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px);
}

.qr-text {
  font-size: 8px;
  text-align: center;
  margin: 0;
}

.document-footer {
  text-align: right;
  font-size: 8px;
  color: #666;
  line-height: 1.2;
}

/* Print Styles */
@media print {
  .official-report {
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 10mm 15mm 15mm 15mm !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
  }
  
  .print-btn {
    display: none !important;
  }
  
  .official-table {
    font-size: 7px !important;
  }
  
  .official-table th,
  .official-table td {
    padding: 1px !important;
  }
  
  .signature-section {
    page-break-inside: avoid;
    margin-top: auto !important;
  }
  
  .qr-section {
    page-break-inside: avoid;
    margin-top: auto !important;
  }
  
  .data-section {
    flex: 1 !important;
  }

  body * {
    visibility: hidden;
  }
  
  .official-report,
  .official-report * {
    visibility: visible;
  }
  
  .official-report {
    position: absolute;
    left: 0;
    top: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .official-header {
    flex-direction: column;
    text-align: center;
  }
  
  .government-seal {
    margin: 0 auto 20px auto;
  }
  
  .document-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .qr-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .official-table {
    font-size: 7px;
  }
  
  .money-cell {
    font-size: 6px;
  }
  
  .analysis-section {
    padding: 8px;
  }
}
</style>