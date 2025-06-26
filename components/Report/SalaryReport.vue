<script lang="ts" setup>
import dayjs from "#build/dayjs.imports.mjs";

const salaryStore = otStore();
const title = "ລາຍງານຂໍ້ມູນເງິນເດືອນພະນັກງານ";

const response = computed(() => {
  return salaryStore.response_data_salary?.data || [];
});

const statistics = computed(() => {
  if (!response.value.length) return null;
  
  const totalEmployees = response.value.length;
  const totalBaseSalary = response.value.reduce((sum, item) => sum + parseFloat(item.base_salary), 0);
  const totalCutMoney = response.value.reduce((sum, item) => sum + parseFloat(item.cut_money), 0);
  const totalNetSalary = response.value.reduce((sum, item) => sum + parseFloat(item.net_salary), 0);
  const totalFoodAllowance = response.value.reduce((sum, item) => sum + parseFloat(item.specialAllowance.food_money), 0);
  const totalOT = response.value.reduce((sum, item) => sum + parseFloat(item.specialAllowance.ot), 0);
  const avgBaseSalary = totalBaseSalary / totalEmployees;
  const avgNetSalary = totalNetSalary / totalEmployees;
  
  return {
    totalEmployees,
    totalBaseSalary,
    totalCutMoney,
    totalNetSalary,
    totalFoodAllowance,
    totalOT,
    avgBaseSalary,
    avgNetSalary
  };
});

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(amount) + ' ກີບ';
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

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

