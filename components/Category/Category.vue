

<script setup lang="ts">
import { UseCategoryStore } from "~/stores/category";
import { onMounted } from "vue";
import { goPath } from "~/composables/global";
import { CallSwal } from "~/composables/global";
import { DefaultSwalError } from "~/composables/global";
const Headers = [
  { title: "ລຳດັບ", value: "index" },
  { title: "ປະເພດ", value: "Name" },
  { title: "ມື້ສ້າງ", value: "CreatedAt" },
  { title: "ມື້ອັບເດດ", value: "UpdatedAt" },
  { title: "ຈັດການ", value: "Actions" },
];

const categories = UseCategoryStore();
const response_data = computed(() => categories.categories);
console.log(response_data.value);

onMounted(() => {
  categories.GetListData();
});
const onDeleteType = async (id:string)=>{

  const res = await categories.DeleteCategory(id);
  if (res instanceof Error) {
    return DefaultSwalError(res.message);
  }
  const notification = await CallSwal({
    icon: "success",
    title: "ສຳເລັດ",
    text: "ລົບຂໍ້ມູນສຳເລັດ",
  });
  if (notification.isConfirmed) {
    await categories.GetListData();
  } else {
    await categories.GetListData();
  }
}
</script>

<template>
 
    <v-col cols="12">
     
        <div class="d-flex justify-end ">
            <v-btn color="primary"
            @click="goPath('/category/create')"
             ><v-icon icon="mdi-plus"></v-icon> ເພີ່ມປະເພດ</v-btn>
            

             
        </div>
    </v-col>
    
  <v-data-table :items="response_data" :headers="Headers">
    <template v-slot:item.index="{ item, index }">
      {{ index + 1 }}
    </template>
    <template v-slot:item.CreatedAt="{ item }">
      {{ new Date(item.CreatedAt).toLocaleDateString() }}
    </template>
    <template v-slot:item.UpdatedAt="{ item }">
      {{ new Date(item.UpdatedAt).toLocaleDateString() }}
    </template>

    <template v-slot:item.Actions="{ item }">
      <v-btn small flat class="text-primary" icon="mdi-eye-outline" 
      @click="goPath(`/category/detail?id=${item.ID}`)" />
      <v-btn small flat class="text-info" icon="mdi-pen" 
       @click="goPath(`/category/update?id=${item.ID}`)"
      />
      <v-btn small flat class="text-error" icon="mdi-delete-outline" 
      @click="onDeleteType(item.ID)"
      />
    </template>
  </v-data-table>
</template>
