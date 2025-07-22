<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const title = "ຈັດການສິດການເຂົ້າເຖິງ";
const rolePermissionStore = useRolePermissionStore();
const route = useRoute();

const selectedRole = ref<number | null>(null);
const selectedPermissions = ref<number[]>([]);
const showMatrix = ref(false);
const showDebugPanel = ref(false);

// Computed properties
const roles = computed(() => rolePermissionStore.roles || []);
const subMenus = computed(() => rolePermissionStore.sub_menus || []);
const isLoading = computed(() => rolePermissionStore.isloading);

// เมื่อเลือก role ใหม่
const onRoleChange = async () => {
  console.log(
    "Raw selectedRole value:",
    selectedRole.value,
    typeof selectedRole.value
  );

  // ✅ CRITICAL FIX: จัดการกรณี selectedRole เป็น object
  let roleId: number | null = null;

  if (selectedRole.value) {
    if (typeof selectedRole.value === "object" && selectedRole.value !== null) {
      // ถ้าเป็น object ให้ดึง id ออกมา
      roleId =
        (selectedRole.value as any).id || (selectedRole.value as any).role_id;
      console.log("Extracted roleId from object:", roleId);

      // อัปเดต selectedRole ให้เป็น number เท่านั้น
      selectedRole.value = roleId;
    } else if (typeof selectedRole.value === "string") {
      // ถ้าเป็น string ให้แปลงเป็น number
      roleId = parseInt(selectedRole.value);
      selectedRole.value = roleId;
    } else {
      // ถ้าเป็น number อยู่แล้ว
      roleId = selectedRole.value as number;
    }

    if (isNaN(roleId!) || roleId === null) {
      console.error("Invalid role ID after conversion:", roleId);
      await CallSwal({
        title: "ข้อผิดพลาด",
        text: `Role ID ไม่ถูกต้อง: ${selectedRole.value}`,
        icon: "error",
      });
      selectedRole.value = null;
      selectedPermissions.value = [];
      return;
    }

    console.log("Final numeric roleId:", roleId, typeof roleId);
    const permissions = rolePermissionStore.getSubMenuIdsByRole(roleId);
    selectedPermissions.value = [...permissions];
    console.log("Loaded permissions:", permissions);
  } else {
    selectedPermissions.value = [];
  }
};

// บันทึกการเปลี่ยนแปลง
const savePermissions = async () => {
  console.log(
    "Save permissions called with selectedRole:",
    selectedRole.value,
    typeof selectedRole.value
  );

  // ✅ CRITICAL FIX: ตรวจสอบและแปลง selectedRole
  let roleId: number | null = null;

  if (selectedRole.value) {
    if (typeof selectedRole.value === "object" && selectedRole.value !== null) {
      roleId =
        (selectedRole.value as any).id || (selectedRole.value as any).role_id;
      selectedRole.value = roleId; // แก้ไข ref ให้เป็น number
    } else if (typeof selectedRole.value === "string") {
      roleId = parseInt(selectedRole.value);
      selectedRole.value = roleId;
    } else {
      roleId = selectedRole.value as number;
    }
  }

  if (!roleId || isNaN(roleId)) {
    await CallSwal({
      title: "กรุณาเลือก Role",
      text: "กรุณาเลือก Role ที่ถูกต้องก่อนบันทึก",
      icon: "warning",
    });
    return;
  }

  console.log("Using final roleId for save:", roleId, typeof roleId);

  try {
    console.log("Attempting to save permissions...");

    // ลองใช้ bulk update ก่อน
    let success = await rolePermissionStore.bulkUpdateRolePermissions(
      roleId, // ✅ ใช้ roleId ที่เป็น number แน่นอน
      selectedPermissions.value
    );

    // ถ้าไม่สำเร็จ ลองใช้ safe method
    if (!success) {
      console.log("Bulk update failed, trying safe method...");

      const confirmation = await CallSwal({
        title: "ลองวิธีอื่น?",
        text: "การอัปเดตแบบทั่วไปไม่สำเร็จ ต้องการลองวิธีที่ปลอดภัยกว่าไหม?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ลองใหม่",
        cancelButtonText: "ยกเลิก",
      });

      if (confirmation.isConfirmed) {
        success = await rolePermissionStore.safeBulkUpdateRolePermissions(
          roleId,
          selectedPermissions.value
        );
      }
    }

    if (success) {
      // อัปเดตข้อมูลหลังบันทึกสำเร็จ
      await onRoleChange();
    }
  } catch (error) {
    console.error("Error in savePermissions:", error);

    await CallSwal({
      title: "เกิดข้อผิดพลาด",
      html: `
        <p>มีปัญหาในการบันทึก</p>
        <p><small>ลองเปิด Debug Panel เพื่อวิเคราะห์ปัญหา</small></p>
      `,
      icon: "error",
    });
  }
};