const documentNumber = computed(() => {
  return `${dayjs().format('YYYY')}/HR/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
});

onMounted(() => {
  salaryStore.getSalary();
});
</script>

<template>
  <v-container>
  <div class="">
    
    <div class="">
      
        <img src="../../assets/img/Logo.png" alt="" width="50" >
      
      
      <div class=" text-center d-flex flex-column \">
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

   
    <div class="document-info">
      <div class="doc-number">
        <strong>ເລກທີ່: {{ documentNumber }}</strong>
      </div>
      <div class="doc-date">
        <strong>ວັນທີ່: {{ dayjs().format('DD ເດືອນ MM ປີ YYYY') }}</strong>
      </div>
    </div>

  
    <div class="document-title">
      <h1>{{ title }}</h1>
      <p class="subtitle">ການສະຫຼຸບຂໍ້ມູນເງິນເດືອນ ແລະ ສິດທິຜົນປະໂຫຍດພະນັກງານ</p>
    </div>

  
    <div class="introduction">
      <p>ຕາມການສັ່ງການຂອງຫົວໜ້າພະແນກບໍລິຫານງານບຸກຄະລາກອນ, ໄດ້ທຳການລວບລວມ ແລະ ສັງລວມຂໍ້ມູນການຈ່າຍເງິນເດືອນພະນັກງານ ລວມທັງເງິນເດືອນພື້ນຖານ, ເງິນຕັດ, ເງິນສຸດທິ ແລະ ເງິນຊ່ວຍເຫຼືອພິເສດຕ່າງໆ ສະເພາະການນຳສະເໜີ ແລະ ເພື່ອເປັນຂໍ້ມູນປະກອບການພິຈາລະນາ.</p>
    </div>

    
    <div class="summary-section">
      <h2>ສະຫຼຸບຂໍ້ມູນໂດຍຫຍໍ້</h2>
      <div class="summary-grid" v-if="statistics">
        <div class="summary-item">
          <span class="label">ຈຳນວນລາຍການທັງໝົດ:</span>
          <span class="value">{{ statistics.totalEmployees }} ລາຍການ</span>
        </div>
        <div class="summary-item">
          <span class="label">ເງິນເດືອນພື້ນຖານລວມ:</span>
          <span class="value">{{ formatMoney(statistics.totalBaseSalary) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">ເງິນຕັດລວມ:</span>
          <span class="value">{{ formatMoney(statistics.totalCutMoney) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">ເງິນເດືອນສຸດທິລວມ:</span>
          <span class="value">{{ formatMoney(statistics.totalNetSalary) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">ເງິນອາຫານລວມ:</span>
          <span class="value">{{ formatMoney(statistics.totalFoodAllowance) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">ເງິນ OT ລວມ:</span>
          <span class="value">{{ formatMoney(statistics.totalOT) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">ເງິນເດືອນພື້ນຖານເຉລີ່ຍ:</span>
          <span class="value">{{ formatMoney(statistics.avgBaseSalary) }}</span>
        </div>
      </div>
    </div>

   
    <div class="data-section">
      <h2>ລາຍລະອຽດຂໍ້ມູນເງິນເດືອນພະນັກງານ</h2>
      
      <table class="official-table">
        <thead>
          <tr>
            <th class="col-no">ລຳດັບ</th>
            <th class="col-employee">ຊື່ພະນັກງານ</th>
            <th class="col-base-salary">ເງິນເດືອນພື້ນຖານ<br>(ກີບ)</th>
            <th class="col-food">ເງິນອາຫານ<br>(ກີບ)</th>
            <th class="col-ot">ເງິນ OT<br>(ກີບ)</th>
            <th class="col-cut">ເງິນຕັດ<br>(ກີບ)</th>
            <th class="col-net">ເງິນເດືອນສຸດທິ<br>(ກີບ)</th>
            <th class="col-date">ວັນທີ່ຈ່າຍ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in response" :key="item.payroll_id">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="employee-cell">
              {{ item.employee.name }}<br>
              <small class="employee-id">ID: {{ item.employee_id }}</small>
            </td>
            <td class="number-cell">{{ formatMoney(parseFloat(item.base_salary)) }}</td>
            <td class="number-cell">{{ formatMoney(parseFloat(item.specialAllowance.food_money)) }}</td>
            <td class="number-cell">{{ formatMoney(parseFloat(item.specialAllowance.ot)) }}</td>
            <td class="number-cell">{{ formatMoney(parseFloat(item.cut_money)) }}</td>
            <td class="number-cell">{{ formatMoney(parseFloat(item.net_salary)) }}</td>
            <td class="date-cell">{{ formatDate(item.payment_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <div class="conclusion">
      <p>ຂໍ້ມູນດັ່ງກ່າວຂ້າງເທິງນີ້ ໄດ້ຖືກລວບລວມ ແລະ ກວດສອບຄວາມຖືກຕ້ອງແລ້ວ ເຊິ່ງສາມາດນຳໃຊ້ເປັນຂໍ້ມູນອ້າງອີງ ສຳລັບການວາງແຜນ ແລະ ການພັດທະນາລະບົບການບໍລິຫານງານບຸກຄະລາກອນ ແລະ ການຈ່າຍເງິນເດືອນຕໍ່ໄປ.</p>
    </div>

  
    <div class="">
      <div class="">
        <v-col cols="12">
          <v-row>
            <v-col cols="6" md="6"> 
              <div class="signature-left">
                <p><strong>ຜູ້ກຽມລາຍງານ</strong></p>
                <div class="signature-space"></div>
                <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
                <p>ຕຳແໜ່ງ: ........................................</p>
                <p>ວັນທີ່: {{ dayjs().format('DD/MM/YYYY') }}</p>
              </div>
            </v-col>
            <v-col cols="6" md="6"> 
              <div class="signature-right">
                <p><strong>ຜູ້ອະນຸມັດ</strong></p>
                <div class="signature-space"></div>
                <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
                <p>ຕຳແໜ່ງ: ຫົວໜ້າພະແນກບຸກຄະລາກອນ</p>
                <p>ວັນທີ່: ........../........../.........</p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </div>
    </div>

    
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
        <p>ເອກະສານນີ້ຖືກສ້າງໂດຍລະບົບຄອມພິວເຕີ ວັນທີ່ {{ dayjs().format('DD/MM/YYYY HH:mm') }}</p>
        <p>ສຳນັກງານບໍລິຫານງານບຸກຄະລາກອນ - ກະຊວງແຮງງານ ແລະ ສະຫວັດດີການສັງຄົມ</p>
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

.seal-circle {
  width: 60px;
  height: 60px;
  border: 2px solid #8B4513;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #FFD700, #FFA500);
}

.seal-inner {
  width: 45px;
  height: 45px;
  border: 1px solid #8B4513;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD700;
}

.seal-symbol {
  font-size: 18px;
  color: #8B4513;
  font-weight: bold;
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
}

.print-btn:hover {
  background: #45a049;
}

/* Document Info */
.document-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}

/* Document Title */
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

/* Introduction */
.introduction {
  margin-bottom: 15px;
  text-align: justify;
  text-indent: 20px;
  font-size: 12px;
}

/* Summary Section */
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
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: #f9f9f9;
  border-left: 2px solid #8B4513;
  font-size: 11px;
}

.summary-item .label {
  font-weight: normal;
}

.summary-item .value {
  font-weight: bold;
  color: #8B4513;
}

/* Data Section */
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

/* Official Table */
.official-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 10px;
}

.official-table th {
  background: #f0f0f0;
  border: 1px solid #000;
  padding: 6px 4px;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  line-height: 1.2;
}

.official-table td {
  border: 1px solid #000;
  padding: 4px 3px;
  vertical-align: middle;
  line-height: 1.2;
}

.text-center {
  text-align: center;
  font-weight: bold;
}

.employee-cell {
  font-weight: 500;
}

.employee-id {
  color: #666;
  font-size: 12px;
}

.number-cell {
  text-align: right;
  font-weight: 500;
}

.date-cell {
  text-align: center;
  font-size: 13px;
}

/* Column Widths */
.col-no { width: 6%; }
.col-employee { width: 18%; }
.col-base-salary { width: 14%; }
.col-food { width: 10%; }
.col-ot { width: 10%; }
.col-cut { width: 10%; }
.col-net { width: 14%; }
.col-date { width: 18%; }

/* Conclusion */
.conclusion {
  margin-bottom: 15px;
  text-align: justify;
  text-indent: 20px;
  font-size: 12px;
}

/* Signature Section */
.signature-section {
  margin-bottom: 15px;
  margin-top: auto;
}

.signature-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.signature-left,
.signature-right {
  width: 45%;
  font-size: 11px;
}

.signature-space {
  height: 30px;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
}

/* QR Section */
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
    font-size: 9px !important;
  }
  
  .official-table th,
  .official-table td {
    padding: 3px 2px !important;
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
    grid-template-columns: 1fr;
  }
  
  .signature-row {
    flex-direction: column;
    gap: 30px;
  }
  
  .signature-left,
  .signature-right {
    width: 100%;
  }
  
  .qr-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .official-table {
    font-size: 12px;
  }
}
</style>