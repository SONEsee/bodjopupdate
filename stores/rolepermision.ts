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

      // ຂໍ້ມູນຟອມສຳລັບການສ້າງ/ແກ້ໄຂ
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
        const res = await axios.get<RolePermission[]>(
          "api/auth/role_permissions"
        );
        if (res.status === 200) {
          this.role_permissions = res.data;
        }
      } catch (error) {
        console.error("ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິດການເຂົ້າເຖິງ:", error);
      } finally {
        this.isloading = false;
      }
    },

    // ດຶງຂໍ້ມູນ roles ທັງໝົດ
    async getRoles() {
      this.isloading = true;
      try {
        const res = await axios.get<Role[]>("api/auth/role");
        if (res.status === 200) {
          this.roles = res.data;
        }
      } catch (error) {
        console.error("ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນບົດບາດ:", error);
      } finally {
        this.isloading = false;
      }
    },

    // ດຶງຂໍ້ມູນ sub menus ທັງໝົດ
    async getSubMenus() {
      this.isloading = true;
      try {
        const res = await axios.get<SubMenu[]>("api/auth/sub_menus");
        if (res.status === 200) {
          this.sub_menus = res.data;
        }
      } catch (error) {
        console.error("ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນເມນູຍ່ອຍ:", error);
      } finally {
        this.isloading = false;
      }
    },

    // ດຶງ permissions ຂອງ role ສະເພາະ
    async getRolePermissionsByRole(roleId: number) {
      this.isloading = true;
      try {
        const res = await axios.get<RolePermission[]>(
          `api/auth/role_permissions?role_id=${roleId}`
        );
        if (res.status === 200) {
          return res.data;
        }
        return [];
      } catch (error) {
        console.error("ຂໍ້ຜິດພາດໃນການດຶງສິດການເຂົ້າເຖິງຂອງບົດບາດ:", error);
        return [];
      } finally {
        this.isloading = false;
      }
    },

    async createRolePermission(roleId: number, subId: number) {
      this.isloading = true;
      try {
        const numericRoleId =
          typeof roleId === "string" ? parseInt(roleId) : roleId;
        const numericSubId =
          typeof subId === "string" ? parseInt(subId) : subId;

        if (isNaN(numericRoleId) || isNaN(numericSubId)) {
          throw new Error(
            `ປະເພດຂໍ້ມູນບໍ່ຖືກຕ້ອງ: roleId=${roleId} (${typeof roleId}), subId=${subId} (${typeof subId})`
          );
        }

        console.log("roleId ຕົ້ນຕໍ:", roleId, typeof roleId);
        console.log("subId ຕົ້ນຕໍ:", subId, typeof subId);
        console.log("roleId ທີ່ແປງແລ້ວ:", numericRoleId, typeof numericRoleId);
        console.log("subId ທີ່ແປງແລ້ວ:", numericSubId, typeof numericSubId);

        const exists = this.role_permissions.some(
          (p) => p.role_id === numericRoleId && p.sub_id === numericSubId
        );

        if (exists) {
          console.log("ສິດການເຂົ້າເຖິງນີ້ມີຢູ່ແລ້ວ, ຂ້າມ...", {
            roleId: numericRoleId,
            subId: numericSubId,
          });
          return null;
        }

        const data = {
          role_id: numericRoleId, 
          sub_id: numericSubId, 
        };

        console.log("ສ້າງສິດການເຂົ້າເຖິງດ້ວຍຂໍ້ມູນ:", data);

        const res = await axios.post<RolePermission>(
          "api/auth/role_permissions",
          data
        );

        if (res.status === 201 && res.data) {
          // ເພີ່ມ permission ໃໝ່ໃສ່ state ໂດຍກົງ
          this.role_permissions.push(res.data);
          console.log("ສ້າງສິດການເຂົ້າເຖິງສຳເລັດ:", res.data);
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.error("ຂໍ້ຜິດພາດໃນການສ້າງສິດການເຂົ້າເຖິງ:", error);

        // ບັນທຶກຂໍ້ມູນຂໍ້ຜິດພາດລະອຽດ
        if (error.response) {
          console.error("ຂໍ້ມູນຕອບກັບຂໍ້ຜິດພາດ:", error.response.data);
          console.error("ສະຖານະຂໍ້ຜິດພາດ:", error.response.status);
        }

        // ກວດສອບວ່າເປັນ permission ທີ່ມີຢູ່ແລ້ວຫຼືບໍ່
        if (error.response?.status === 409 || error.response?.status === 400) {
          console.log("ສິດການເຂົ້າເຖິງມີຢູ່ແລ້ວ (ຈາກເຊີເວີ):", {
            roleId,
            subId,
          });
          return null; // ບໍ່ສະແດງຂໍ້ຜິດພາດສຳລັບການຊ້ຳກັນ
        } else if (error.response?.status === 500) {
          // ຂໍ້ຜິດພາດຂອງເຊີເວີ - ອາດຈະເປັນການລະເມີດຂໍ້ຈຳກັດ
          console.error("ຂໍ້ຜິດພາດຂອງເຊີເວີເມື່ອສ້າງສິດການເຂົ້າເຖິງ:", {
            roleId,
            subId,
          });
          throw new Error(
            `ຂໍ້ຜິດພາດຂອງເຊີເວີໃນການສ້າງສິດການເຂົ້າເຖິງສຳລັບບົດບາດ ${roleId}, ເມນູຍ່ອຍ ${subId}: ${
              error.response?.data?.message || error.message
            }`
          );
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
            this.role_permissions = this.role_permissions.filter(
              (p) => p.id !== id
            );

            await CallSwal({
              title: "ສຳເລັດ",
              text: "ລຶບສິດການເຂົ້າເຖິງສຳເລັດ",
              icon: "success",
              timer: 2000,
            });

            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("ຂໍ້ຜິດພາດໃນການລຶບສິດການເຂົ້າເຖິງ:", error);
        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: "ບໍ່ສາມາດລຶບສິດການເຂົ້າເຖິງໄດ້",
          icon: "error",
        });
        return false;
      } finally {
        this.isloading = false;
      }
    },

    // ບັນທຶກຫຼາຍ permissions ພ້ອມກັນ (ແກ້ໄຂບັນຫາ data type)
    async bulkUpdateRolePermissions(roleId: number, subMenuIds: number[]) {
      this.isloading = true;
      try {
        // ✅ ສຳຄັນຫຼາຍ: ກວດສອບແລະແປງປະເພດຂໍ້ມູນ
        const numericRoleId =
          typeof roleId === "string" ? parseInt(roleId) : roleId;
        const numericSubMenuIds = subMenuIds.map((id) =>
          typeof id === "string" ? parseInt(id) : id
        );

        if (isNaN(numericRoleId)) {
          throw new Error(`roleId ບໍ່ຖືກຕ້ອງ: ${roleId} (${typeof roleId})`);
        }

        if (numericSubMenuIds.some((id) => isNaN(id))) {
          throw new Error(
            `subMenuIds ບໍ່ຖືກຕ້ອງ: ${subMenuIds} ມີຄ່າທີ່ບໍ່ແມ່ນຕົວເລກ`
          );
        }

        console.log(
          "ເລີ່ມຕົ້ນການອັບເດດຫຼາຍອັນສຳລັບບົດບາດ:",
          numericRoleId,
          "ດ້ວຍ subMenuIds:",
          numericSubMenuIds
        );
        console.log("ປະເພດ roleId ຕົ້ນຕໍ:", typeof roleId, "ຄ່າ:", roleId);

        // 1. ດຶງ permissions ປັດຈຸບັນຂອງບົດບາດນີ້
        const currentPermissions = this.role_permissions.filter(
          (p) => p.role_id === numericRoleId
        );
        const currentSubIds = currentPermissions.map((p) => p.sub_id);

        console.log("ສິດການເຂົ້າເຖິງປັດຈຸບັນ:", currentSubIds);

        // 2. ຄຳນວນສິ່ງທີ່ຕ້ອງເພີ່ມແລະລຶບ
        const toAdd = numericSubMenuIds.filter(
          (subId) => !currentSubIds.includes(subId)
        );
        const toRemove = currentPermissions.filter(
          (p) => !numericSubMenuIds.includes(p.sub_id)
        );

        console.log("ຕ້ອງເພີ່ມ:", toAdd);
        console.log(
          "ຕ້ອງລຶບ:",
          toRemove.map((p) => p.id)
        );

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // 3. ລຶບ permissions ທີ່ບໍ່ຕ້ອງການ (ທີລະອັນ)
        for (const permission of toRemove) {
          try {
            await axios.delete(`api/auth/role_permissions/${permission.id}`);
            // ອັບເດດ state ໂດຍກົງ
            this.role_permissions = this.role_permissions.filter(
              (p) => p.id !== permission.id
            );
            console.log("ລຶບສິດການເຂົ້າເຖິງ:", permission.id);
            successCount++;
          } catch (deleteError) {
            console.error(
              "ຂໍ້ຜິດພາດໃນການລຶບສິດການເຂົ້າເຖິງ:",
              permission.id,
              deleteError
            );
            errorCount++;
            errors.push(`ລຶບສິດການເຂົ້າເຖິງ ID ${permission.id} ບໍ່ໄດ້`);
          }
        }

        // 4. ເພີ່ມ permissions ໃໝ່ (ທີລະອັນ) ແບບປອດໄພ - ໃຊ້ຕົວເລກ
        for (const subId of toAdd) {
          try {
            const result = await this.createRolePermission(
              numericRoleId,
              subId
            );
            if (result) {
              console.log("ເພີ່ມສິດການເຂົ້າເຖິງ:", result);
              successCount++;
            } else {
              console.log(
                "ສິດການເຂົ້າເຖິງມີຢູ່ແລ້ວຫຼືສ້າງບໍ່ສຳເລັດ:",
                subId
              );
            }
          } catch (addError: any) {
            console.error(
              "ຂໍ້ຜິດພາດໃນການເພີ່ມສິດການເຂົ້າເຖິງສຳລັບ subId:",
              subId,
              addError
            );
            errorCount++;
            errors.push(
              `ເພີ່ມສິດການເຂົ້າເຖິງສຳລັບເມນູຍ່ອຍ ${subId} ບໍ່ໄດ້: ${addError.message}`
            );
          }
        }

        // 5. ສະແດງຜົນ
        if (errorCount === 0) {
          await CallSwal({
            title: "ສຳເລັດ",
            text: `ອັບເດດສິດການເຂົ້າເຖິງສຳເລັດ (ດຳເນີນການ ${successCount} ລາຍການ)`,
            icon: "success",
            timer: 2000,
          });
          return true;
        } else if (successCount > 0) {
          await CallSwal({
            title: "ສຳເລັດບາງສ່ວນ",
            html: `ສຳເລັດ: ${successCount} ລາຍການ<br>ລົ້ມເຫຼວ: ${errorCount} ລາຍການ<br><br>ລາຍລະອຽດ:<br>${errors.join(
              "<br>"
            )}`,
            icon: "warning",
          });
          return true;
        } else {
          throw new Error("ທຸກການດຳເນີນການລົ້ມເຫຼວ");
        }
      } catch (error: any) {
        console.error("ຂໍ້ຜິດພາດໃນການອັບເດດສິດການເຂົ້າເຖິງຫຼາຍອັນ:", error);

        // ໂຫຼດຂໍ້ມູນໃໝ່ເພື່ອຮັບປະກັນຄວາມຖືກຕ້ອງ
        console.log("ກຳລັງໂຫຼດຂໍ້ມູນສິດການເຂົ້າເຖິງໃໝ່ເນື່ອງຈາກມີຂໍ້ຜິດພາດ...");
        await this.getRolePermissions();

        let errorMessage = "ບໍ່ສາມາດອັບເດດສິດການເຂົ້າເຖິງໄດ້";

        if (error.response?.status === 500) {
          errorMessage = "ເກີດຂໍ້ຜິດພາດໃນເຊີເວີ ອາດມີບັນຫາກັບຖານຂໍ້ມູນ";
        } else if (error.response?.status === 404) {
          errorMessage = "ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ";
        } else if (error.code === "NETWORK_ERROR") {
          errorMessage = "ບັນຫາການເຊື່ອມຕໍ່ເຄືອຂ່າຍ";
        } else if (error.message) {
          errorMessage = error.message;
        }

        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: errorMessage,
          icon: "error",
        });

        return false;
      } finally {
        this.isloading = false;
      }
    },

    // ໂຫຼດຂໍ້ມູນທັງໝົດ
    async loadAllData() {
      await Promise.all([
        this.getRoles(),
        this.getSubMenus(),
        this.getRolePermissions(),
      ]);
    },

    // ຟັງຊັນຊ່ວຍເຫຼືອເພີ່ມເຕີມ

    // ເພີ່ມ permission ດຽວ (ສຳລັບການໃຊ້ງານໃນ UI)
    async addSinglePermission(roleId: number, subId: number) {
      // ກວດສອບວ່າມີ permission ນີ້ຢູ່ແລ້ວຫຼືບໍ່
      const exists = this.role_permissions.some(
        (p) => p.role_id === roleId && p.sub_id === subId
      );

      if (exists) {
        await CallSwal({
          title: "ເຕືອນ",
          text: "ສິດການເຂົ້າເຖິງນີ້ມີຢູ່ແລ້ວ",
          icon: "warning",
          timer: 2000,
        });
        return false;
      }

      return await this.createRolePermission(roleId, subId);
    },

    // ລຶບ permission ໂດຍ role_id ແລະ sub_id
    async removeSinglePermission(roleId: number, subId: number) {
      const permission = this.role_permissions.find(
        (p) => p.role_id === roleId && p.sub_id === subId
      );

      if (permission) {
        return await this.deleteRolePermission(permission.id);
      }

      return false;
    },

    // Toggle permission (ເພີ່ມຖ້າບໍ່ມີ, ລຶບຖ້າມີ)
    async togglePermission(roleId: number, subId: number) {
      const exists = this.role_permissions.some(
        (p) => p.role_id === roleId && p.sub_id === subId
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
        total: 0,
      };

      try {
        console.log("ໃຊ້ວິທີການອັບເດດຫຼາຍອັນທີ່ປອດໄພສຳລັບບົດບາດ:", roleId);

        // ດຶງຂໍ້ມູນລ່າສຸດຈາກເຊີເວີກ່ອນ
        await this.getRolePermissions();

        const currentPermissions = this.role_permissions.filter(
          (p) => p.role_id === roleId
        );
        const currentSubIds = currentPermissions.map((p) => p.sub_id);

        // ຄຳນວນສິ່ງທີ່ຕ້ອງປ່ຽນ
        const toAdd = subMenuIds.filter(
          (subId) => !currentSubIds.includes(subId)
        );
        const toRemove = currentPermissions.filter(
          (p) => !subMenuIds.includes(p.sub_id)
        );

        results.total = toAdd.length + toRemove.length;

        console.log("ແຜນການອັບເດດທີ່ປອດໄພ:", {
          toAdd,
          toRemove: toRemove.map((p) => p.id),
        });

        // ລຶບ permissions ທີລະອັນ ໂດຍຢຸດເມື່ອເກີດຂໍ້ຜິດພາດ
        for (const permission of toRemove) {
          try {
            await axios.delete(`api/auth/role_permissions/${permission.id}`);
            results.success.push(`ລຶບສິດການເຂົ້າເຖິງ ID ${permission.id}`);

            // ອັບເດດ state
            this.role_permissions = this.role_permissions.filter(
              (p) => p.id !== permission.id
            );

            // ຫນ່ວງເວລາເລັກນ້ອຍເພື່ອບໍ່ໃຫ້ເຊີເວີຕົກໃຈ
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error: any) {
            console.error("ລົ້ມເຫຼວໃນການລຶບສິດການເຂົ້າເຖິງ:", permission.id, error);
            results.failed.push(
              `ລຶບສິດການເຂົ້າເຖິງ ID ${permission.id}: ${error.message}`
            );

            // ຢຸດຖ້າເປັນຂໍ້ຜິດພາດຂອງເຊີເວີ
            if (error.response?.status === 500) {
              throw new Error(
                "ຂໍ້ຜິດພາດຂອງເຊີເວີລະຫວ່າງການລຶບ - ຢຸດຂະບວນການ"
              );
            }
          }
        }

        // ເພີ່ມ permissions ທີລະອັນ ໂດຍຢຸດເມື່ອເກີດຂໍ້ຜິດພາດທີ່ຮ້າຍແຮງ
        for (const subId of toAdd) {
          try {
            // ກວດສອບອີກຄັ້ງວ່າມີແລ້ວຫຼືບໍ່
            const exists = this.role_permissions.some(
              (p) => p.role_id === roleId && p.sub_id === subId
            );

            if (exists) {
              results.success.push(
                `ສິດການເຂົ້າເຖິງສຳລັບເມນູຍ່ອຍ ${subId} ມີຢູ່ແລ້ວ`
              );
              continue;
            }

            const response = await axios.post<RolePermission>(
              "api/auth/role_permissions",
              {
                role_id: roleId,
                sub_id: subId,
              }
            );

            if (response.status === 201 && response.data) {
              this.role_permissions.push(response.data);
              results.success.push(`ເພີ່ມສິດການເຂົ້າເຖິງສຳລັບເມນູຍ່ອຍ ${subId}`);
            }

            // ຫນ່ວງເວລາເລັກນ້ອຍ
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error: any) {
            console.error("ລົ້ມເຫຼວໃນການເພີ່ມສິດການເຂົ້າເຖິງສຳລັບ subId:", subId, error);

            if (
              error.response?.status === 409 ||
              error.response?.status === 400
            ) {
              results.success.push(
                `ສິດການເຂົ້າເຖິງສຳລັບເມນູຍ່ອຍ ${subId} ມີຢູ່ແລ້ວ`
              );
            } else if (error.response?.status === 500) {
              results.failed.push(
                `ເພີ່ມສິດການເຂົ້າເຖິງສຳລັບເມນູຍ່ອຍ ${subId}: ຂໍ້ຜິດພາດຂອງເຊີເວີ`
              );
              throw new Error(
                "ຂໍ້ຜິດພາດຂອງເຊີເວີລະຫວ່າງການສ້າງ - ຢຸດຂະບວນການ"
              );
            } else {
              results.failed.push(
                `ເພີ່ມສິດການເຂົ້າເຖິງສຳລັບເມນູຍ່ອຍ ${subId}: ${error.message}`
              );
            }
          }
        }

        // ສະແດງຜົນລັບ
        if (results.failed.length === 0) {
          await CallSwal({
            title: "ສຳເລັດ",
            text: `ອັບເດດສິດການເຂົ້າເຖິງສຳເລັດທັງໝົດ (${results.success.length}/${results.total})`,
            icon: "success",
            timer: 2000,
          });
          return true;
        } else if (results.success.length > 0) {
          await CallSwal({
            title: "ສຳເລັດບາງສ່ວນ",
            html: `
              <div style="text-align: left;">
                <p><strong>ສຳເລັດ:</strong> ${results.success.length} ລາຍການ</p>
                <p><strong>ລົ້ມເຫຼວ:</strong> ${
                  results.failed.length
                } ລາຍການ</p>
                <hr>
                <small>${results.failed.slice(0, 3).join("<br>")}</small>
                ${results.failed.length > 3 ? "<br><small>...</small>" : ""}
              </div>
            `,
            icon: "warning",
            width: 500,
          });
          return true;
        } else {
          throw new Error("ທຸກການດຳເນີນການລົ້ມເຫຼວ");
        }
      } catch (error: any) {
        console.error("ຂໍ້ຜິດພາດໃນການອັບເດດຫຼາຍອັນທີ່ປອດໄພ:", error);

        await CallSwal({
          title: "ເກີດຂໍ້ຜິດພາດຮ້າຍແຮງ",
          html: `
            <p>${error.message}</p>
            <hr>
            <small>ສຳເລັດ: ${results.success.length} ລາຍການ<br>
            ລົ້ມເຫຼວ: ${results.failed.length} ລາຍການ</small>
          `,
          icon: "error",
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
      return state.role_permissions.filter((p) => p.role_id === roleId);
    },

    // ດຶງ sub menu IDs ທີ່ role ມີສິດເຂົ້າເຖິງ
    getSubMenuIdsByRole: (state) => (roleId: number) => {
      return state.role_permissions
        .filter((p) => p.role_id === roleId)
        .map((p) => p.sub_id);
    },

    // ກວດສອບວ່າ role ມີສິດເຂົ້າເຖິງ sub menu ຫຼືບໍ່
    hasPermission: (state) => (roleId: number, subId: number) => {
      return state.role_permissions.some(
        (p) => p.role_id === roleId && p.sub_id === subId
      );
    },

    // ສະຖິຕິຂໍ້ມູນ
    getStats: (state) => {
      const totalPermissions = state.role_permissions.length;
      const uniqueRoles = new Set(state.role_permissions.map((p) => p.role_id))
        .size;
      const uniqueSubMenus = new Set(
        state.role_permissions.map((p) => p.sub_id)
      ).size;

      return {
        totalPermissions,
        uniqueRoles,
        uniqueSubMenus,
        totalRoles: state.roles.length,
        totalSubMenus: state.sub_menus.length,
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

      return state.roles.find((role) => role.id === parseInt(maxRoleId));
    },

    // ດຶງ sub menus ທີ່ບໍ່ໄດ້ກຳນົດສິດໃຫ້ໃຜ
    getUnassignedSubMenus: (state) => {
      const assignedSubIds = new Set(
        state.role_permissions.map((p) => p.sub_id)
      );
      return state.sub_menus.filter((menu) => !assignedSubIds.has(menu.sub_id));
    },

    // ດຶງ roles ທີ່ບໍ່ມີສິດເລີຍ
    getRolesWithoutPermissions: (state) => {
      const rolesWithPermissions = new Set(
        state.role_permissions.map((p) => p.role_id)
      );
      return state.roles.filter((role) => !rolesWithPermissions.has(role.id));
    },

    // ດຶງຂໍ້ມູນ role ພ້ອມຈຳນວນ permissions
    getRolesWithPermissionCount: (state) => {
      return state.roles.map((role) => {
        const permissionCount = state.role_permissions.filter(
          (p) => p.role_id === role.id
        ).length;
        return {
          ...role,
          permissionCount,
        };
      });
    },
  },
});
