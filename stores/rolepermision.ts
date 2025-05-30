import axios from "@/helpers/axios";

interface RolePermission {
  id: number;
  role_id: number;
  sub_id: number;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface SubMenu {
  sub_id: number;
  name: string;
  icon?: string;
  url: string;
  main_id: number;
  created_at?: string;
  updated_at?: string;
}

export const useRolePermissionStore = defineStore("rolePermission", {
  state() {
    return {
      role_permissions: [] as RolePermission[],
      roles: [] as Role[],
      sub_menus: [] as SubMenu[],
      selected_role_id: null as number | null,
      isloading: false,
      
      // Form data for creating/updating
      form_data: {
        role_id: 0,
        sub_id: 0,
      },
    };
  },

  actions: {
    // ດຶງຂໍ້ມູນ role permissions ທັງໝົດ
    async getRolePermissions() {
      this.isloading = true;
      try {
        const res = await axios.get<RolePermission[]>('api/auth/role_permissions');
        if (res.status === 200) {
          this.role_permissions = res.data;
        }
      } catch (error) {
        console.error("Error fetching role permissions:", error);
      } finally {
        this.isloading = false;
      }
    },

    // ດຶງຂໍ້ມູນ roles ທັງໝົດ
    async getRoles() {
      this.isloading = true;
      try {
        const res = await axios.get<Role[]>('api/auth/role');
        if (res.status === 200) {
          this.roles = res.data;
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        this.isloading = false;
      }
    },

    // ດຶງຂໍ້ມູນ sub menus ທັງໝົດ
    async getSubMenus() {
      this.isloading = true;
      try {
        const res = await axios.get<SubMenu[]>('api/auth/sub_menus');
        if (res.status === 200) {
          this.sub_menus = res.data;
        }
      } catch (error) {
        console.error("Error fetching sub menus:", error);
      } finally {
        this.isloading = false;
      }
    },

    // ດຶງ permissions ຂອງ role ສະເພາະ
    async getRolePermissionsByRole(roleId: number) {
      this.isloading = true;
      try {
        const res = await axios.get<RolePermission[]>(`api/auth/role_permissions?role_id=${roleId}`);
        if (res.status === 200) {
          return res.data;
        }
        return [];
      } catch (error) {
        console.error("Error fetching role permissions by role:", error);
        return [];
      } finally {
        this.isloading = false;
      }
    },

    // ສ້າງ permission ໃໝ່ (ປັບປຸງ error handling ແລະ validation)
    async createRolePermission(roleId: number, subId: number) {
      this.isloading = true;
      try {
        // ✅ CRITICAL: ตรวจสอบและแปลง data types
        const numericRoleId = typeof roleId === 'string' ? parseInt(roleId) : roleId;
        const numericSubId = typeof subId === 'string' ? parseInt(subId) : subId;
        
        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
        if (isNaN(numericRoleId) || isNaN(numericSubId)) {
          throw new Error(`Invalid data types: roleId=${roleId} (${typeof roleId}), subId=${subId} (${typeof subId})`);
        }
        
        console.log('Original roleId:', roleId, typeof roleId);
        console.log('Original subId:', subId, typeof subId);
        console.log('Converted roleId:', numericRoleId, typeof numericRoleId);
        console.log('Converted subId:', numericSubId, typeof numericSubId);
        
        // ตรวจสอบว่ามี permission นี้อยู่แล้วหรือไม่
        const exists = this.role_permissions.some(p => 
          p.role_id === numericRoleId && p.sub_id === numericSubId
        );
        
        if (exists) {
          console.log('Permission already exists, skipping...', { roleId: numericRoleId, subId: numericSubId });
          return null;
        }

        const data = { 
          role_id: numericRoleId,  // ✅ ใช้ตัวเลข 
          sub_id: numericSubId     // ✅ ใช้ตัวเลข
        };
        
        console.log('Creating permission with data:', data);
        
        const res = await axios.post<RolePermission>('api/auth/role_permissions', data);
        
        if (res.status === 201 && res.data) {
          // เพิ่ม permission ใหม่ใส่ state โดยตรง
          this.role_permissions.push(res.data);
          console.log('Permission created successfully:', res.data);
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.error("Error creating role permission:", error);
        
        // Log detailed error information
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
        }
        
        // ตรวจสอบว่าเป็น permission ที่มีอยู่แล้วหรือไม่
        if (error.response?.status === 409 || error.response?.status === 400) {
          console.log('Permission already exists (from server):', { roleId, subId });
          return null; // Don't show error for duplicates
        } else if (error.response?.status === 500) {
          // Server error - might be a constraint violation
          console.error('Server error when creating permission:', { roleId, subId });
          throw new Error(`Server error creating permission for role ${roleId}, submenu ${subId}: ${error.response?.data?.message || error.message}`);
        } else {
          throw error;
        }
      } finally {
        this.isloading = false;
      }
    },

    // ລຶບ permission
    async deleteRolePermission(id: number) {
      this.isloading = true;
      try {
        const notification = await CallSwal({
          title: "ຢືນຢັນການລຶບ",
          text: "ທ່ານແນ່ໃຈຫຼືບໍ່ວ່າຕ້ອງການລຶບສິດນີ້?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ລຶບ",
          cancelButtonText: "ຍົກເລີກ",
          confirmButtonColor: "#d33",
        });

        if (notification.isConfirmed) {
          const res = await axios.delete(`api/auth/role_permissions/${id}`);
          
          if (res.status === 204 || res.status === 200) {
            // ລຶບ permission ອອກຈາກ state ໂດຍກົງ
            this.role_permissions = this.role_permissions.filter(p => p.id !== id);
            
            await CallSwal({
              title: "ສຳເລັດ",
              text: "ລຶບສິດການເຂົ້າເຖິງສຳເລັດ",
              icon: "success",
              timer: 2000
            });
            
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error deleting role permission:", error);
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດລຶບສິດການເຂົ້າເຖິງໄດ້",
          icon: "error"
        });
        return false;
      } finally {
        this.isloading = false;
      }
    },

    // ບັນທຶກຫຼາຍ permissions ພ້ອມກັນ (ແກ້ไข data type issue)
    async bulkUpdateRolePermissions(roleId: number, subMenuIds: number[]) {
      this.isloading = true;
      try {
        // ✅ CRITICAL: ตรวจสอบและแปลง data types
        const numericRoleId = typeof roleId === 'string' ? parseInt(roleId) : roleId;
        const numericSubMenuIds = subMenuIds.map(id => typeof id === 'string' ? parseInt(id) : id);
        
        if (isNaN(numericRoleId)) {
          throw new Error(`Invalid roleId: ${roleId} (${typeof roleId})`);
        }
        
        if (numericSubMenuIds.some(id => isNaN(id))) {
          throw new Error(`Invalid subMenuIds: ${subMenuIds} contains non-numeric values`);
        }
        
        console.log('Starting bulk update for role:', numericRoleId, 'with subMenuIds:', numericSubMenuIds);
        console.log('Original roleId type:', typeof roleId, 'value:', roleId);
        
        // 1. ดึง permissions ปัจจุบันของ role นี้
        const currentPermissions = this.role_permissions.filter(p => p.role_id === numericRoleId);
        const currentSubIds = currentPermissions.map(p => p.sub_id);
        
        console.log('Current permissions:', currentSubIds);
        
        // 2. คิดไล่สิ่งที่ต้องเพิ่มและลบ
        const toAdd = numericSubMenuIds.filter(subId => !currentSubIds.includes(subId));
        const toRemove = currentPermissions.filter(p => !numericSubMenuIds.includes(p.sub_id));
        
        console.log('To add:', toAdd);
        console.log('To remove:', toRemove.map(p => p.id));
        
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        
        // 3. ลบ permissions ที่ไม่ต้องการ (ทีละอัน)
        for (const permission of toRemove) {
          try {
            await axios.delete(`api/auth/role_permissions/${permission.id}`);
            // อัปเดต state โดยตรง
            this.role_permissions = this.role_permissions.filter(p => p.id !== permission.id);
            console.log('Deleted permission:', permission.id);
            successCount++;
          } catch (deleteError) {
            console.error('Error deleting permission:', permission.id, deleteError);
            errorCount++;
            errors.push(`ลบ permission ID ${permission.id} ไม่ได้`);
          }
        }
        
        // 4. เพิ่ม permissions ใหม่ (ทีละอัน) แบบปลอดภัย - ใช้ตัวเลข
        for (const subId of toAdd) {
          try {
            const result = await this.createRolePermission(numericRoleId, subId);
            if (result) {
              console.log('Added permission:', result);
              successCount++;
            } else {
              console.log('Permission already exists or failed to create:', subId);
            }
          } catch (addError: any) {
            console.error('Error adding permission for subId:', subId, addError);
            errorCount++;
            errors.push(`เพิ่ม permission สำหรับ submenu ${subId} ไม่ได้: ${addError.message}`);
          }
        }

        // 5. แสดงผล
        if (errorCount === 0) {
          await CallSwal({
            title: "สำเร็จ",
            text: `อัปเดตสิทธิ์การเข้าถึงสำเร็จ (ดำเนินการ ${successCount} รายการ)`,
            icon: "success",
            timer: 2000
          });
          return true;
        } else if (successCount > 0) {
          await CallSwal({
            title: "สำเร็จบางส่วน",
            html: `สำเร็จ: ${successCount} รายการ<br>ล้มเหลว: ${errorCount} รายการ<br><br>รายละเอียด:<br>${errors.join('<br>')}`,
            icon: "warning"
          });
          return true;
        } else {
          throw new Error('ทุกการดำเนินการล้มเหลว');
        }
        
      } catch (error: any) {
        console.error("Error bulk updating role permissions:", error);
        
        // โหลดข้อมูลใหม่เพื่อรับประกันความถูกต้อง
        console.log('Reloading permissions due to error...');
        await this.getRolePermissions();
        
        let errorMessage = "ไม่สามารถอัปเดตสิทธิ์การเข้าถึงได้";
        
        if (error.response?.status === 500) {
          errorMessage = "เกิดข้อผิดพลาดในเซิร์ฟเวอร์ อาจมีปัญหาด้วยฐานข้อมูล";
        } else if (error.response?.status === 404) {
          errorMessage = "ไม่พบข้อมูลที่ต้องการ";
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = "ปัญหาการเชื่อมต่อเครือข่าย";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        await CallSwal({
          title: "เกิดข้อผิดพลาด",
          text: errorMessage,
          icon: "error"
        });
        
        return false;
      } finally {
        this.isloading = false;
      }
    },

    // ໂຫລດຂໍ້ມູນທັງໝົດ
    async loadAllData() {
      await Promise.all([
        this.getRoles(),
        this.getSubMenus(),
        this.getRolePermissions()
      ]);
    },

    // ຟັງຊັນຊ່ວຍເຫຼືອເພີ່ມເຕີມ
    
    // ເພີ່ມ permission ດຽວ (ສຳລັບການໃຊ້ງານໃນ UI)
    async addSinglePermission(roleId: number, subId: number) {
      // ກວດສອບວ່າມີ permission ນີ້ຢູ່ແລ້ວຫຼືບໍ່
      const exists = this.role_permissions.some(p => 
        p.role_id === roleId && p.sub_id === subId
      );
      
      if (exists) {
        await CallSwal({
          title: "ເຕືອນ",
          text: "ສິດການເຂົ້າເຖິງນີ້ມີຢູ່ແລ້ວ",
          icon: "warning",
          timer: 2000
        });
        return false;
      }

      return await this.createRolePermission(roleId, subId);
    },

    // ລຶບ permission ໂດຍ role_id ແລະ sub_id
    async removeSinglePermission(roleId: number, subId: number) {
      const permission = this.role_permissions.find(p => 
        p.role_id === roleId && p.sub_id === subId
      );
      
      if (permission) {
        return await this.deleteRolePermission(permission.id);
      }
      
      return false;
    },

    // Toggle permission (ເພີ່ມຖ້າບໍ່ມີ, ລຶບຖ້າມີ)
    async togglePermission(roleId: number, subId: number) {
      const exists = this.role_permissions.some(p => 
        p.role_id === roleId && p.sub_id === subId
      );
      
      if (exists) {
        return await this.removeSinglePermission(roleId, subId);
      } else {
        const result = await this.addSinglePermission(roleId, subId);
        return !!result;
      }
    },

    // Method ທີ່ປອດໄພທີ່ສຸດ: ດຳເນີນການທີລະຂັ້ນຕອນແລະກວດສອບຜົນ
    async safeBulkUpdateRolePermissions(roleId: number, subMenuIds: number[]) {
      this.isloading = true;
      const results = {
        success: [],
        failed: [],
        total: 0
      };
      
      try {
        console.log('Using SAFE bulk update method for role:', roleId);
        
        // ດຶງຂໍ້ມູນລ່າສຸດຈາກ server ກ່ອນ
        await this.getRolePermissions();
        
        const currentPermissions = this.role_permissions.filter(p => p.role_id === roleId);
        const currentSubIds = currentPermissions.map(p => p.sub_id);
        
        // ຄິດໄລ່ສິ່ງທີ່ຕ້ອງປ່ຽນ
        const toAdd = subMenuIds.filter(subId => !currentSubIds.includes(subId));
        const toRemove = currentPermissions.filter(p => !subMenuIds.includes(p.sub_id));
        
        results.total = toAdd.length + toRemove.length;
        
        console.log('Safe update plan:', { toAdd, toRemove: toRemove.map(p => p.id) });
        
        // ລຶບ permissions ທີລະອັນ ໂດຍຢຸດເມື່ອເກີດ error
        for (const permission of toRemove) {
          try {
            await axios.delete(`api/auth/role_permissions/${permission.id}`);
            results.success.push(`ລຶບ permission ID ${permission.id}`);
            
            // ອັບເດດ state
            this.role_permissions = this.role_permissions.filter(p => p.id !== permission.id);
            
            // ຫນ່ວງເວລາເລັກນ້ອຍເພື່ອບໍ່ໃຫ້ server ຕົກໃຈ
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error: any) {
            console.error('Failed to delete permission:', permission.id, error);
            results.failed.push(`ລຶບ permission ID ${permission.id}: ${error.message}`);
            
            // ຢຸດຖ້າເປັນ server error
            if (error.response?.status === 500) {
              throw new Error('Server error during deletion - stopping process');
            }
          }
        }
        
        // ເພີ່ມ permissions ທີລະອັນ ໂດຍຢຸດເມື່ອເກີດ error ທີ່ຮ້າຍແຮງ
        for (const subId of toAdd) {
          try {
            // ກວດສອບອີກຄັ້ງວ່າມີແລ້ວຫຼືບໍ່
            const exists = this.role_permissions.some(p => 
              p.role_id === roleId && p.sub_id === subId
            );
            
            if (exists) {
              results.success.push(`Permission ສຳລັບ submenu ${subId} ມີຢູ່ແລ້ວ`);
              continue;
            }
            
            const response = await axios.post<RolePermission>('api/auth/role_permissions', { 
              role_id: roleId, 
              sub_id: subId 
            });
            
            if (response.status === 201 && response.data) {
              this.role_permissions.push(response.data);
              results.success.push(`ເພີ່ມ permission ສຳລັບ submenu ${subId}`);
            }
            
            // ຫນ່ວງເວລາເລັກນ້ອຍ
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error: any) {
            console.error('Failed to add permission for subId:', subId, error);
            
            if (error.response?.status === 409 || error.response?.status === 400) {
              results.success.push(`Permission ສຳລັບ submenu ${subId} ມີຢູ່ແລ້ວ`);
            } else if (error.response?.status === 500) {
              results.failed.push(`ເພີ່ມ permission ສຳລັບ submenu ${subId}: Server error`);
              throw new Error('Server error during creation - stopping process');
            } else {
              results.failed.push(`ເພີ່ມ permission ສຳລັບ submenu ${subId}: ${error.message}`);
            }
          }
        }
        
        // ສະແດງຜົນລັບ
        if (results.failed.length === 0) {
          await CallSwal({
            title: "ສຳເລັດ",
            text: `ອັບເດດສິດການເຂົ້າເຖິງສຳເລັດທັງໝົດ (${results.success.length}/${results.total})`,
            icon: "success",
            timer: 2000
          });
          return true;
        } else if (results.success.length > 0) {
          await CallSwal({
            title: "ສຳເລັດບາງສ່ວນ",
            html: `
              <div style="text-align: left;">
                <p><strong>ສຳເລັດ:</strong> ${results.success.length} ລາຍການ</p>
                <p><strong>ລົ້ມເຫຼວ:</strong> ${results.failed.length} ລາຍການ</p>
                <hr>
                <small>${results.failed.slice(0, 3).join('<br>')}</small>
                ${results.failed.length > 3 ? '<br><small>...</small>' : ''}
              </div>
            `,
            icon: "warning",
            width: 500
          });
          return true;
        } else {
          throw new Error('ທຸກການດຳເນີນການລົ້ມເຫຼວ');
        }
        
      } catch (error: any) {
        console.error("Error in safe bulk update:", error);
        
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດຮ້າຍແຮງ",
          html: `
            <p>${error.message}</p>
            <hr>
            <small>ສຳເລັດ: ${results.success.length} ລາຍການ<br>
            ລົ້ມເຫຼວ: ${results.failed.length} ລາຍການ</small>
          `,
          icon: "error"
        });
        
        return false;
      } finally {
        this.isloading = false;
      }
    },
  },

  getters: {
    // ດຶງ permissions ຂອງ role ສະເພາະ
    getPermissionsByRole: (state) => (roleId: number) => {
      return state.role_permissions.filter(p => p.role_id === roleId);
    },

    // ດຶງ sub menu IDs ທີ່ role ມີສິດເຂົ້າເຖິງ
    getSubMenuIdsByRole: (state) => (roleId: number) => {
      return state.role_permissions
        .filter(p => p.role_id === roleId)
        .map(p => p.sub_id);
    },

    // ກວດສອບວ່າ role ມີສິດເຂົ້າເຖິງ sub menu ຫຼືບໍ່
    hasPermission: (state) => (roleId: number, subId: number) => {
      return state.role_permissions.some(p => p.role_id === roleId && p.sub_id === subId);
    },

    // ສະຖິຕິຂໍ້ມູນ
    getStats: (state) => {
      const totalPermissions = state.role_permissions.length;
      const uniqueRoles = new Set(state.role_permissions.map(p => p.role_id)).size;
      const uniqueSubMenus = new Set(state.role_permissions.map(p => p.sub_id)).size;
      
      return {
        totalPermissions,
        uniqueRoles,
        uniqueSubMenus,
        totalRoles: state.roles.length,
        totalSubMenus: state.sub_menus.length
      };
    },

    // ດຶງ role ທີ່ມີ permissions ຫຼາຍທີ່ສຸດ
    getMostPermissiveRole: (state) => {
      const roleCounts = state.role_permissions.reduce((acc, permission) => {
        acc[permission.role_id] = (acc[permission.role_id] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const maxRoleId = Object.keys(roleCounts).reduce((a, b) => 
        roleCounts[parseInt(a)] > roleCounts[parseInt(b)] ? a : b
      );

      return state.roles.find(role => role.id === parseInt(maxRoleId));
    },

    // ດຶງ sub menus ທີ່ບໍ່ໄດ້ກຳນົດສິດໃຫ້ໃຜ
    getUnassignedSubMenus: (state) => {
      const assignedSubIds = new Set(state.role_permissions.map(p => p.sub_id));
      return state.sub_menus.filter(menu => !assignedSubIds.has(menu.sub_id));
    },

    // ດຶງ roles ທີ່ບໍ່ມີສິດເລີຍ
    getRolesWithoutPermissions: (state) => {
      const rolesWithPermissions = new Set(state.role_permissions.map(p => p.role_id));
      return state.roles.filter(role => !rolesWithPermissions.has(role.id));
    },

    // ດຶງຂໍ້ມູນ role ພ້ອມຈຳນວນ permissions
    getRolesWithPermissionCount: (state) => {
      return state.roles.map(role => {
        const permissionCount = state.role_permissions.filter(p => p.role_id === role.id).length;
        return {
          ...role,
          permissionCount
        };
      });
    }
  }
});