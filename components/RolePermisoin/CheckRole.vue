<!-- PermissionGuard.vue - Component ສຳລັບກວດສອບສິດ -->
<script setup lang="ts">
interface Props {
  roleId?: number | null;
  subMenuId?: number | null;
  url?: string;
  fallback?: boolean; // ສະແດງ fallback ຫຼືບໍ່ເມື່ອບໍ່ມີສິດ
}

const props = withDefaults(defineProps<Props>(), {
  roleId: null,
  subMenuId: null,
  url: '',
  fallback: true
});

const rolePermissionStore = useRolePermissionStore();
const menuStore = useMenuStore();

// ກວດສອບສິດການເຂົ້າເຖິງ
const hasAccess = computed(() => {
  // ຖ້າບໍ່ມີ roleId ໃຫ້ໃຊ້ຈາກ user ປັດຈຸບັນ
  const currentRoleId = props.roleId || menuStore.user_data?.role_id;
  
  if (!currentRoleId) return false;

  // ຖ້າມີ subMenuId ໃຫ້ກວດສອບໂດຍກົງ
  if (props.subMenuId) {
    return rolePermissionStore.hasPermission(currentRoleId, props.subMenuId);
  }

  // ຖ້າມີ URL ໃຫ້ຫາ subMenuId ຈາກ URL
  if (props.url) {
    const subMenu = rolePermissionStore.sub_menus.find(menu => menu.url === props.url);
    if (subMenu) {
      return rolePermissionStore.hasPermission(currentRoleId, subMenu.sub_id);
    }
  }

  return false;
});

// ຂໍ້ຄວາມແຈ້ງເຕືອນ
const accessDeniedMessage = computed(() => {
  return {
    title: "ບໍ່ມີສິດເຂົ້າເຖິງ",
    text: "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຫນ້ານີ້",
    icon: "mdi-lock"
  };
});
</script>

<template>
  <!-- ສະແດງເນື້ອຫາເມື່ອມີສິດ -->
  <div v-if="hasAccess">
    <slot />
  </div>

  <!-- ສະແດງ fallback ເມື່ອບໍ່ມີສິດ -->
  <div v-else-if="fallback" class="text-center py-8">
    <v-card color="error" variant="tonal" class="mx-auto" max-width="400">
      <v-card-text class="text-center">
        <v-icon :icon="accessDeniedMessage.icon" size="64" color="error"></v-icon>
        <h3 class="text-h6 mt-4">{{ accessDeniedMessage.title }}</h3>
        <p class="text-body-2 mt-2">{{ accessDeniedMessage.text }}</p>
        
        <v-btn
          @click="$router.go(-1)"
          color="error"
          variant="outlined"
          class="mt-4"
          prepend-icon="mdi-arrow-left"
        >
          ກັບຄືນ
        </v-btn>
      </v-card-text>
    </v-card>
  </div>

  <!-- ບໍ່ສະແດງຫຍັງເມື່ອ fallback = false -->
</template>

<!-- ======================================= -->

