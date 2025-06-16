<template>
  <div id="pie-chart-container">
    <apexchart
      type="pie"
      width="380"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
// Define types for TypeScript support
interface ResponsiveOption {
  breakpoint: number
  options: {
    chart: {
      width: number
    }
    legend: {
      position: string
    }
  }
}

interface PieChartOptions {
  chart: {
    width: number
    type: string
  }
  labels: string[]
  responsive: ResponsiveOption[]
}

// Chart data series
const series = ref<number[]>([44, 55, 13, 43, 22])

// Chart configuration options
const chartOptions = ref<PieChartOptions>({
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
})

// Optional: Methods to update chart data
const updateSeriesData = (newData: number[]) => {
  series.value = [...newData]
}

const updateLabels = (newLabels: string[]) => {
  chartOptions.value.labels = [...newLabels]
}

const updateChartSize = (width: number) => {
  chartOptions.value.chart.width = width
}

// Optional: Add more styling and configuration
const enhancedChartOptions = ref({
  ...chartOptions.value,
  colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
  legend: {
    position: 'right' as const,
    offsetY: 0,
    height: 230,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '0%'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number): string {
      return val.toFixed(1) + "%"
    }
  },
  tooltip: {
    y: {
      formatter: function (val: number): string {
        return val.toString()
      }
    }
  }
})

// Use enhanced options instead of basic ones
const finalChartOptions = computed(() => enhancedChartOptions.value)

// Export methods for parent component access
defineExpose({
  updateSeriesData,
  updateLabels,
  updateChartSize
})
</script>

<style scoped>
#pie-chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Responsive styles */
@media (max-width: 480px) {
  #pie-chart-container {
    padding: 10px;
  }
}
</style>