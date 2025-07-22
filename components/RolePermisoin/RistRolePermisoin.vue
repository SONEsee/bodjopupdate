<script setup lang="ts">
const title = "ຈັດການ Role";
const rolePermissionStore = useRolePermissionStore();

const search = ref("");
const dialog = ref(false);
const editDialog = ref(false);
const editItem = ref<any>(null);

// Form data
const form = ref();
const valid = ref(false);
const formData = ref({
  name: "",
  description: ""
});

// Computed
const roles = computed(() => rolePermissionStore.roles || []);
const isLoading = computed(() => rolePermissionStore.isloading);

const headers = [
  { title: "ລຳດັບ", value: "no", sortable: false, width: "80px" },
  { title: "ຊື່ Role", value: "name", sortable: true },
  { title: "ລາຍລະອຽດ", value: "description", sortable: true },
  { title: "ຈຳນວນສິດ", value: "permissions_count", sortable: true },
  { title: "ວັນທີສ້າງ", value: "created_at", sortable: true },
  { title: "ຈັດການ", value: "actions", sortable: false, width: "150px" },
];

// ຄຳນວນຈຳນວນ permissions ຂອງແຕ່ລະ role
const rolesWithPermissionCount = computed(() => {
  return roles.value.map(role => {
    const permissionCount = rolePermissionStore.getPermissionsByRole(role.id).length;
    return {
      ...role,
      permissions_count: permissionCount
    };
  });
});

// ສ້າງ Role ໃໝ່
const createRole = async () => {
  try {
    const isValid = await form.value.validate();
    if (!isValid.valid) return;

    const response = await axios.post('api/auth/role', formData.value);
    
    if (response.status === 201) {
      await CallSwal({
        title: "ສຳເລັດ",
        text: "ສ້າງ Role ສຳເລັດແລ້ວ",
        icon: "success",
        timer: 2000
      });
      
      dialog.value = false;
      resetForm();
      await rolePermissionStore.getRoles();
    }
  } catch (error) {
    console.error("Error creating role:", error);
    await CallSwal({
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດສ້າງ Role ໄດ້",
      icon: "error"
    });
  }
};

// ແກ້ໄຂ Role
const editRole = (role: any) => {
  editItem.value = { ...role };
  formData.value = {
    name: role.name,
    description: role.description || ""
  };
  editDialog.value = true;
};

const updateRole = async () => {
  try {
    const isValid = await form.value.validate();
    if (!isValid.valid) return;

    const response = await axios.put(`api/auth/role/${editItem.value.id}`, formData.value);
    
    if (response.status === 200) {
      await CallSwal({
        title: "ສຳເລັດ",
        text: "ອັບເດດ Role ສຳເລັດແລ້ວ",
        icon: "success",
        timer: 2000
      });
      
      editDialog.value = false;
      resetForm();
      await rolePermissionStore.getRoles();
    }
  } catch (error) {
    console.error("Error updating role:", error);
    await CallSwal({
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດອັບເດດ Role ໄດ້",
      icon: "error"
    });
  }
};

// ລຶບ Role
const deleteRole = async (id: number) => {
  try {
    const notification = await CallSwal({
      title: "ຢືນຢັນການລຶບ",
      text: "ທ່ານແນ່ໃຈຫຼືບໍ່ວ່າຕ້ອງການລຶບ Role ນີ້? ຂໍ້ມູນທີ່ກ່ຽວຂ້ອງທັງໝົດຈະຖືກລຶບ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ລຶບ",
      cancelButtonText: "ຍົກເລີກ",
      confirmButtonColor: "#d33",
    });

    if (notification.isConfirmed) {
      const response = await axios.delete(`api/auth/role/${id}`);
      
      if (response.status === 204) {
        await CallSwal({
          title: "ສຳເລັດ",
          text: "ລຶບ Role ສຳເລັດແລ້ວ",
          icon: "success",
          timer: 2000
        });
        
        await rolePermissionStore.getRoles();
        await rolePermissionStore.getRolePermissions(); // Refresh permissions too
      }
    }
  } catch (error) {
    console.error("Error deleting role:", error);
    await CallSwal({
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດລຶບ Role ໄດ້. ອາດມີຂໍ້ມູນທີ່ກ່ຽວຂ້ອງຢູ່",
      icon: "error"
    });
  }
};

// ຈັດການສິດຂອງ Role
const managePermissions = (roleId: number) => {
  goPath(`/role-permissions/manage?role=${roleId}`);
};

