import axios from "@/helpers/axios";

export const scanStore = defineStore("scan", {
  state() {
    return {
      form_scan: {
        employee_id: "",
      },
      loading: false,
      lastScanResult: null
    }
  },
  
  getters: {
    isFormValid: (state) => {
      return state.form_scan.employee_id.trim().length >= 3
    }
  },
  
  actions: {
    async scanEmployee() {
      try {
        this.loading = true
        
        // Validate employee_id before proceeding
        if (!this.form_scan.employee_id.trim()) {
          throw new Error("Employee ID is required")
        }

        const notification = await CallSwal({
          title: "ຢືນຢັນການສະແດງ",
          text: `ທ່ານຕ້ອງການສະແດງຂໍ້ມູນພະນັກງານ ${this.form_scan.employee_id} ຫຼື ບໍ່?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ຢືນຢັນ",
          cancelButtonText: "ຍົກເລີກ",
          reverseButtons: true,
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary"
          }
        })

        if (notification.isConfirmed) {
          const req = await axios.post(`/api/auth/attendances`, this.form_scan)
          
          if (req.status === 200 || req.status === 201) {
            // Store the result for future reference
            this.lastScanResult = req.data
            
            await CallSwal({
              title: "ສຳເລັດ",
              text: "ການສະແດງຂໍ້ມູນພະນັກງານ ສຳເລັດ!",
              icon: "success",
              confirmButtonText: "OK",
              customClass: {
                confirmButton: "btn btn-primary"
              }
            })
            
            // Reset the form after successful scan
            this.resetForm()
            
          } else {
            throw new Error(`Server responded with status: ${req.status}`)
          }
        }
      } catch (error: any) {
        console.error("Error scanning employee:", error)
        
        // More specific error messages
        let errorMessage = "ການສະແດງ ບໍ່ ສາມາດ!"
        
        if (error.response?.status === 404) {
          errorMessage = "ບໍ່ພົບພະນັກງານດ້ວຍ ID ນີ້"
        } else if (error.response?.status === 400) {
          errorMessage = "ຂໍ້ມູນທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງ"
        } else if (error.response?.status === 500) {
          errorMessage = "ເກີດຂໍ້ຜິດພາດຈາກເຊີບເວີ"
        }

        await CallSwal({
          title: "ບໍ່ສາມາດ",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger"
          }
        })
        
        throw error
      } finally {
        this.loading = false
      }
    },
    
    resetForm() {
      this.form_scan.employee_id = ""
    },
    
    setEmployeeId(id: string) {
      this.form_scan.employee_id = id
    }
  }
})