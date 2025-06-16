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

// Chart data
const series = ref<ChartSeries[]>([
  {
    name: 'Inflation',
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
  }
])

// Chart configuration
const chartOptions = ref<ChartOptions>({
  chart: {
    height: 350,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number): string {
      return val + "%"
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ["#304758"]
    }
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
        return val + "%"
      }
    }
  },
  title: {
    text: 'ສະຖິຕິການຂາດວຽກຂອງພະນັກງານປະຈຳເດືອນ, 06/2025',
    floating: true,
    offsetY: 330,
    align: 'center',
    style: {
      color: '#444'
    }
  }
})


const updateChartData = (newData: number[]) => {
  series.value = [
    {
      name: 'Inflation',
      data: newData
    }
  ]
}

// Optional: Method to update chart title
const updateChartTitle = (newTitle: string) => {
  chartOptions.value.title.text = newTitle
}

// Export functions if needed by parent component
defineExpose({
  updateChartData,
  updateChartTitle
})
</script>

<style scoped>
#chart-container {
  width: 100%;
  margin: 0 auto;
}
</style>