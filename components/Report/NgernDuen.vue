<script setup lang="ts">
import { useReportStore } from '~/stores/report';

const report = useReportStore();
const res = computed(()=>{
    return report.resposn_ngernuen_data;
});
onMounted(()=>{
    report.getNgernuenData();
})
</script>
<template>
  test  <pre>{{ res }}</pre>
</template>