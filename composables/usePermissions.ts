// composables/usePermissions.ts
import { computed } from 'vue'

export const usePermissions = () => {
  const rolePermissionStore = useRolePermissionStore()
  const menuStore = useMenuStore()

  // ດຶງ role ID ຂອງ user ປັດຈຸບັນ
  const currentUserRoleId = computed(() => {
    return menuStore.user_data?.role_id || null
  })

  // ກວດສອບສິດການເຂົ້າເຖິງ submenu ໂດຍ ID
  const hasPermissionById = (subMenuId: number, roleId?: number): boolean => {
    const targetRoleId = roleId || currentUserRoleId.value
    if (!targetRoleId) return false
    
    return rolePermissionStore.hasPermission(targetRoleId, subMenuId)
  }

  // ກວດສອບສິດການເຂົ້າເຖິງ submenu ໂດຍ URL
  const hasPermissionByUrl = (url: string, roleId?: number): boolean => {
    const targetRoleId = roleId || currentUserRoleId.value
    if (!targetRoleId) return false

    const subMenu = rolePermissionStore.sub_menus.find(menu => menu.url === url)
    if (!subMenu) return false

    return rolePermissionStore.hasPermission(targetRoleId, subMenu.sub_id)
  }

  // ດຶງລາຍການ submenu ທີ່ user ມີສິດເຂົ້າເຖິງ
  const getAccessibleSubMenus = (roleId?: number) => {
    const targetRoleId = roleId || currentUserRoleId.value
    if (!targetRoleId) return []

    const userPermissions = rolePermissionStore.getSubMenuIdsByRole(targetRoleId)
    return rolePermissionStore.sub_menus.filter(menu => 
      userPermissions.includes(menu.sub_id)
    )
  }

  // ກວດສອບວ່າ user ມີສິດ admin ຫຼືບໍ່ (ສາມາດກຳນົດ logic ຕາມຕ້ອງການ)
  const isAdmin = computed(() => {
    // ຕົວຢ່າງ: role ID 1 ແມ່ນ admin
    return currentUserRoleId.value === 1
  })

  // ກວດສອບວ່າ user ມີສິດຫຼາຍກວ່າ X permissions
  const hasMinimumPermissions = (minCount: number, roleId?: number): boolean => {
    const targetRoleId = roleId || currentUserRoleId.value
    if (!targetRoleId) return false

    const permissions = rolePermissionStore.getPermissionsByRole(targetRoleId)
    return permissions.length >= minCount
  }

 
  const filterMenusByPermission = (menus: any[], roleId?: number) => {
    const targetRoleId = roleId || currentUserRoleId.value
    if (!targetRoleId) return []

    const userPermissions = rolePermissionStore.getSubMenuIdsByRole(targetRoleId)
    
    return menus.filter(menu => {
      // ຖ້າມີ sub_id ໃຫ້ກວດສອບສິດ
      if (menu.sub_id) {
        return userPermissions.includes(menu.sub_id)
      }
      
      // ຖ້າມີ children ໃຫ້ກຣອງ children
      if (menu.children) {
        const filteredChildren = filterMenusByPermission(menu.children, targetRoleId)
        return filteredChildren.length > 0
      }
      
      // ຖ້າບໍ່ມີການກຳນົດສິດ ໃຫ້ຜ່ານ
      return true
    }).map(menu => {
      // ຖ້າມີ children ໃຫ້ອັບເດດ children ທີ່ກຣອງແລ້ວ
      if (menu.children) {
        return {
          ...menu,
          children: filterMenusByPermission(menu.children, targetRoleId)
        }
      }
      return menu
    })
  }

  // ສ້າງ navigation menu ທີ່ກຣອງຕາມສິດ
  const generateUserNavigation = () => {
    const accessibleMenus = getAccessibleSubMenus()
    
    // Group by main_id ເພື່ອສ້າງ hierarchical structure
    const groupedMenus = accessibleMenus.reduce((acc, menu) => {
      if (!acc[menu.main_id]) {
        acc[menu.main_id] = []
      }
      acc[menu.main_id].push(menu)
      return acc
    }, {} as Record<number, typeof accessibleMenus>)

    return groupedMenus
  }

  // ໂຫລດຂໍ້ມູນ permissions ທັງໝົດ
  const loadPermissions = async () => {
    await rolePermissionStore.loadAllData()
  }

  return {
    // Reactive data
    currentUserRoleId,
    isAdmin,
    
    // Methods
    hasPermissionById,
    hasPermissionByUrl,
    getAccessibleSubMenus,
    hasMinimumPermissions,
    filterMenusByPermission,
    generateUserNavigation,
    loadPermissions,
    
    // Store access
    rolePermissionStore
  }
}

// Plugin ສຳລັບ global usage
export default defineNuxtPlugin(() => {
  return {
    provide: {
      permissions: usePermissions()
    }
  }
})

// Types ສຳລັບ TypeScript
export interface PermissionCheck {
  subMenuId?: number
  url?: string
  roleId?: number
}

export interface MenuItem {
  id: number
  name: string
  url: string
  icon?: string
  sub_id?: number
  main_id?: number
  children?: MenuItem[]
}