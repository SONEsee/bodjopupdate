<template>
  <div>
   
    
    <apexchart
    style="font-family: Noto Sans Lao;"
    
      width="100%"
      type="area"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup lang="ts">
const lateMontStore = useDashBoardStore()


const late = computed(() => {
  return lateMontStore.response_data_absent
})

onMounted(() => {
  lateMontStore.getAbsentden()
})

interface SeriesData {
  name: string
  data: number[]
}

interface ApexChartOptions {
  chart: {
    type: string
    height: number
    zoom: {
      enabled: boolean
    }
  }
  dataLabels: {
    enabled: boolean
  }
  stroke: {
    curve: string
  }
  title: {
    text: string
    align: string
  }
  subtitle: {
    text: string
    align: string
  }
  labels: string[]
  xaxis: {
    type: string
  }
  yaxis: {
    opposite: boolean
  }
  legend: {
    horizontalAlign: string
  }
}


const processedData = computed(() => {
  
  if (!late.value || 
      late.value.status !== 'success' || 
      !late.value.data || 
      !late.value.data.absentDetails || 
      !Array.isArray(late.value.data.absentDetails)) {
    return {
      counts: [],
      dates: []
    }
  }

 
  const counts = late.value.data.absentDetails.map(item => item.count || 0)
  
  
  const dates = late.value.data.absentDetails.map(item => {
    if (!item.date) return new Date().toISOString()
    

    const [day, month, year] = item.date.split('/')
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`
    return isoDate
  })

  return {
    counts,
    dates
  }
})

// Chart series ທີ່ໃຊ້ຂໍ້ມູນຈາກ API
const chartSeries = computed<SeriesData[]>(() => [
  {
    name: "ການຂາດວຽກ",
    data: processedData.value.counts
  }
])


const chartOptions = computed<ApexChartOptions>(() => ({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'ສະຖິຕິການຂາດວຽກຂອງພະນັກງານ',
    align: 'left'
  },
  subtitle: {
    text: 'ຈຳນວນຄົນຂາດວຽກຕາມວັນ',
    align: 'left'
  },
  labels: processedData.value.dates,
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    opposite: false
  },
  legend: {
    horizontalAlign: 'left'
  }
}))


const updateChartData = (newCounts: number[], newDates: string[]) => {
  console.log('Manual update with:', newCounts, newDates)
  
}

const refreshData = async () => {
  await lateMontStore.getAbsentden()
}


defineExpose({
  updateChartData,
  refreshData,
  late,
  processedData
})
</script>

<style scoped>

</style>