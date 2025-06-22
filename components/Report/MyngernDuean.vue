<script lang="ts" setup>
import dayjs from "#build/dayjs.imports.mjs";

const report = useAttendanStore();
const title = "ລາຍງານການເຂົ້າຮ່ວມງານສ່ວນບຸກຄົນ";

const res = computed(() => {
  return report.respons_data_attendan || [];
});

// ຂໍ້ມູນພະນັກງານ (ເອົາຈາກລາຍການທຳອິດ)
const employeeInfo = computed(() => {
  if (!res.value.length) return null;
  return res.value[0].employee;
});

// ສະຖິຕິການເຂົ້າຮ່ວມງານສ່ວນບຸກຄົນ
const personalStatistics = computed(() => {
  if (!res.value.length) return null;
  
  const totalRecords = res.value.length;
  
  // ນັບຈຳນວນການມາທີ່ໄປສາຍ
  const lateRecords = res.value.filter(record => record.late === true).length;
  const onTimeRecords = totalRecords - lateRecords;
  
  // ນັບຈຳນວນຄົນທີ່ຍັງບໍ່ທັນ check out
  const notCheckedOut = res.value.filter(record => !record.check_out_time).length;
  const checkedOut = totalRecords - notCheckedOut;
  
  // ຄຳນວນເງິນປັບລວມ
  const totalPenalty = res.value.reduce((sum, record) => {
    return sum + parseFloat(record.penalty_amount || '0');
  }, 0);
  
  // ຄຳນວນຊ່ວງວັນທີ່
  const dates = res.value.map(record => dayjs(record.date));
  const firstDate = dates.reduce((min, current) => current.isBefore(min) ? current : min, dates[0]);
  const lastDate = dates.reduce((max, current) => current.isAfter(max) ? current : max, dates[0]);
  const daysCovered = lastDate.diff(firstDate, 'day') + 1;
  
  // ຄຳນວນຊົ່ວໂມງເຮັດວຽກລວມ
  const totalWorkingHours = res.value.reduce((sum, record) => {
    if (record.check_out_time && record.check_in_time) {
      const checkIn = dayjs(`${record.date} ${record.check_in_time}`);
      const checkOut = dayjs(`${record.date} ${record.check_out_time}`);
      const hours = checkOut.diff(checkIn, 'hour', true);
      return sum + hours;
    }
    return sum;
  }, 0);
  
  return {
    totalRecords,
    lateRecords,
    onTimeRecords,
    notCheckedOut,
    checkedOut,
    totalPenalty,
    latePercentage: totalRecords > 0 ? ((lateRecords / totalRecords) * 100).toFixed(1) : 0,
    onTimePercentage: totalRecords > 0 ? ((onTimeRecords / totalRecords) * 100).toFixed(1) : 0,
    daysCovered,
    totalWorkingHours: totalWorkingHours.toFixed(1),
    avgHoursPerDay: daysCovered > 0 ? (totalWorkingHours / daysCovered).toFixed(1) : 0,
    firstDate: firstDate.format('DD/MM/YYYY'),
    lastDate: lastDate.format('DD/MM/YYYY')
  };
});

