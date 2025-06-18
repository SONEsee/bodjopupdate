<template>
  <div class="payroll-container">
    <!-- Header Section -->
    <div class="payroll-header">
      <div class="header-content">
        <v-icon size="48" color="primary" class="mb-2">mdi-calculator-variant</v-icon>
        <h1 class="payroll-title">ຄຳນວນເງິນເດືອນ</h1>
        <p class="payroll-subtitle">ເລືອກພະນັກງານທີ່ຕ້ອງການຄຳນວນເງິນເດືອນ ແລະ ປ້ອນໂບນັດ, ເງິນຕິດ</p>
      </div>
    </div>

    <!-- Controls Section -->
    <v-card class="controls-card mb-6" elevation="2" rounded="xl">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="d-flex align-center gap-4">
              <v-btn
                color="primary"
                @click="refreshEmployees"
                :loading="loadingEmployees"
                rounded="lg"
              >
                <v-icon start>mdi-refresh</v-icon>
                ໂຫລດຂໍ້ມູນ
              </v-btn>
              
              <v-btn
                color="success"
                @click="selectAllEmployees"
                :disabled="employeeList.length === 0"
                rounded="lg"
              >
                <v-icon start>mdi-select-all</v-icon>
                ເລືອກທັງໝົດ
              </v-btn>
              
              <v-btn
                color="warning"
                @click="clearAllSelections"
                :disabled="selectedEmployees.length === 0"
                rounded="lg"
              >
                <v-icon start>mdi-select-off</v-icon>
                ຍົກເລີກທັງໝົດ
              </v-btn>
            </div>
          </v-col>
          
          <v-col cols="12" md="6" class="text-md-right">
            <v-chip class="mr-2" color="info">
              ທັງໝົດ: {{ employeeList.length }} ຄົນ
            </v-chip>
            <v-chip color="primary">
              ເລືອກແລ້ວ: {{ selectedEmployees.length }} ຄົນ
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Main Content -->
    <v-row>
      <!-- Employee List Panel -->
      <v-col cols="12" lg="8">
        <v-card class="employee-panel" elevation="4" rounded="xl">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>ລາຍຊື່ພະນັກງານ</span>
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="ຄົ້ນຫາພະນັກງານ..."
              hide-details
              density="compact"
              variant="outlined"
              class="search-field"
              style="max-width: 250px;"
            />
          </v-card-title>

          <v-card-text>
            <div v-if="loadingEmployees" class="loading-state">
              <v-progress-circular indeterminate color="primary" size="64"/>
              <p class="text-h6 mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
            </div>

            <div v-else-if="filteredEmployees.length === 0" class="empty-state">
              <v-icon size="80" color="grey-lighten-1">mdi-account-search</v-icon>
              <p class="text-h6 text-grey-lighten-1 mt-4">ບໍ່ພົບພະນັກງານ</p>
              <p class="text-body-2 text-grey">ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ໂຫລດຂໍ້ມູນໃໝ່</p>
            </div>

            <div v-else class="employee-list">
              <v-row>
                <v-col
                  v-for="employee in filteredEmployees"
                  :key="employee.employee_id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card
                    :class="['employee-card', { 
                      'selected': isEmployeeSelected(employee.employee_id),
                      'calculated': getEmployeeResult(employee.employee_id)
                    }]"
                    @click="toggleEmployeeSelection(employee.employee_id)"
                    rounded="lg"
                    elevation="2"
                  >
                    <v-card-text>
                      <!-- Employee Header -->
                      <div class="employee-header">
                        <div class="d-flex align-center justify-space-between">
                          <v-chip 
                            size="small" 
                            :color="isEmployeeSelected(employee.employee_id) ? 'primary' : 'default'"
                          >
                            #{{ employee.employee_id }}
                          </v-chip>
                          <v-checkbox
                            :model-value="isEmployeeSelected(employee.employee_id)"
                            hide-details
                            color="primary"
                            @click.stop
                            @change="toggleEmployeeSelection(employee.employee_id)"
                          />
                        </div>
                        
                        <h4 class="employee-name mt-2">{{ employee.name }}</h4>
                        <p class="text-body-2 text-grey">{{ employee.phone }}</p>
                      </div>

                      <!-- Money Inputs (Show only if selected) -->
                      <v-expand-transition>
                        <div v-if="isEmployeeSelected(employee.employee_id)" class="money-inputs mt-4">
                          <v-text-field
                            v-model.number="getEmployeeData(employee.employee_id).bonusMoney"
                            label="ເງິນໂບນັດ (ກີບ)"
                            type="number"
                            variant="outlined"
                            density="compact"
                            prefix="₭"
                            hide-details
                            class="mb-3"
                            @click.stop
                          />
                          
                          <v-text-field
                            v-model.number="getEmployeeData(employee.employee_id).tighMoney"
                            label="ເງິນຕິດ (ກີບ)"
                            type="number"
                            variant="outlined"
                            density="compact"
                            prefix="₭"
                            hide-details
                            @click.stop
                          />

                          <!-- Quick Calculate Button -->
                          <v-btn
                            size="small"
                            color="success"
                            variant="flat"
                            block
                            class="mt-3"
                            @click.stop="calculateSingle(employee.employee_id)"
                            :loading="loadingStates[employee.employee_id]"
                          >
                            <v-icon start size="16">mdi-calculator</v-icon>
                            ຄຳນວນ
                          </v-btn>
                        </div>
                      </v-expand-transition>

                   
                      <v-expand-transition>
                        <div v-if="getEmployeeResult(employee.employee_id)" class="result-section mt-4">
                          <v-divider class="mb-3"/>
                          <div class="result-data">
                            <div class="result-row">
                              <span>ເງິນເດືອນພື້ນຖານ:</span>
                              <span class="font-weight-bold">{{ formatMoney(getEmployeeResult(employee.employee_id).baseSalary) }}</span>
                            </div>
                            <div class="result-row">
                              <span>OT:</span>
                              <span class="font-weight-bold">{{ formatMoney(getEmployeeResult(employee.employee_id).ot) }}</span>
                            </div>
                            <div class="result-row total-row">
                              <span>ເງິນສຸດທິ:</span>
                              <span class="font-weight-bold text-success">{{ formatMoney(getEmployeeResult(employee.employee_id).netSalary) }}</span>
                            </div>
                          </div>
                        </div>
                      </v-expand-transition>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Summary Panel -->
      <v-col cols="12" lg="4">
        <v-card class="summary-panel" elevation="4" rounded="xl" sticky>
          <v-card-title>
            <v-icon start color="primary">mdi-chart-pie</v-icon>
            ສະຫຼຸບການຄຳນວນ
          </v-card-title>

          <v-card-text>
            <!-- Summary Stats -->
            <div class="summary-stats mb-4">
              <v-row>
                <v-col cols="6">
                  <v-card variant="tonal" color="primary" rounded="lg">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="24" color="primary">mdi-account-multiple</v-icon>
                      <div class="text-h5 mt-1">{{ selectedEmployees.length }}</div>
                      <div class="text-caption">ເລືອກແລ້ວ</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card variant="tonal" color="success" rounded="lg">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="24" color="success">mdi-check-circle</v-icon>
                      <div class="text-h5 mt-1">{{ calculatedCount }}</div>
                      <div class="text-caption">ຄຳນວນແລ້ວ</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <!-- Total Amount -->
            <v-card 
              v-if="totalNetSalary > 0"
              class="total-card mb-4"
              color="primary"
              variant="flat"
              rounded="lg"
            >
              <v-card-text class="text-center pa-4">
                <div class="text-white">
                  <div class="text-body-2">ຍອດລວມທີ່ຕ້ອງຈ່າຍ</div>
                  <div class="text-h4 mt-1 font-weight-bold">
                    {{ formatMoney(totalNetSalary) }}
                  </div>
                  <div class="text-caption">ກີບ</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <v-btn
                color="success"
                size="large"
                block
                rounded="lg"
                :loading="massLoading"
                :disabled="selectedEmployees.length === 0"
                @click="calculateAll"
                class="mb-3"
              >
                <v-icon start>mdi-calculator</v-icon>
                ຄຳນວນທັງໝົດ ({{ selectedEmployees.length }})
              </v-btn>

              <v-btn
                color="primary"
                size="large"
                block
                rounded="lg"
                variant="outlined"
                :disabled="calculatedCount === 0"
                @click="exportResults"
              >
                <v-icon start>mdi-download</v-icon>
                ສົ່ງອອກຜົນລັບ
              </v-btn>
            </div>

            <!-- Progress -->
            <div v-if="selectedEmployees.length > 0" class="progress-section mt-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">ຄວາມຄືບໜ້າ</span>
                <span class="text-body-2">{{ calculatedCount }}/{{ selectedEmployees.length }}</span>
              </div>
              <v-progress-linear
                :model-value="progressPercentage"
                color="success"
                height="8"
                rounded
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
interface EmployeeData {
  employee_id: number
  name: string
  gender: string
  birthdate: string
  address: string
  phone: string
  schedule_id: number
  position_id: number
  createdAt: string
  updatedAt: string
}

