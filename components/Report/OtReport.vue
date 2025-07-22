<script lang="ts" setup>
import dayjs from "#build/dayjs.imports.mjs";

const otStor = otStore();
const title = "ລາຍງານເງິນພັກເສີມ ແລະ ຄ່າຕອບແທນພິເສດ";

const res = computed(() => {
  return otStor.response_data_ot || [];
});


const allowanceStatistics = computed(() => {
  if (!res.value.length) return null;
  
  const totalEmployees = res.value.length;
  
 
  const totalBonus = res.value.reduce((sum, item) => sum + parseFloat(item.bonus_money || '0'), 0);
  const totalTigh = res.value.reduce((sum, item) => sum + parseFloat(item.tigh_money || '0'), 0);
  const totalFood = res.value.reduce((sum, item) => sum + parseFloat(item.food_money || '0'), 0);
  const totalOt = res.value.reduce((sum, item) => sum + parseFloat(item.ot || '0'), 0);
 
  const grandTotal = totalBonus + totalTigh + totalFood + totalOt;
  
 
  const avgBonus = totalEmployees > 0 ? totalBonus / totalEmployees : 0;
  const avgTigh = totalEmployees > 0 ? totalTigh / totalEmployees : 0;
  const avgFood = totalEmployees > 0 ? totalFood / totalEmployees : 0;
  const avgOt = totalEmployees > 0 ? totalOt / totalEmployees : 0;
  const avgTotal = totalEmployees > 0 ? grandTotal / totalEmployees : 0;
  
 
  const bonusRecipients = res.value.filter(item => parseFloat(item.bonus_money || '0') > 0).length;
  const tighRecipients = res.value.filter(item => parseFloat(item.tigh_money || '0') > 0).length;
  const foodRecipients = res.value.filter(item => parseFloat(item.food_money || '0') > 0).length;
  const otRecipients = res.value.filter(item => parseFloat(item.ot || '0') > 0).length;
  
  
  const maleCount = res.value.filter(item => 
    item.employee.gender === 'ຊາຍ' || item.employee.gender === 'Male' || item.employee.gender === 'male'
  ).length;
  const femaleCount = totalEmployees - maleCount;
  
  return {
    totalEmployees,
    maleCount,
    femaleCount,
    totalBonus,
    totalTigh,
    totalFood,
    totalOt,
    grandTotal,
    avgBonus,
    avgTigh,
    avgFood,
    avgOt,
    avgTotal,
    bonusRecipients,
    tighRecipients,
    foodRecipients,
    otRecipients
  };
});


const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(amount) + ' ກີບ';
};


const formatDate = (dateString: string | Date) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

const formatLaoDate = (dateString: string | Date) => {
  const months = [
    '', 'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
    'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
  ];
  const date = dayjs(dateString);
  return `${date.format('DD')} ເດືອນ${months[date.month() + 1]} ປີ ${date.format('YYYY')}`;
};


const getGenderInLao = (gender: string) => {
  if (gender === 'Male' || gender === 'male' || gender === 'ຊາຍ') return 'ຊາຍ';
  if (gender === 'Female' || gender === 'female' || gender === 'ຍິງ') return 'ຍິງ';
  return gender;
};


const calculateAge = (birthdate: string | Date) => {
  return dayjs().diff(dayjs(birthdate), 'year');
};


const calculateTotalPerPerson = (item: any) => {
  return parseFloat(item.bonus_money || '0') + 
         parseFloat(item.tigh_money || '0') + 
         parseFloat(item.food_money || '0') + 
         parseFloat(item.ot || '0');
};


const hasAnyAllowance = (item: any) => {
  return calculateTotalPerPerson(item) > 0;
};