// ຈັດກຸ່ມຂໍ້ມູນຕາມວັນທີ່
const groupedByDate = computed(() => {
  if (!res.value.length) return {};
  
  return res.value.reduce((groups, record) => {
    const date = dayjs(record.date).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, typeof res.value>);
});


const formatDate = (dateString: string | Date) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

const formatLaoDate = (dateString: string | Date) => {
  return dayjs(dateString).format('DD ເດືອນ MM ປີ YYYY');
};

const formatTime = (timeString: string | null) => {
  if (!timeString) return 'ຍັງບໍ່ໄດ້ອອກ';
  return timeString;
};

const formatDateTime = (dateString: string, timeString: string) => {
  return dayjs(`${dateString} ${timeString}`).format('DD/MM/YYYY HH:mm');
};


const calculateWorkingHours = (checkIn: string, checkOut: string | null, date: string) => {
  if (!checkOut) return 'ຍັງບໍ່ອອກ';
  
  const start = dayjs(`${date} ${checkIn}`);
  const end = dayjs(`${date} ${checkOut}`);
  const duration = end.diff(start, 'minute');
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  return `${hours}:${minutes.toString().padStart(2, '0')} ຊົ່ວໂມງ`;
};


const getStatusInLao = (late: boolean, checkOut: string | null) => {
  if (!checkOut) return 'ຍັງບໍ່ອອກ';
  return late ? 'ມາສາຍ' : 'ມາຕົງເວລາ';
};

const getGenderInLao = (gender: string) => {
  if (gender === 'Male' || gender === 'male' || gender === 'ຊາຍ') return 'ຊາຍ';
  if (gender === 'Female' || gender === 'female' || gender === 'ຍິງ') return 'ຍິງ';
  return gender;
};


const calculateAge = (birthdate: string | Date) => {
  return dayjs().diff(dayjs(birthdate), 'year');
};


const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0
  }).format(amount) + ' ກີບ';
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
  return `${dayjs().format('YYYY')}/PA/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
});

onMounted(() => {
  report.getDatamy();
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
          <strong>ວັນທີ່: {{ formatLaoDate(new Date()) }}</strong>
        </div>
      </div>

      <!-- ຫົວຂໍ້ເອກະສານ -->
      <div class="document-title">
        <h1>{{ title }}</h1>
        <p class="subtitle">ລາຍລະອຽດການເຂົ້າ-ອອກງານ ແລະ ການປະຕິບັດງານ</p>
      </div>

      <!-- ແນະນຳ -->
      <div class="introduction">
        <p>ຕາມການຮ້ອງຂໍຂອງພະນັກງານ ແລະ ການສັ່ງການຂອງຫົວໜ້າພະແນກບໍລິຫານງານບຸກຄະລາກອນ, ໄດ້ທຳການລວບລວມ ແລະ ສັງລວມຂໍ້ມູນການເຂົ້າຮ່ວມງານສ່ວນບຸກຄົນ ພ້ອມທັງການວິເຄາະຜົນການປະຕິບັດງານ ສະເພາະການນຳສະເໜີ ແລະ ເພື່ອເປັນຂໍ້ມູນປະກອບການພິຈາລະນາ.</p>
      </div>

      <!-- ຂໍ້ມູນພະນັກງານ -->
      <div class="employee-info-section" v-if="employeeInfo">
        <h2>ຂໍ້ມູນພື້ນຖານພະນັກງານ</h2>
        <div class="employee-details">
          <div class="employee-grid">
            <div class="info-item">
              <span class="label">ລະຫັດພະນັກງານ:</span>
              <span class="value">{{ employeeInfo.employee_id }}</span>
            </div>
            <div class="info-item">
              <span class="label">ຊື່ ແລະ ນາມສະກຸນ:</span>
              <span class="value">{{ employeeInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">ເພດ:</span>
              <span class="value">{{ getGenderInLao(employeeInfo.gender) }}</span>
            </div>
            <div class="info-item">
              <span class="label">ອາຍຸ:</span>
              <span class="value">{{ calculateAge(employeeInfo.birthdate) }} ປີ</span>
            </div>
            <div class="info-item">
              <span class="label">ທີ່ຢູ່:</span>
              <span class="value">{{ employeeInfo.address }}</span>
            </div>
            <div class="info-item">
              <span class="label">ເບີໂທ:</span>
              <span class="value">{{ employeeInfo.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">ຕຳແໜ່ງ ID:</span>
              <span class="value">{{ employeeInfo.position_id }}</span>
            </div>
            <div class="info-item">
              <span class="label">ກຳນົດການ ID:</span>
              <span class="value">{{ employeeInfo.schedule_id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ສະຫຼຸບສະຖິຕິ -->
      <div class="summary-section">
        <h2>ສະຫຼຸບຜົນການປະຕິບັດງານ</h2>
        <div class="summary-grid" v-if="personalStatistics">
          <div class="summary-item">
            <span class="label">ໄລຍະເວລາ:</span>
            <span class="value">{{ personalStatistics.firstDate }} - {{ personalStatistics.lastDate }}</span>
          </div>
          <div class="summary-item">
            <span class="label">ຈຳນວນມື້ທີ່ເຮັດວຽກ:</span>
            <span class="value">{{ personalStatistics.totalRecords }} ມື້</span>
          </div>
          <div class="summary-item">
            <span class="label">ມາຕົງເວລາ:</span>
            <span class="value">{{ personalStatistics.onTimeRecords }} ຄັ້ງ ({{ personalStatistics.onTimePercentage }}%)</span>
          </div>
          <div class="summary-item">
            <span class="label">ມາສາຍ:</span>
            <span class="value">{{ personalStatistics.lateRecords }} ຄັ້ງ ({{ personalStatistics.latePercentage }}%)</span>
          </div>
          <div class="summary-item">
            <span class="label">ຊົ່ວໂມງເຮັດວຽກລວມ:</span>
            <span class="value">{{ personalStatistics.totalWorkingHours }} ຊົ່ວໂມງ</span>
          </div>
          <div class="summary-item">
            <span class="label">ຄ່າສະເລ່ຍຕໍ່ມື້:</span>
            <span class="value">{{ personalStatistics.avgHoursPerDay }} ຊົ່ວໂມງ/ມື້</span>
          </div>
          <div class="summary-item">
            <span class="label">ເງິນປັບລວມ:</span>
            <span class="value penalty-highlight">{{ formatMoney(personalStatistics.totalPenalty) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">ຍັງບໍ່ check-out:</span>
            <span class="value">{{ personalStatistics.notCheckedOut }} ຄັ້ງ</span>
          </div>
        </div>
      </div>

      <!-- ຂໍ້ມູນລາຍລະອຽດ -->
      <div class="data-section">
        <h2>ລາຍລະອຽດການເຂົ້າ-ອອກງານ</h2>
        
        <table class="official-table">
          <thead>
            <tr>
              <th class="col-no">ລຳດັບ</th>
              <th class="col-date">ວັນທີ່</th>
              <th class="col-checkin">ເວລາເຂົ້າ</th>
              <th class="col-checkout">ເວລາອອກ</th>
              <th class="col-hours">ຊົ່ວໂມງເຮັດວຽກ</th>
              <th class="col-status">ສະຖານະ</th>
              <th class="col-penalty">ເງິນປັບ</th>
              <th class="col-note">ໝາຍເຫດ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in res" :key="record.attendance_id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="date-cell">{{ formatDate(record.date) }}</td>
              <td class="time-cell">{{ formatTime(record.check_in_time) }}</td>
              <td class="time-cell">{{ formatTime(record.check_out_time) }}</td>
              <td class="hours-cell">{{ calculateWorkingHours(record.check_in_time, record.check_out_time, record.date) }}</td>
              <td class="status-cell" :class="{ 
                'late-status': record.late, 
                'ontime-status': !record.late && record.check_out_time,
                'pending-status': !record.check_out_time 
              }">
                {{ getStatusInLao(record.late, record.check_out_time) }}
              </td>
              <td class="penalty-cell">
                {{ record.penalty_amount ? formatMoney(parseFloat(record.penalty_amount)) : '-' }}
              </td>
              <td class="note-cell">
                <span v-if="!record.check_out_time" class="warning-note">ຍັງບໍ່ໄດ້ອອກ</span>
                <span v-else-if="record.late" class="late-note">ມາສາຍ</span>
                <span v-else class="normal-note">ປົກກະຕິ</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ບົດສະຫຼຸບ -->
      <div class="conclusion">
        <p>ຈາກຂໍ້ມູນດັ່ງກ່າວຂ້າງເທິງນີ້, ສາມາດສະຫຼຸບໄດ້ວ່າພະນັກງານມີການປະຕິບັດງານ{{ personalStatistics?.onTimePercentage >= 80 ? 'ດີ' : 'ຍັງຕ້ອງປັບປຸງ' }}. ຂໍ້ມູນນີ້ໄດ້ຖືກລວບລວມ ແລະ ກວດສອບຄວາມຖືກຕ້ອງແລ້ວ ເຊິ່ງສາມາດນຳໃຊ້ເປັນຂໍ້ມູນອ້າງອີງ ສຳລັບການປະເມີນຜົນການເຮັດວຽກ ແລະ ການພັດທະນາຕົນເອງຕໍ່ໄປ.</p>
      </div>

      <!-- ລາຍເຊັນ -->
      <div class="signature-section">
        <v-row>
          <v-col cols="6">
            <div class="signature-left">
              <p><strong>ຜູ້ກຽມລາຍງານ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: ................................</p>
              <p>ຕຳແໜ່ງ: ນັກວິເຄາະຂໍ້ມູນ</p>
              <p>ວັນທີ່: {{ formatDate(new Date()) }}</p>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="signature-right">
              <p><strong>ພະນັກງານຮັບຮອງ</strong></p>
              <div class="signature-space"></div>
              <p>ຊື່ ແລະ ນາມສະກຸນ: {{ employeeInfo?.name || '................................' }}</p>
              <p>ລະຫັດພະນັກງານ: {{ employeeInfo?.employee_id || '........' }}</p>
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
          <p>ລາຍງານສ່ວນບຸກຄົນ - ສ້າງໂດຍລະບົບ ວັນທີ່ {{ formatDate(new Date()) }} {{ dayjs().format('HH:mm') }}</p>
          <p>ສຳນັກງານບໍລິຫານງານບຸກຄະລາກອນ - ລະບົບຕິດຕາມການເຂົ້າຮ່ວມງານ</p>
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

/* ຂໍ້ມູນພະນັກງານ */
.employee-info-section {
  margin-bottom: 15px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  border-left: 4px solid #8B4513;
}

.employee-info-section h2 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #000;
}

.employee-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 11px;
  border-bottom: 1px dotted #ccc;
}

.info-item .label {
  font-weight: 500;
  color: #555;
}

.info-item .value {
  font-weight: bold;
  color: #000;
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
  flex-direction: column;
  padding: 6px 8px;
  background: #f9f9f9;
  border-left: 2px solid #8B4513;
  font-size: 10px;
  border-radius: 3px;
}

.summary-item .label {
  font-weight: normal;
  color: #666;
  margin-bottom: 2px;
}

.summary-item .value {
  font-weight: bold;
  color: #8B4513;
}

.penalty-highlight {
  color: #d32f2f !important;
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

.date-cell {
  text-align: center;
  font-size: 8px;
  font-weight: 500;
}

.time-cell {
  text-align: center;
  font-size: 8px;
  font-weight: 500;
}

.hours-cell {
  text-align: center;
  font-size: 8px;
  font-weight: 500;
}

.status-cell {
  text-align: center;
  font-size: 8px;
  font-weight: bold;
}

.late-status {
  color: #d32f2f;
  background-color: #ffebee;
}

.ontime-status {
  color: #388e3c;
  background-color: #e8f5e8;
}

.pending-status {
  color: #f57c00;
  background-color: #fff3e0;
}

.penalty-cell {
  text-align: right;
  font-size: 8px;
  font-weight: 500;
  color: #d32f2f;
}

.note-cell {
  text-align: center;
  font-size: 7px;
}

.warning-note {
  color: #f57c00;
  font-weight: bold;
}

.late-note {
  color: #d32f2f;
  font-weight: bold;
}

.normal-note {
  color: #388e3c;
  font-weight: normal;
}

/* ຄວາມກວ້າງຄໍລັມ */
.col-no { width: 8%; }
.col-date { width: 12%; }
.col-checkin { width: 10%; }
.col-checkout { width: 10%; }
.col-hours { width: 12%; }
.col-status { width: 12%; }
.col-penalty { width: 12%; }
.col-note { width: 12%; }

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
  
  .employee-grid {
    grid-template-columns: 1fr;
  }
  
  .qr-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .official-table {
    font-size: 8px;
  }
}
</style>