interface PayrollData {
  employeeId: number
  bonusMoney: number
  tighMoney: number
}

interface PayrollResult {
  employeeId: number
  name: string
  baseSalary: number
  bonusMoney: number
  tighMoney: number
  foodMoney: number
  ot: number
  cutMoney: number
  netSalary: string
  paymentDate: string
}

// Reactive data
const loadingEmployees = ref(false)
const massLoading = ref(false)
const employeeList = ref<EmployeeData[]>([])
const selectedEmployees = ref<number[]>([])
const employeePayrollData = ref<Map<number, PayrollData>>(new Map())
const payrollResults = ref<Map<number, PayrollResult>>(new Map())
const loadingStates = ref<Record<number, boolean>>({})
const searchQuery = ref('')

// Computed properties
const filteredEmployees = computed(() => {
  if (!searchQuery.value) return employeeList.value
  
  const query = searchQuery.value.toLowerCase()
  return employeeList.value.filter(emp => 
    emp.name.toLowerCase().includes(query) ||
    emp.employee_id.toString().includes(query) ||
    emp.phone.includes(query)
  )
})

const calculatedCount = computed(() => payrollResults.value.size)

const totalNetSalary = computed(() => {
  let total = 0
  payrollResults.value.forEach(result => {
    total += parseFloat(result.netSalary)
  })
  return total
})