// บันทึกแบบทีละอัน (สำหรับกรณี emergency)
const savePermissionsOneByOne = async () => {
  if (!selectedRole.value) return;

  const confirmation = await CallSwal({
    title: "บันทึกทีละอัน?",
    text: "วิธีนี้จะใช้เวลาหลายกว่า แต่ปลอดภัยกว่า สืบต่อไหม?",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "สืบต่อ",
    cancelButtonText: "ยกเลิก",
  });

  if (!confirmation.isConfirmed) return;

  try {
    const currentPermissions = rolePermissionStore.getSubMenuIdsByRole(
      selectedRole.value
    );
    const toAdd = selectedPermissions.value.filter(
      (id) => !currentPermissions.includes(id)
    );
    const toRemove = currentPermissions.filter(
      (id) => !selectedPermissions.value.includes(id)
    );

    let successCount = 0;
    let totalOperations = toAdd.length + toRemove.length;

    // ลบทีละอัน
    for (const subId of toRemove) {
      try {
        await rolePermissionStore.removeSinglePermission(
          selectedRole.value,
          subId
        );
        successCount++;
      } catch (error) {
        console.error("Failed to remove permission:", subId);
      }
    }

    // เพิ่มทีละอัน
    for (const subId of toAdd) {
      try {
        await rolePermissionStore.addSinglePermission(
          selectedRole.value,
          subId
        );
        successCount++;
      } catch (error) {
        console.error("Failed to add permission:", subId);
      }
    }

    await CallSwal({
      title: "สำเร็จ",
      text: `ดำเนินการสำเร็จ ${successCount}/${totalOperations} รายการ`,
      icon: successCount === totalOperations ? "success" : "warning",
    });

    await onRoleChange();
  } catch (error) {
    console.error("Error in one-by-one save:", error);
  }
};

// เลือกทั้งหมด / ไม่เลือกเลย
const toggleAll = () => {
  if (selectedPermissions.value.length === subMenus.value.length) {
    selectedPermissions.value = [];
  } else {
    selectedPermissions.value = subMenus.value.map((menu) => menu.sub_id);
  }
};

// ตรวจสอบว่าเลือกทั้งหมดหรือไม่
const isAllSelected = computed(() => {
  return (
    selectedPermissions.value.length === subMenus.value.length &&
    subMenus.value.length > 0
  );
});

// ตรวจสอบว่าเลือกบางส่วนหรือไม่
const isIndeterminate = computed(() => {
  return (
    selectedPermissions.value.length > 0 &&
    selectedPermissions.value.length < subMenus.value.length
  );
});

