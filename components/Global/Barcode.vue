<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import JsBarcode from "jsbarcode";

const canvasRef = ref<HTMLCanvasElement | null>(null);

const props = defineProps<{
  barcode: string; 
  width?: number; 
  height?: number; 
  format?: string; 
  displayValue?: boolean; 
}>();

const generateBarcode = () => {
  if (canvasRef.value && props.barcode) {
    JsBarcode(canvasRef.value, props.barcode, {
      format: props.format || "CODE128", 
      width: props.width || 2, 
      height: props.height || 50, 
      displayValue: props.displayValue !== false, 
    });
  }
};

onMounted(() => {
  generateBarcode();
});


watch(() => props.barcode, () => {
  generateBarcode();
});
</script>

<template>
  <canvas ref="canvasRef" style="max-width: 100%;"></canvas>
</template>