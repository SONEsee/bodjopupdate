<template>
  <div>
    <div v-if="chartData.length > 0" id="chart" ref="chartContainer"></div>
    <div v-else class="text-center p-4">
      <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

// Type definitions for payroll data
interface Employee {
  employee_id: number
  name: string
}

interface SpecialAllowance {
  special_allowance_id: number
  bonus_money: string
  tigh_money: string
  food_money: string
  ot: string
}

interface PayrollData {
  payroll_id: number
  employee_id: number
  special_allowance_id: number
  base_salary: string
  cut_money: string
  net_salary: string
  payment_date: string
  createdAt: string
  updatedAt: string
  employee: Employee
  specialAllowance: SpecialAllowance
}

interface ChartSeries {
  name: string
  data: number[]
}

interface ChartOptions {
  series: ChartSeries[]
  chart: {
    height: number
    type: string
    toolbar: {
      show: boolean
      tools: {
        download: boolean
        selection: boolean
        zoom: boolean
        zoomin: boolean
        zoomout: boolean
        pan: boolean
        reset: boolean
      }
    }
  }
  plotOptions: {
    bar: {
      borderRadius: number
      columnWidth: string
    }
  }
  dataLabels: {
    enabled: boolean
    formatter: (val: number) => string
  }
  stroke: {
    width: number
  }
  grid: {
    row: {
      colors: string[]
    }
  }
  xaxis: {
    labels: {
      rotate: number
    }
    categories: string[]
    tickPlacement: string
    title: {
      text: string
    }
  }
  yaxis: {
    title: {
      text: string
    }
    labels: {
      formatter: (val: number) => string
    }
  }
  fill: {
    type: string
    gradient: {
      shade: string
      type: string
      shadeIntensity: number
      gradientToColors: undefined
      inverseColors: boolean
      opacityFrom: number
      opacityTo: number
      stops: number[]
    }
  }
  colors: string[]
  title: {
    text: string
    align: string
  }
  tooltip: {
    y: {
      formatter: (val: number) => string
    }
  }
}

// Store and computed data
const salaryStore = otStore()
const response = computed(() => {
  return salaryStore.response_data_salary?.data || [] as PayrollData[]
})

// Template refs
const chartContainer = ref<HTMLElement | null>(null)

// Chart instance
let chart: any = null

// Process payroll data for chart
const chartData = computed(() => {
  if (!response.value || response.value.length === 0) return []

  // Group data by payment date and calculate salary components
  const dailyData = response.value.reduce((acc: Record<string, any>, item: PayrollData) => {
    const date = new Date(item.payment_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
    
    const baseSalary = parseFloat(item.base_salary) / 1000000 // Convert to millions
    const cutMoney = parseFloat(item.cut_money) / 1000000
    const netSalary = parseFloat(item.net_salary) / 1000000
    const foodMoney = parseFloat(item.specialAllowance.food_money) / 1000000
    const bonusMoney = parseFloat(item.specialAllowance.bonus_money) / 1000000
    const ot = parseFloat(item.specialAllowance.ot) / 1000000
    
    if (!acc[date]) {
      acc[date] = {
        baseSalary: 0,
        cutMoney: 0,
        netSalary: 0,
        foodMoney: 0,
        bonusMoney: 0,
        ot: 0
      }
    }
    
    // Sum up values for the same date
    acc[date].baseSalary += baseSalary
    acc[date].cutMoney += cutMoney
    acc[date].netSalary += netSalary
    acc[date].foodMoney += foodMoney
    acc[date].bonusMoney += bonusMoney
    acc[date].ot += ot
    
    return acc
  }, {})

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    ...data
  }))
})

// Chart categories (dates)
const categories = computed(() => {
  return chartData.value.map(item => item.date)
})

// Chart series data
const seriesData = computed(() => {
  return [
    {
      name: 'ເງິນເດືອນພື້ນຖານ',
      data: chartData.value.map(item => Math.round(item.baseSalary * 100) / 100)
    },
    {
      name: 'ເງິນຕັດ',
      data: chartData.value.map(item => Math.round(item.cutMoney * 100) / 100)
    },
    {
      name: 'ເງິນເດືອນສຸດທິ',
      data: chartData.value.map(item => Math.round(item.netSalary * 100) / 100)
    },
    {
      name: 'ເງິນອາຫານ',
      data: chartData.value.map(item => Math.round(item.foodMoney * 100) / 100)
    }
  ]
})

// Chart configuration
const options = computed((): ChartOptions => ({
  series: seriesData.value,
  chart: {
    height: 400,
    type: 'bar',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function(val: number) {
      return val.toFixed(1) + 'M'
    }
  },
  stroke: {
    width: 1
  },
  grid: {
    row: {
      colors: ['#fff', '#f2f2f2']
    }
  },
  xaxis: {
    labels: {
      rotate: -45
    },
    categories: categories.value,
    tickPlacement: 'on',
    title: {
      text: 'ວັນທີ່ຈ່າຍເງິນເດືອນ'
    }
  },
  yaxis: {
    title: {
      text: 'ຈຳນວນເງິນ (ລ້ານກີບ)',
    },
    labels: {
      formatter: function(val: number) {
        return val.toFixed(1) + 'M'
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: "vertical",
      shadeIntensity: 0.25,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [50, 0, 100]
    },
  },
  colors: ['#008FFB', '#FF4560', '#00E396', '#FEB019'],
  title: {
    text: 'ການວິເຄາະເງິນເດືອນ ແລະ ສິດທິບ່າງປະການ',
    align: 'left',
  },
  tooltip: {
    y: {
      formatter: function(val: number) {
        return val.toFixed(2) + ' ລ້ານກີບ'
      }
    }
  }
}))

// Initialize chart
const initChart = async () => {
  if (chartData.value.length === 0) return

  const { default: ApexCharts } = await import('apexcharts')
  
  if (chartContainer.value) {
    if (chart) {
      chart.destroy()
    }
    
    chart = new ApexCharts(chartContainer.value, options.value)
    await chart.render()
  }
}

// Update chart when data changes
const updateChart = () => {
  if (chart && chartData.value.length > 0) {
    chart.updateOptions(options.value)
  } else if (chartData.value.length > 0) {
    initChart()
  }
}

// Watch for data changes
watch([chartData, categories, seriesData], () => {
  updateChart()
}, { deep: true })

// Initialize chart when component mounts
onMounted(() => {
  salaryStore.getSalaryMy()
  if (chartData.value.length > 0) {
    initChart()
  }
})

// Cleanup chart when component unmounts
onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
#chart {
  width: 100%;
}

.text-center {
  text-align: center;
}

.p-4 {
  padding: 1rem;
}
</style>