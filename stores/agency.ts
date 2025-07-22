import { AgencyModel } from "@/models";
import axios from "@/helpers/axios";
export const UseAgencyStore = defineStore("agency", {
  state() {
    return {
      form_create_data: {
        fullname: null as string | null,
        nick_name: null as string | null,
        phone_number: null as string | null,
        agency_code: null as string | null,
        agency_type: null as string | null,
        province_id: null,
        district_id: null,
        village_id: null,
        username: null as string | null,
        password: null as string | null,
        confirm_password: null as string | null,
        status: null,
        profile_image: null as File | null,
        identities: [] as AgencyModel.IdentitiesAgency[],
      },

      identity_request: {
        id: null as string | null,
        type: null as number | null,
        dialog: false,
        identity_no: null as string | null,
        file: null as File | null,
      },

      request_query_data: {
        q: null as string | null,
        limit: 20,
        page: 1,
        loading: false,
      },

      response_query_data: null as AgencyModel.GetAgencyResponseItems | null,
      response_detail_query_data:
        null as AgencyModel.GetDetailAgencyResponse | null,
    };
  },

  actions: {
    async GetListData() {
      try {
        this.request_query_data.loading = true;
        const res = await axios.get<AgencyModel.GetAgencyResponse>(
          "/api/v1/agency/get-data",
          {
            params: {
              ...this.request_query_data,
            },
          }
        );
        if (res.status === 200) {
          this.response_query_data = res.data.items;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.request_query_data.loading = false;
      }
    },

    async GetDetailAgencyData(id: string | null) {
      try {
        if (id === null || id == "") {
          return;
        }

        const res = await axios.get<AgencyModel.GetAgencyDetailResponse>(
          `/api/v1/agency/get-detail/${id}`
        );
        if (res.status === 200) {
          this.response_detail_query_data = res.data.items;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async onGetAndEditAgency(id: string | null) {
      const globalStore = UseGlobalStore();
      try {
        globalStore.loading_overlay = true;
        await this.GetDetailAgencyData(id);

        let item = this.response_detail_query_data;
        if (item != null) {
          const globalStore = UseGlobalStore();
          const provinceID = item?.village?.district?.province_id ?? null;
          const districtId = item?.village?.district_id ?? null;
          await globalStore.GetVillagesData(
            districtId?.toString() ?? null,
            null
          );
          await globalStore?.GetDistrictData(provinceID, null);
          if (
            item.image_profile !== null &&
            item.image_profile != "" &&
            item.image_profile != "N/A"
          ) {
            item.image_profile = await globalStore.GetFileData(
              item.image_profile
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        globalStore.loading_overlay = false;
      }
    },

    onCloseDialogIdentities() {
      let obj = {
        id: null,
        type: null,
        dialog: false,
        identity_no: null,
        file: null,
      };

      Object.assign(this.identity_request, obj);
    },

    async OndeleteAgency(id: string): Promise<string | Error> {
      const globalStore = UseGlobalStore();
      try {
        const notification = await CallSwal({
          icon: "warning",
          title: "ຄຳເຕືອນ",
          text: `ທ່ານກຳລັງລົບຂໍ້ມູນທ່ານແນ່ໃຈແລ້ວບໍ່?`,
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (notification.isConfirmed) {
          globalStore.loading_overlay = true;
          const res = await axios.delete(`/api/v1/users/delete/${id}`);
          if (res.status === 200) {
            return id;
          }
        }

        return "";
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
