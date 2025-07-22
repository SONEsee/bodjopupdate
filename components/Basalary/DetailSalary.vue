<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const id = Number(route.query.bas_id )|| 0;
const basalaryStore = useBasalaryStore();
const res = computed(() => {
  return basalaryStore.response_data_basalary_detail || [];
});
onMounted(() => {
  basalaryStore.getBasalaryDetail(id);
});
const title = "ລາຍລະອຽດຂັ້ນເງິນເດືອນ";
</script>
<template>
    <v-col cols="12">
        <div class="pa-2">
           
            <GlobalTextTitleLine :title="title" />
            <v-row>
             <v-col cols="12" md="6">
                <GlobalCardTitle :title="'ລະຫັດ'" :text="res.base_sal_id"  />
             </v-col>   
             <v-col cols="12" md="6">
                <GlobalCardTitle :title="'ຈຳນວນເງິນ'" :text="res.salary" />
             </v-col>   
            </v-row>
            
        </div>
    </v-col>
</template>