const sortedData = computed(() => {
  return [...res.value].sort((a, b) => {
    const totalA = calculateTotalPerPerson(a);
    const totalB = calculateTotalPerPerson(b);
    return totalB - totalA; 
  });
});


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
  return `${dayjs().format('YYYY')}/SA/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
});

onMounted(() => {
  otStor.getOt();
});
</script>

<template>
  <v-container>
    <div class="">
      
     
      <div class="">
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
        <p class="subtitle">ການສະຫຼຸບເງິນໂບນັດ, ເງິນຕິ໊ບ, ເງິນອາຫານ ແລະ ເງິນ OT</p>
      </div>

      <!-- ແນະນຳ -->
      <div class="introduction">
        <p>ຕາມການສັ່ງການຂອງຫົວໜ້າພະແນກບໍລິຫານງານບຸກຄະລາກອນ, ໄດ້ທຳການລວບລວມ ແລະ ສັງລວມຂໍ້ມູນກ່ຽວກັບເງິນພັກເສີມ ແລະ ຄ່າຕອບແທນພິເສດ ປະກອບດ້ວຍ ເງິນໂບນັດ, ເງິນຕິ໊ບ, ເງິນອາຫານ ແລະ ເງິນເຮັດງານເກີນເວລາ (OT) ຂອງພະນັກງານທັງໝົດ ສະເພາະການນຳສະເໜີ ແລະ ເພື່ອເປັນຂໍ້ມູນປະກອບການພິຈາລະນາ.</p>
      </div>

      <!-- ສະຫຼຸບສະຖິຕິ -->
      <div class="summary-section">
        <h2>ສະຫຼຸບຂໍ້ມູນສະຖິຕິລວມ</h2>
        <div class="summary-grid" v-if="allowanceStatistics">
          <div class="summary-item total-item">
            <span class="label">ຈຳນວນພະນັກງານທັງໝົດ:</span>
            <span class="value">{{ allowanceStatistics.totalEmployees }} ຄົນ</span>
          </div>
          <div class="summary-item gender-item">
            <span class="label">ພະນັກງານເພດຊາຍ:</span>
            <span class="value">{{ allowanceStatistics.maleCount }} ຄົນ</span>
          </div>
          <div class="summary-item gender-item">
            <span class="label">ພະນັກງານເພດຍິງ:</span>
            <span class="value">{{ allowanceStatistics.femaleCount }} ຄົນ</span>
          </div>
          <div class="summary-item"></div>
          
          <div class="summary-item bonus-item">
            <span class="label">ເງິນໂບນັດລວມ:</span>
            <span class="value">{{ formatMoney(allowanceStatistics.totalBonus) }}</span>
          </div>
          <div class="summary-item tigh-item">
            <span class="label">ເງິນຕິ໊ບລວມ:</span>
            <span class="value">{{ formatMoney(allowanceStatistics.totalTigh) }}</span>
          </div>
          <div class="summary-item food-item">
            <span class="label">ເງິນອາຫານລວມ:</span>
            <span class="value">{{ formatMoney(allowanceStatistics.totalFood) }}</span>
          </div>
          <div class="summary-item ot-item">
            <span class="label">ເງິນ OT ລວມ:</span>
            <span class="value">{{ formatMoney(allowanceStatistics.totalOt) }}</span>
          </div>
          
          <div class="summary-item grand-total">
            <span class="label">ເງິນລວມທັງໝົດ:</span>
            <span class="value">{{ formatMoney(allowanceStatistics.grandTotal) }}</span>
          </div>
          <div class="summary-item avg-item">
            <span class="label">ຄ່າສະເລ່ຍຕໍ່ຄົນ:</span>
            <span class="value">{{ formatMoney(allowanceStatistics.avgTotal) }}</span>
          </div>
          <div class="summary-item recipients">
            <span class="label">ໄດ້ຮັບໂບນັດ:</span>
            <span class="value">{{ allowanceStatistics.bonusRecipients }} ຄົນ</span>
          </div>
          <div class="summary-item recipients">
            <span class="label">ໄດ້ຮັບ OT:</span>
            <span class="value">{{ allowanceStatistics.otRecipients }} ຄົນ</span>
          </div>
        </div>
      </div>

      <!-- ຂໍ້ມູນລາຍລະອຽດ -->
      <div class="data-section">
        <h2>ລາຍລະອຽດເງິນພັກເສີມແຕ່ລະຄົນ</h2>
        
        <table class="official-table">
          <thead>
            <tr>
              <th class="col-no">ລຳດັບ</th>
              <th class="col-emp-id">ID ພນງ</th>
              <th class="col-name">ຊື່ພະນັກງານ</th>
              <th class="col-gender">ເພດ</th>
              <th class="col-age">ອາຍຸ</th>
              <th class="col-bonus">ເງິນໂບນັດ<br>(ກີບ)</th>
              <th class="col-tigh">ເງິນຕິ໊ບ<br>(ກີບ)</th>
              <th class="col-food">ເງິນອາຫານ<br>(ກີບ)</th>
              <th class="col-ot">ເງິນ OT<br>(ກີບ)</th>
              <th class="col-total">ລວມທັງໝົດ<br>(ກີບ)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in sortedData" :key="item.special_allowance_id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.employee_id }}</td>
              <td class="name-cell">{{ item.employee.name }}</td>
              <td class="text-center">{{ getGenderInLao(item.employee.gender) }}</td>
              <td class="text-center">{{ calculateAge(item.employee.birthdate) }}</td>
              <td class="money-cell bonus-cell">
                {{ parseFloat(item.bonus_money) > 0 ? formatMoney(parseFloat(item.bonus_money)) : '-' }}
              </td>
              <td class="money-cell tigh-cell">
                {{ parseFloat(item.tigh_money) > 0 ? formatMoney(parseFloat(item.tigh_money)) : '-' }}
              </td>
              <td class="money-cell food-cell">
                {{ parseFloat(item.food_money) > 0 ? formatMoney(parseFloat(item.food_money)) : '-' }}
              </td>
              <td class="money-cell ot-cell">
                {{ parseFloat(item.ot) > 0 ? formatMoney(parseFloat(item.ot)) : '-' }}
              </td>
              <td class="money-cell total-cell" :class="{ 'highlight-total': hasAnyAllowance(item) }">
                {{ formatMoney(calculateTotalPerPerson(item)) }}
              </td>
            </tr>
            
            <!-- ແຖວລວມ -->
            <tr class="summary-row" v-if="allowanceStatistics">
              <td colspan="5" class="summary-label"><strong>ລວມທັງໝົດ</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(allowanceStatistics.totalBonus) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(allowanceStatistics.totalTigh) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(allowanceStatistics.totalFood) }}</strong></td>
              <td class="money-cell summary-cell"><strong>{{ formatMoney(allowanceStatistics.totalOt) }}</strong></td>
              <td class="money-cell grand-summary-cell"><strong>{{ formatMoney(allowanceStatistics.grandTotal) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ບົດສະຫຼຸບ -->
      <div class="conclusion">
        <p>ຈາກຂໍ້ມູນດັ່ງກ່າວຂ້າງເທິງນີ້, ສາມາດສະຫຼຸບໄດ້ວ່າບໍລິສັດໄດ້ຈ່າຍເງິນພັກເສີມ ແລະ ຄ່າຕອບແທນພິເສດລວມທັງໝົດ {{ formatMoney(allowanceStatistics?.grandTotal || 0) }} ໃຫ້ແກ່ພະນັກງານ {{ allowanceStatistics?.totalEmployees || 0 }} ຄົນ. ຂໍ້ມູນນີ້ໄດ້ຖືກລວບລວມ ແລະ ກວດສອບຄວາມຖືກຕ້ອງແລ້ວ ເຊິ່ງສາມາດນຳໃຊ້ເປັນຂໍ້ມູນອ້າງອີງ ສຳລັບການຄິດໄລ່ເງິນເດືອນ ແລະ ການວາງແຜນງົບປະມານຕໍ່ໄປ.</p>
      </div>

      <!-- ລາຍເຊັນ -->
      <div class="signature-section">
        <v-row>
          <v-col cols="6">
            <div class="signature-left">
              <p><strong>ຜູ້ກຽມລາຍງານ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
              <p>ຕຳແໜ່ງ: ນັກບັນຊີ</p>
              <p>ວັນທີ່: {{ formatDate(new Date()) }}</p>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="signature-right">
              <p><strong>ຜູ້ອະນຸມັດ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
              <p>ຕຳແໜ່ງ: ຫົວໜ້າພະແນກການເງິນ</p>
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
          <p>ລາຍງານການເງິນ - ສ້າງໂດຍລະບົບ ວັນທີ່ {{ formatDate(new Date()) }} {{ dayjs().format('HH:mm') }}</p>
          <p>ສຳນັກງານບໍລິຫານງານບຸກຄະລາກອນ - ພະແນກການເງິນ</p>
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
.total-item, .gender-item {
  border-left-color: #2196F3;
}

.bonus-item {
  border-left-color: #4CAF50;
}

.tigh-item {
  border-left-color: #FF9800;
}

.food-item {
  border-left-color: #9C27B0;
}

.ot-item {
  border-left-color: #F44336;
}

.grand-total {
  border-left-color: #000;
  background: #e8f5e8;
  font-weight: bold;
}

.grand-total .value {
  color: #000;
  font-size: 11px;
}

.avg-item, .recipients {
  border-left-color: #607D8B;
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
  font-size: 9px;
}

.official-table th {
  background: #f0f0f0;
  border: 1px solid #000;
  padding: 4px 2px;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  line-height: 1.2;
}

.official-table td {
  border: 1px solid #000;
  padding: 3px 2px;
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
  font-size: 9px;
}

.money-cell {
  text-align: right;
  font-size: 8px;
  font-weight: 500;
}

.bonus-cell {
  background-color: #e8f5e8;
}

.tigh-cell {
  background-color: #fff3e0;
}

.food-cell {
  background-color: #f3e5f5;
}

.ot-cell {
  background-color: #ffebee;
}

.total-cell {
  background-color: #e3f2fd;
  font-weight: bold;
}

.highlight-total {
  color: #1976d2;
  font-weight: bold !important;
}

/* ແຖວສະຫຼຸບ */
.summary-row {
  background-color: #f5f5f5;
  font-weight: bold;
}

.summary-label {
  text-align: center;
  font-size: 10px;
  color: #000;
}

.summary-cell {
  background-color: #e0e0e0;
  color: #000;
  font-size: 9px;
}

.grand-summary-cell {
  background-color: #1976d2;
  color: white;
  font-size: 9px;
}

/* ຄວາມກວ້າງຄໍລັມ */
.col-no { width: 8%; }
.col-emp-id { width: 8%; }
.col-name { width: 16%; }
.col-gender { width: 8%; }
.col-age { width: 8%; }
.col-bonus { width: 12%; }
.col-tigh { width: 12%; }
.col-food { width: 12%; }
.col-ot { width: 12%; }
.col-total { width: 14%; }

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
.signature-right {
  font-size: 11px;
}

.signature-space {
  height: 30px;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
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
    font-size: 8px !important;
  }
  
  .official-table th,
  .official-table td {
    padding: 2px 1px !important;
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
    font-size: 8px;
  }
  
  .money-cell {
    font-size: 7px;
  }
}
</style>