const resetForm = () => {
  formData.value = {
    name: "",
    description: ""
  };
  editItem.value = null;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
  await Promise.all([
    rolePermissionStore.getRoles(),
    rolePermissionStore.getRolePermissions()
  ]);
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <LazyGlobalTextTitleLine :title="title" />

        <!-- ການຄວບຄຸມ -->
        <v-card class="mb-4">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="ຄົ້ນຫາ Role..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
              
              <v-col cols="12" md="6" class="d-flex justify-end">
                <v-btn
                  @click="dialog = true"
                  color="primary"
                  prepend-icon="mdi-plus"
                >
                  ສ້າງ Role ໃໝ່
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ຕາຕະລາງ Roles -->
        <v-card>
          <v-data-table
            :headers="headers"
            :items="rolesWithPermissionCount"
            :loading="isLoading"
            :search="search"
            loading-text="ກຳລັງໂຫລດ..."
            no-data-text="ບໍ່ມີຂໍ້ມູນ Role"
            class="elevation-1"
          >
            <template v-slot:item.no="{ index }">
              <div class="text-center">{{ index + 1 }}</div>
            </template>

            <template v-slot:item.name="{ item }">
              <v-chip color="primary" size="small" variant="tonal">
                <v-icon start icon="mdi-account-group"></v-icon>
                {{ item.name }}
              </v-chip>
            </template>

            <template v-slot:item.description="{ item }">
              <span class="text-grey">
                {{ item.description || 'ບໍ່ມີລາຍລະອຽດ' }}
              </span>
            </template>

            <template v-slot:item.permissions_count="{ item }">
              <v-chip 
                :color="item.permissions_count > 0 ? 'success' : 'grey'" 
                size="small"
                variant="tonal"
              >
                {{ item.permissions_count }} ສິດ
              </v-chip>
            </template>

            <template v-slot:item.created_at="{ item }">
              <div class="text-caption">
                {{ item.created_at ? formatDate(item.created_at) : '-' }}
              </div>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-tooltip text="ຈັດການສິດ">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-shield-account"
                    size="small"
                    color="info"
                    variant="text"
                    @click="managePermissions(item.id)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="ແກ້ໄຂ">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-pen"
                    size="small"
                    color="primary"
                    variant="text"
                    @click="editRole(item)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="ລຶບ">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="deleteRole(item.id)"
                    :disabled="isLoading"
                  />
                </template>
              </v-tooltip>
            </template>

            <template v-slot:no-data>
              <div class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2">mdi-account-group-outline</v-icon>
                <div class="text-h6 mt-4 text-grey">ບໍ່ມີຂໍ້ມູນ Role</div>
                <v-btn
                  @click="dialog = true"
                  color="primary"
                  class="mt-4"
                  prepend-icon="mdi-plus"
                >
                  ສ້າງ Role ແລກ
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog ສ້າງ Role ໃໝ່ -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5">
          <v-icon icon="mdi-account-plus" class="mr-2"></v-icon>
          ສ້າງ Role ໃໝ່
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.name"
              label="ຊື່ Role *"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ Role']"
              required
              class="mb-4"
            />

            <v-textarea
              v-model="formData.description"
              label="ລາຍລະອຽດ"
              variant="outlined"
              density="compact"
              rows="3"
              no-resize
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="dialog = false; resetForm()"
            color="grey"
            variant="text"
          >
            ຍົກເລີກ
          </v-btn>
          <v-btn
            @click="createRole"
            color="primary"
            :disabled="!valid || isLoading"
            :loading="isLoading"
          >
            ສ້າງ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog ແກ້ໄຂ Role -->
    <v-dialog v-model="editDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5">
          <v-icon icon="mdi-pen" class="mr-2"></v-icon>
          ແກ້ໄຂ Role
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.name"
              label="ຊື່ Role *"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ Role']"
              required
              class="mb-4"
            />

            <v-textarea
              v-model="formData.description"
              label="ລາຍລະອຽດ"
              variant="outlined"
              density="compact"
              rows="3"
              no-resize
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="editDialog = false; resetForm()"
            color="grey"
            variant="text"
          >
            ຍົກເລີກ
          </v-btn>
          <v-btn
            @click="updateRole"
            color="primary"
            :disabled="!valid || isLoading"
            :loading="isLoading"
          >
            ອັບເດດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-data-table {
  background: transparent;
}

.v-chip {
  font-weight: 500;
}
</style>