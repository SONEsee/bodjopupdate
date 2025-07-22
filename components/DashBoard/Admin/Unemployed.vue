<template>
  <div id="chart-container">
    <apexchart
      width="100%"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
const basStore = useBasalaryStore()

// ໃຊ້ computed ເພື່ອຮັບຂໍ້ມູນຈາກ store
const res = computed(() => {
  return basStore.respose_data_total_late
})

onMounted(() => {
  basStore.getLatedata()
})

// Define types for better TypeScript support
interface ChartSeries {
  name: string
  data: number[]
}

interface ChartOptions {
  chart: {
    height: number
    type: string
  }
  plotOptions: {
    bar: {
      borderRadius: number
      dataLabels: {
        position: string
      }
    }
  }
  dataLabels: {
    enabled: boolean
    formatter: (val: number) => string
    offsetY: number
    style: {
      fontSize: string
      colors: string[]
    }
  }
  xaxis: {
    categories: string[]
    position: string
    axisBorder: {
      show: boolean
    }
    axisTicks: {
      show: boolean
    }
    crosshairs: {
      fill: {
        type: string
        gradient: {
          colorFrom: string
          colorTo: string
          stops: number[]
          opacityFrom: number
          opacityTo: number
        }
      }
    }
    tooltip: {
      enabled: boolean
    }
  }
  yaxis: {
    axisBorder: {
      show: boolean
    }
    axisTicks: {
      show: boolean
    }
    labels: {
      show: boolean
      formatter: (val: number) => string
    }
  }
  title: {
    text: string
    floating: boolean
    offsetY: number
    align: string
    style: {
      color: string
    }
  }
}

// ສ້າງ computed ສຳລັບ series ທີ່ໃຊ້ຂໍ້ມູນຈາກ API
const series = computed<ChartSeries[]>(() => {
  // ກວດສອບໂຄງສ້າງຂໍ້ມູນຈາກ API
  if (!res.value || 
      res.value.status !== 'success' || 
      !res.value.data || 
      !res.value.data.lateDetails || 
      !Array.isArray(res.value.data.lateDetails)) {
    // ຂໍ້ມູນເລີ່ມຕົ້ນຖ້າຍັງບໍ່ມີຂໍ້ມູນຈາກ API
    return [
      {
        name: 'ການຂາດວຽກ',
        data: []
      }
    ]
  }

  // ແປງຂໍ້ມູນຈາກ API ໃຫ້ເໝາະກັບ chart
  const chartData = res.value.data.lateDetails.map(item => {
    return item.count || 0
  })

  return [
    {
      name: 'ການຂາດວຽກ',
      data: chartData
    }
  ]
})

// ສ້າງ computed ສຳລັບ categories (ວັນທີ) ຈາກຂໍ້ມູນ API
const categories = computed(() => {
  // ກວດສອບໂຄງສ້າງຂໍ້ມູນຈາກ API
  if (!res.value || 
      res.value.status !== 'success' || 
      !res.value.data || 
      !res.value.data.lateDetails || 
      !Array.isArray(res.value.data.lateDetails)) {
    return []
  }

  // ໃຊ້ວັນທີຈາກຂໍ້ມູນ API
  return res.value.data.lateDetails.map(item => {
    return item.date || 'N/A'
  })
})

// Chart configuration ທີ່ໃຊ້ຂໍ້ມູນແບບ dynamic
const chartOptions = computed<ChartOptions>(() => ({
  chart: {
    height: 350,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: 'top',
      },
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number): string {
      return val.toString() // ບໍ່ເອົາ % ເພາະເປັນຈຳນວນຄົນ
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ["#304758"]
    }
  },
  xaxis: {
    categories: categories.value,
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        }
      }
    },
    tooltip: {
      enabled: true,
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val: number): string {
        return val.toString()
      }
    }
  },
  title: {
    text: 'ສະຖິຕິການຂາດວຽກຂອງພະນັກງານຕາມວັນທີ',
    floating: true,
    offsetY: 330,
    align: 'center',
    style: {
      color: '#444'
    }
  }
}))

// Functions ສຳລັບອັບເດດຂໍ້ມູນ
const updateChartData = (newData: number[]) => {
  // ຟັງຊັ່ນນີ້ອາດຈະບໍ່ຈຳເປັນອີກຕໍ່ໄປ ເພາະໃຊ້ computed ແລ້ວ
  console.log('Manual update with:', newData)
}

const updateChartTitle = (newTitle: string) => {
  // ຟັງຊັ່ນນີ້ສາມາດໃຊ້ໄດ້ ແຕ່ຕ້ອງແກ້ໄຂເພາະ chartOptions ເປັນ computed ແລ້ວ
  console.log('Update title to:', newTitle)
}

// Export functions if needed by parent component
defineExpose({
  updateChartData,
  updateChartTitle,
  res 
})
</script>

<style scoped>
#chart-container {
  width: 100%;
  margin: 0 auto;
}
</style>