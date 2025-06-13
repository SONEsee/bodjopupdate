<!-- pages/attendance.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          ລະບົບລົງເວລາເຂົ້າ-ອອກວຽກ
        </h1>
        <p class="text-gray-600">ສະແກນລາຍນິ້ວມື ຫຼື ປ້ອນລະຫັດພະນັກງານ</p>
      </div>

      <!-- Main Card -->
      <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <!-- Current Time Display -->
        <div class="text-center mb-8">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6">
            <div class="flex items-center justify-center mb-2">
              <Icon name="mdi:clock-outline" class="w-6 h-6 mr-2" />
              <span class="text-sm font-medium">{{ formatDate(currentTime) }}</span>
            </div>
            <div class="text-3xl font-bold">{{ formatTime(currentTime) }}</div>
          </div>
        </div>

        <!-- Fingerprint Scanner Animation -->
        <div class="text-center mb-6">
          <div 
            :class="[
              'w-32 h-32 mx-auto rounded-full border-4 border-dashed border-blue-300 flex items-center justify-center mb-4 transition-all duration-300',
              isScanning ? 'border-green-400 bg-green-50 animate-pulse' : 'hover:border-blue-400 hover:bg-blue-50'
            ]"
            @click="simulateFingerprint"
          >
            <Icon 
              name="mdi:fingerprint" 
              :class="[
                'w-16 h-16 transition-colors duration-300',
                isScanning ? 'text-green-500' : 'text-blue-400'
              ]" 
            />
          </div>
          <p class="text-sm text-gray-600">
            ກົດເພື່ອສະແກນລາຍນິ້ວມື ຫຼື ປ້ອນລະຫັດຂ້າງລຸ່ມ
          </p>
        </div>

        <!-- Employee ID Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ລະຫັດພະນັກງານ
          </label>
          <div class="relative">
            <Icon name="mdi:account" class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              v-model="employeeId"
              type="text"
              placeholder="ປ້ອນລະຫັດພະນັກງານ"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleAttendance"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <button
            @click="handleAttendance('check_in')"
            :disabled="!employeeId || isScanning"
            class="flex items-center justify-center py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="mdi:login" class="w-5 h-5 mr-2" />
            ເຂົ້າວຽກ
          </button>
          <button
            @click="handleAttendance('check_out')"
            :disabled="!employeeId || isScanning"
            class="flex items-center justify-center py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="mdi:logout" class="w-5 h-5 mr-2" />
            ອອກວຽກ
          </button>
        </div>

        <!-- Message Display -->
        <div v-if="message" :class="[
          'p-4 rounded-lg mb-6 flex items-center',
          messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]">
          <Icon 
            :name="messageType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" 
            class="w-5 h-5 mr-2" 
          />
          {{ message }}
        </div>

        <!-- Today's Attendance -->
        <div v-if="todayAttendance.length > 0" class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">ການລົງເວລາມື້ນີ້</h3>
          <div class="space-y-3">
            <div 
              v-for="record in todayAttendance" 
              :key="record.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Icon name="mdi:account" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-800">ພະນັກງານ #{{ record.employee_id }}</p>
                  <p class="text-sm text-gray-600">{{ record.date }}</p>
                </div>
              </div>
              <div class="text-right">
                <p v-if="record.check_in_time" class="text-sm text-green-600">
                  ເຂົ້າ: {{ record.check_in_time }}
                </p>
                <p v-if="record.check_out_time" class="text-sm text-red-600">
                  ອອກ: {{ record.check_out_time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AttendanceRecord {
  id: number;
  employee_id: number;
  check_in_time: string | null;
  check_out_time: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: AttendanceRecord;
}

// Reactive data
const employeeId = ref<string>('');
const currentTime = ref<Date>(new Date());
const message = ref<string>('');
const messageType = ref<'success' | 'error'>('success');
const isScanning = ref<boolean>(false);
const todayAttendance = ref<AttendanceRecord[]>([]);

// Update current time
onMounted(() => {
  const timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);

  // Load today's attendance
  loadTodayAttendance();

  onUnmounted(() => {
    clearInterval(timer);
  });
});

// Format time
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('lo-LA', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
};

// Format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Simulate fingerprint scanning
const simulateFingerprint = async (): Promise<void> => {
  if (!employeeId.value) {
    showMessage('ກະລຸນາປ້ອນລະຫັດພະນັກງານກ່ອນ', 'error');
    return;
  }

  isScanning.value = true;
  showMessage('ກຳລັງສະແກນລາຍນິ້ວມື...', 'success');

  // Simulate scanning delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate fingerprint recognition
  const recognized = Math.random() > 0.1; // 90% success rate

  if (recognized) {
    showMessage('ລາຍນິ້ວມືຖືກຕ້ອງ! ກະລຸນາເລືອກເຂົ້າ ຫຼື ອອກວຽກ', 'success');
  } else {
    showMessage('ບໍ່ສາມາດຈຳແນກລາຍນິ້ວມືໄດ້', 'error');
  }

  isScanning.value = false;
};

// Handle attendance
const handleAttendance = async (type?: 'check_in' | 'check_out'): Promise<void> => {
  if (!employeeId.value) {
    showMessage('ກະລຸນາປ້ອນລະຫັດພະນັກງານ', 'error');
    return;
  }

  try {
    const now = new Date();
    const attendanceData = {
      employee_id: parseInt(employeeId.value),
      date: now.toISOString().split('T')[0],
      [type === 'check_in' ? 'check_in_time' : 'check_out_time']: now.toTimeString().split(' ')[0],
    };

    // Simulate API call
    const response = await simulateApiCall(attendanceData, type);

    if (response.success) {
      showMessage(
        type === 'check_in' 
          ? `ລົງເວລາເຂົ້າວຽກສຳເລັດ: ${formatTime(now)}`
          : `ລົງເວລາອອກວຽກສຳເລັດ: ${formatTime(now)}`,
        'success'
      );
      
      // Add to today's attendance
      if (response.data) {
        const existingIndex = todayAttendance.value.findIndex(
          record => record.employee_id === response.data!.employee_id
        );
        
        if (existingIndex >= 0) {
          todayAttendance.value[existingIndex] = response.data;
        } else {
          todayAttendance.value.unshift(response.data);
        }
      }

      // Clear employee ID after successful attendance
      employeeId.value = '';
    } else {
      showMessage(response.message, 'error');
    }
  } catch (error) {
    showMessage('ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່', 'error');
  }
};

// Simulate API call
const simulateApiCall = async (data: any, type?: string): Promise<ApiResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate API response
  const mockResponse: AttendanceRecord = {
    id: Date.now(),
    employee_id: data.employee_id,
    check_in_time: type === 'check_in' ? data.check_in_time : null,
    check_out_time: type === 'check_out' ? data.check_out_time : null,
    date: data.date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'ບັນທຶກສຳເລັດ',
    data: mockResponse
  };
};

// Load today's attendance
const loadTodayAttendance = async (): Promise<void> => {
  try {
    // Simulate loading existing attendance records
    // In real app, this would be: const { data } = await $fetch('/api/auth/attendances');
    const mockData: AttendanceRecord[] = [
      {
        id: 1,
        employee_id: 8,
        check_in_time: "08:00:00",
        check_out_time: "17:00:00",
        date: "2025-06-12",
        createdAt: "2025-06-12T08:00:00.000Z",
        updatedAt: "2025-06-12T17:00:00.000Z"
      }
    ];
    
    todayAttendance.value = mockData;
  } catch (error) {
    console.error('Error loading attendance:', error);
  }
};

// Show message
const showMessage = (msg: string, type: 'success' | 'error'): void => {
  message.value = msg;
  messageType.value = type;
  
  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

// SEO
useSeoMeta({
  title: 'ລະບົບລົງເວລາເຂົ້າອອກວຽກ',
  description: 'ລະບົບສະແກນລາຍນິ້ວມືສຳລັບລົງເວລາເຂົ້າອອກວຽກ'
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>