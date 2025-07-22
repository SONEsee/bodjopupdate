<template>
  <div>
    <div v-if="chartData.length > 0" id="chart" ref="chartContainer" ></div>
    <div v-else class="text-center p-4">
      <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

// Type definitions
interface Employee {
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

interface AttendanceData {
  attendance_id: number
  employee_id: number
  check_in_time: string
  check_out_time: string | null
  date: string
  late: boolean
  penalty_amount: string
  createdAt: string
  updatedAt: string
  employee: Employee
}

interface ChartData {
  data: number[]
}

interface ChartOptions {
  series: ChartData[]
  chart: {
    height: number
    type: string
    zoom: {
      enabled: boolean
    }
  }
  dataLabels: {
    enabled: boolean
  }
  title: {
    text: string
    align: string
  }
  xaxis: {
    categories: string[]
  }
  stroke: {
    width: number
  }
  plotOptions: {
    area: {
      fillTo: string
    }
  }
  fill: {
    type: string
    gradient: {
      shadeIntensity: number
      opacityFrom: number
      opacityTo: number
      colorStops: Array<{
        offset: number
        color: string
        opacity: number
      }>
    }
  }
  colors: string[]
}


const report = useAttendanStore()
const res = computed(() => {
  return report.respons_data_attendan as AttendanceData[]
})


const chartContainer = ref<HTMLElement | null>(null)


let chart: any = null


const getAllDaysInMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    days.push({
      dateKey: date.toISOString().split('T')[0], 
      displayDate: day.toString() 
    })
  }
  
  return days
}


const timeToDecimalHours = (timeString: string): number => {
  const [hour, minute, second] = timeString.split(':').map(Number)
  return hour + (minute / 60) + (second / 3600)
}


const formatDecimalToTime = (decimalHours: number): string => {
  if (decimalHours === 0) return '--:--'
  const hours = Math.floor(decimalHours)
  const minutes = Math.floor((decimalHours - hours) * 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}


const chartData = computed(() => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
 
  const allDays = getAllDaysInMonth(currentYear, currentMonth)
  

  const attendanceMap = new Map<string, number>()
  
  if (res.value && res.value.length > 0) {
    res.value.forEach((item: AttendanceData) => {
      const checkInHours = timeToDecimalHours(item.check_in_time)
      attendanceMap.set(item.date, checkInHours)
    })
  }
  
 
  return allDays.map(day => ({
    date: day.displayDate,
    dateKey: day.dateKey,
    amount: attendanceMap.get(day.dateKey) || 0 
  }))
})


const categories = computed(() => {
  return chartData.value.map(item => item.date)
})


const seriesData = computed(() => {
  return chartData.value.map(item => item.amount)
})


const options = computed((): ChartOptions => ({
  series: [
    {
      data: seriesData.value,
    }
  ],
  chart: {
    height: 400,
    type: 'area',
    zoom: {
      enabled: false,
    },
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
  dataLabels: {
    enabled: true,
    formatter: function(val: number) {
      return formatDecimalToTime(val)
    }
  },
  title: {
    text: `ເວລາເຂົ້າວຽກປະຈຳເດືອນ ${new Date().toLocaleDateString('lo-LA', { month: 'long', year: 'numeric' })}`,
    align: 'left',
  },
  xaxis: {
    categories: categories.value,
    title: {
      text: 'ວັນທີ່ຂອງເດືອນ'
    },
    labels: {
      show: true,
      rotate: -45,
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    title: {
      text: 'ເວລາເຂົ້າວຽກ'
    },
    labels: {
      formatter: function(val: number) {
        return formatDecimalToTime(val)
      }
    },
    min: 6, // Start from 6 AM
    max: 12 // End at 12 PM (noon)
  },
  tooltip: {
    y: {
      formatter: function(val: number) {
        if (val === 0) return 'ບໍ່ມີການເຂົ້າວຽກ'
        return 'ເຂົ້າວຽກເວລາ: ' + formatDecimalToTime(val)
      }
    }
  },
  stroke: {
    width: 2,
  },
  plotOptions: {
    area: {
      fillTo: 'origin',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      colorStops: [
        {
          offset: 0,
          color: '#00ff00', 
          opacity: 0.8
        },
        {
          offset: 50,
          color: '#ffff00',
          opacity: 0.6
        },
        {
          offset: 100,
          color: '#ff0000', 
          opacity: 0.8
        }
      ]
    },
  },
  colors: ['#0088ee'],
}))


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


const updateChart = () => {
  if (chart && chartData.value.length > 0) {
    chart.updateOptions(options.value)
  } else if (chartData.value.length > 0) {
    initChart()
  }
}


watch([chartData, categories, seriesData], () => {
  updateChart()
}, { deep: true })


onMounted(() => {
  report.getDatamy()
  if (chartData.value.length > 0) {
    initChart()
  }
})


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