<!-- PermissionButton.vue - ປຸ່ມທີ່ກວດສອບສິດ -->
<script setup lang="ts">
interface ButtonProps {
  roleId?: number | null;
  subMenuId?: number | null;
  url?: string;
  color?: string;
  variant?: string;
  size?: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  roleId: null,
  subMenuId: null,
  url: '',
  color: 'primary',
  variant: 'flat',
  size: 'default',
  icon: '',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const rolePermissionStore = useRolePermissionStore();
const menuStore = useMenuStore();

const hasAccess = computed(() => {
  const currentRoleId = props.roleId || menuStore.user_data?.role_id;
  
  if (!currentRoleId) return false;

  if (props.subMenuId) {
    return rolePermissionStore.hasPermission(currentRoleId, props.subMenuId);
  }

  if (props.url) {
    const subMenu = rolePermissionStore.sub_menus.find(menu => menu.url === props.url);
    if (subMenu) {
      return rolePermissionStore.hasPermission(currentRoleId, subMenu.sub_id);
    }
  }

  return true; // ຖ້າບໍ່ກຳນົດ permission ໃຫ້ສະແດງ
});

const handleClick = (event: MouseEvent) => {
  if (hasAccess.value && !props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <v-btn
    v-if="hasAccess"
    :color="color"
    :variant="variant"
    :size="size"
    :prepend-icon="icon"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </v-btn>
</template>

<!-- ======================================= -->

<!-- PermissionMenu.vue - ເມນູທີ່ກວດສອບສິດ -->
<script setup lang="ts">
interface MenuItem {
  title: string;
  icon?: string;
  url?: string;
  subMenuId?: number;
  children?: MenuItem[];
  divider?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  roleId?: number | null;
}

const props = withDefaults(defineProps<MenuProps>(), {
  roleId: null
});

const rolePermissionStore = useRolePermissionStore();
const menuStore = useMenuStore();

// ຟິລເຕີເມນູຕາມສິດ
const filteredItems = computed(() => {
  const currentRoleId = props.roleId || menuStore.user_data?.role_id;
  
  if (!currentRoleId) return [];

  const filterItem = (item: MenuItem): MenuItem | null => {
    // ຖ້າມີ children ໃຫ້ຟິລເຕີ children ກ່ອນ
    if (item.children) {
      const filteredChildren = item.children
        .map(child => filterItem(child))
        .filter(child => child !== null) as MenuItem[];
      
      if (filteredChildren.length > 0) {
        return { ...item, children: filteredChildren };
      }
      return null;
    }

    // ກວດສອບສິດການເຂົ້າເຖິງ
    if (item.subMenuId) {
      const hasPermission = rolePermissionStore.hasPermission(currentRoleId, item.subMenuId);
      return hasPermission ? item : null;
    }

    if (item.url) {
      const subMenu = rolePermissionStore.sub_menus.find(menu => menu.url === item.url);
      if (subMenu) {
        const hasPermission = rolePermissionStore.hasPermission(currentRoleId, subMenu.sub_id);
        return hasPermission ? item : null;
      }
    }

    // ຖ້າບໍ່ມີການກຳນົດສິດ ໃຫ້ສະແດງ (ເຊັ່ນ divider)
    return item;
  };

  return props.items
    .map(item => filterItem(item))
    .filter(item => item !== null) as MenuItem[];
});
</script>

<template>
  <v-list>
    <template v-for="(item, index) in filteredItems" :key="index">
      <!-- Divider -->
      <v-divider v-if="item.divider" />
      
      <!-- ເມນູທີ່ມີ children -->
      <v-list-group v-else-if="item.children" :value="item.title">
        <template v-slot:activator="{ props: groupProps }">
          <v-list-item
            v-bind="groupProps"
            :prepend-icon="item.icon"
            :title="item.title"
          />
        </template>
        
        <v-list-item
          v-for="(child, childIndex) in item.children"
          :key="childIndex"
          :prepend-icon="child.icon"
          :title="child.title"
          :to="child.url"
          class="ml-4"
        />
      </v-list-group>
      
      <!-- ເມນູທຳມະດາ -->
      <v-list-item
        v-else
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.url"
      />
    </template>
  </v-list>
</template>




<template>
  <div>
    <!-- ກວດສອບສິດກ່ອນສະແດງເນື້ອຫາ -->
    <PermissionGuard :sub-menu-id="1">
      <h1>ເນື້ອຫາທີ່ຕ້ອງການສິດພິເສດ</h1>
      <p>ຈະສະແດງພຽງເມື່ອມີສິດເຂົ້າເຖິງ submenu ID 1</p>
    </PermissionGuard>

    <!-- ປຸ່ມທີ່ກວດສອບສິດ -->
    <PermissionButton 
      url="/admin/users"
      color="primary"
      icon="mdi-account-plus"
      @click="createUser"
    >
      ເພີ່ມຜູ້ໃຊ້
    </PermissionButton>

    <!-- ເມນູທີ່ກວດສອບສິດ -->
    <PermissionMenu :items="menuItems" />
  </div>
</template>