onMounted(async () => {
  await rolePermissionStore.loadAllData();

  // ถ้ามี role parameter ใน URL ให้เลือก role นั้น
  const roleParam = route.query.role;
  if (roleParam) {
    selectedRole.value = Number(roleParam);
    await onRoleChange();
  }
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <LazyGlobalTextTitleLine :title="title" />

        <!-- การควบคุม -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-shield-account" class="mr-2"></v-icon>
            ຈັດການສິດການເຂົ້າເຖິງ
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedRole"
                  :items="roles"
                  item-title="name"
                  item-value="id"
                  label="ເລືອກ Role"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-account-group"
                  @update:model-value="onRoleChange"
                  :loading="isLoading"
                  return-object="false"
                  clearable
                >
                  <template v-slot:selection="{ item }">
                    <v-chip color="primary" size="small">
                      <v-icon start icon="mdi-account"></v-icon>
                      {{ item.title }} (ID: {{ item.value }})
                    </v-chip>
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon icon="mdi-account"></v-icon>
                      </template>
                      <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->
                      <!-- <v-list-item-subtitle
                        >Role ID: {{ item.value }} | Type:
                        {{ typeof item.value }}</v-list-item-subtitle
                      > -->
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="6" class="d-flex align-center">
                <v-btn-toggle v-model="showMatrix" mandatory class="mr-4">
                  <v-btn value="false" size="small">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                    ລາຍການ
                  </v-btn>
                  <v-btn value="true" size="small">
                    <v-icon>mdi-table</v-icon>
                    ຕາຕະລາງ
                  </v-btn>
                </v-btn-toggle>

                <v-btn
                  @click="savePermissions"
                  color="primary"
                  :disabled="!selectedRole || isLoading"
                  :loading="isLoading"
                  prepend-icon="mdi-content-save"
                  class="mr-2"
                >
                  ບັນທຶກ
                </v-btn>

                <!-- ปุ่มสำรอง -->
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :disabled="!selectedRole || isLoading"
                      color="grey"
                      variant="outlined"
                      size="small"
                      icon="mdi-chevron-down"
                      class="mr-2"
                    />
                  </template>
                  <v-list>
                    <v-list-item @click="savePermissionsOneByOne">
                      <v-list-item-title>
                        <v-icon icon="mdi-step-forward" class="mr-2"></v-icon>
                        ບັນທຶກທີລະອັນ
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showDebugPanel = true">
                      <v-list-item-title>
                        <v-icon icon="mdi-bug" class="mr-2"></v-icon>
                        Debug Panel
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="onRoleChange">
                      <v-list-item-title>
                        <v-icon icon="mdi-refresh" class="mr-2"></v-icon>
                        Refresh
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- เนื้อหาต้นต้น -->
        <v-card v-if="selectedRole">
          <v-card-title class="d-flex justify-space-between align-center">
            <span
              >ສິດການເຂົ້າເຖິງຂອງ Role:
              {{ roles.find((r) => r.id === selectedRole)?.name }}</span
            >

            <v-checkbox
              :model-value="isAllSelected"
              :indeterminate="isIndeterminate"
              @click="toggleAll"
              label="ເລືອກທັງໝົດ"
              color="primary"
              hide-details
            />
          </v-card-title>

          <!-- มุมมองรายการ -->
          <v-card-text v-if="!showMatrix">
            <v-row>
              <v-col
                v-for="menu in subMenus"
                :key="menu.sub_id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-checkbox
                  v-model="selectedPermissions"
                  :value="menu.sub_id"
                  color="primary"
                  hide-details
                >
                  <template v-slot:label>
                    <div class="d-flex align-center">
                      <v-icon
                        :icon="menu.icon || 'mdi-menu'"
                        class="mr-2"
                        size="small"
                      ></v-icon>
                      <div>
                        <div class="text-subtitle-2">{{ menu.name }}</div>
                        <div class="text-caption text-grey">{{ menu.url }}</div>
                      </div>
                    </div>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else>
            <v-data-table
              :headers="[
                { title: 'ເມນູ', value: 'name', sortable: true },
                { title: 'ໄອຄອນ', value: 'icon', sortable: false },
                { title: 'URL', value: 'url', sortable: true },
                { title: 'ສິດເຂົ້າເຖິງ', value: 'permission', sortable: false },
              ]"
              :items="subMenus"
              :loading="isLoading"
              loading-text="ກຳລັງໂຫລດ..."
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
            >
              <template v-slot:item.icon="{ item }">
                <v-icon :icon="item.icon || 'mdi-menu'" size="small"></v-icon>
              </template>

              <template v-slot:item.permission="{ item }">
                <v-switch
                  v-model="selectedPermissions"
                  :value="item.sub_id"
                  color="primary"
                  hide-details
                  inset
                />
              </template>

              <template v-slot:item.url="{ item }">
                <v-chip size="small" color="grey" variant="outlined">
                  {{ item.url }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-card v-else>
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2"
              >mdi-account-question</v-icon
            >
            <h3 class="text-h6 mt-4 text-grey">
              ກະລຸນາເລືອກ Role ເພື່ອຈັດການສິດການເຂົ້າເຖິງ
            </h3>

            <v-alert
              v-if="roles.length === 0"
              type="info"
              variant="tonal"
              class="mt-4 mx-auto"
              max-width="400"
            >
              <template v-slot:prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              <div class="text-left">
                <strong>ບໍ່ມີ Role ໃນລະບົບ</strong><br />
                ກະລຸນາສ້າງ Role ກ່ອນຈັດການສິດ
              </div>
            </v-alert>

            <v-alert
              v-else-if="subMenus.length === 0"
              type="warning"
              variant="tonal"
              class="mt-4 mx-auto"
              max-width="400"
            >
              <template v-slot:prepend>
                <v-icon>mdi-alert</v-icon>
              </template>
              <div class="text-left">
                <strong>ບໍ່ມີ Sub Menu ໃນລະບົບ</strong><br />
                ກະລຸນາສ້າງ Sub Menu ກ່ອນກຳນົດສິດ
              </div>
            </v-alert>

            <v-alert
              v-else
              type="success"
              variant="tonal"
              class="mt-4 mx-auto"
              max-width="500"
            >
              <template v-slot:prepend>
                <v-icon>mdi-check-circle</v-icon>
              </template>
              <div class="text-left">
                <strong>ລະບົບພ້ອມໃຊ້ງານ</strong><br />
                ມີ {{ roles.length }} Roles ແລະ {{ subMenus.length }} Sub
                Menus<br />
                <small class="text-grey"
                  >ເລືອກ Role ດ້ານເທິງເພື່ອເລີ່ມຈັດການສິດ</small
                >
              </div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="selectedRole" class="mt-4">
      <v-col cols="12" sm="4">
        <v-card color="primary" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="32">mdi-menu</v-icon>
            <div class="text-h4 mt-2">{{ subMenus.length }}</div>
            <div class="text-caption">ເມນູທັງໝົດ</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card color="success" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="32">mdi-check-circle</v-icon>
            <div class="text-h4 mt-2">{{ selectedPermissions.length }}</div>
            <div class="text-caption">ມີສິດເຂົ້າເຖິງ</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card color="warning" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="32">mdi-cancel</v-icon>
            <div class="text-h4 mt-2">
              {{ subMenus.length - selectedPermissions.length }}
            </div>
            <div class="text-caption">ບໍ່ມີສິດເຂົ້າເຖິງ</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <DebugPanelComponent
      v-model:is-visible="showDebugPanel"
      :selected-role="selectedRole"
      @close="showDebugPanel = false"
    />
  </v-container>
</template>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