const progressPercentage = computed(() => 
  selectedEmployees.value.length > 0 ? (calculatedCount.value / selectedEmployees.value.length) * 100 : 0
)

// Methods
const fetchEmployees = async () => {
  try {
    loadingEmployees.value = true
    const response = await $fetch('http://127.0.0.1:8000/api/auth/employees')
    employeeList.value = response
    
    // Initialize payroll data for all employees
    employeeList.value.forEach(emp => {
      if (!employeePayrollData.value.has(emp.employee_id)) {
        employeePayrollData.value.set(emp.employee_id, {
          employeeId: emp.employee_id,
          bonusMoney: 0,
          tighMoney: 0
        })
      }
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    CallSwal({
      title: "ຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້",
      icon: "error",
      confirmButtonText: "OK"
    })
  } finally {
    loadingEmployees.value = false
  }
}

const refreshEmployees = () => {
  fetchEmployees()
}

const selectAllEmployees = () => {
  selectedEmployees.value = employeeList.value.map(emp => emp.employee_id)
}

const clearAllSelections = () => {
  selectedEmployees.value = []
  payrollResults.value.clear()
}

const isEmployeeSelected = (employeeId: number): boolean => {
  return selectedEmployees.value.includes(employeeId)
}

const toggleEmployeeSelection = (employeeId: number) => {
  const index = selectedEmployees.value.indexOf(employeeId)
  if (index > -1) {
    selectedEmployees.value.splice(index, 1)
    payrollResults.value.delete(employeeId)
  } else {
    selectedEmployees.value.push(employeeId)
  }
}

const getEmployeeData = (employeeId: number): PayrollData => {
  if (!employeePayrollData.value.has(employeeId)) {
    employeePayrollData.value.set(employeeId, {
      employeeId,
      bonusMoney: 0,
      tighMoney: 0
    })
  }
  return employeePayrollData.value.get(employeeId)!
}

const getEmployeeResult = (employeeId: number): PayrollResult | undefined => {
  return payrollResults.value.get(employeeId)
}

const calculateSingle = async (employeeId: number) => {
  try {
    loadingStates.value[employeeId] = true
    
    const payrollData = getEmployeeData(employeeId)
    
    const response = await $fetch('http://127.0.0.1:8000/api/auth/cal_payrolls', {
      method: 'POST',
      body: payrollData
    })
    
    if (response.status === 'success') {
      payrollResults.value.set(employeeId, response.data)
    }
    
  } catch (error) {
    console.error('Error calculating payroll:', error)
    CallSwal({
      title: "ຂໍ້ຜິດພາດ",
      text: `ບໍ່ສາມາດຄຳນວນເງິນເດືອນພະນັກງານ #${employeeId} ໄດ້`,
      icon: "error",
      confirmButtonText: "OK"
    })
  } finally {
    loadingStates.value[employeeId] = false
  }
}

const calculateAll = async () => {
  try {
    massLoading.value = true
    
    const promises = selectedEmployees.value.map(employeeId => calculateSingle(employeeId))
    await Promise.all(promises)
    
    CallSwal({
      title: "ສຳເລັດ",
      text: `ຄຳນວນເງິນເດືອນສຳເລັດ ${calculatedCount.value} ຄົນ`,
      icon: "success",
      confirmButtonText: "OK"
    })
    
  } catch (error) {
    console.error('Error in mass calculation:', error)
  } finally {
    massLoading.value = false
  }
}

const formatMoney = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US').format(num)
}

const exportResults = () => {
  const results = Array.from(payrollResults.value.values())
  
  const dataStr = JSON.stringify(results, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `payroll_${new Date().toISOString().split('T')[0]}.json`
  link.click()
}

// Initialize
onMounted(() => {
  fetchEmployees()
})
</script>

<style scoped>
.payroll-container {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.payroll-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-content {
  background: white;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
}

.payroll-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 8px;
}

.payroll-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
}

.controls-card {
  background: white;
}

.employee-panel, .summary-panel {
  height: fit-content;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 64px 24px;
}

.employee-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.employee-card.selected {
  border-color: #1976d2;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
}

.employee-card.calculated {
  border-color: #4caf50;
}

.employee-card.selected.calculated {
  border-color: #4caf50;
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
}

.employee-name {
  color: #1976d2;
  font-weight: 600;
}

.money-inputs {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.result-section {
  background: rgba(76, 175, 80, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.result-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.result-row.total-row {
  font-size: 1rem;
  font-weight: 600;
  border-top: 1px solid rgba(76, 175, 80, 0.3);
  padding-top: 8px;
  margin-top: 8px;
}

.summary-stats {
  margin-bottom: 24px;
}

.total-card {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
}

.search-field {
  max-width: 300px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .payroll-container {
    padding: 16px;
  }
  
  .payroll-title {
    font-size: 2rem;
  }
  
  .search-field {
    max-width: 100%;
    margin-top: 16px;
  }
  
  .controls-card .v-col {
    text-align: center !important;
  }
}
</style>