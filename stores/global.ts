import axios from "@/helpers/axios";
import notfoundImage from "@/assets/img/404.png";
import { ProvinceModel, DistrictModel, VillageModel } from "@/models/";

export const UseGlobalStore = defineStore("global", {
  state() {
    return {
      count: 1,
      provinces: [] as ProvinceModel.GetProvinceResponseItem[],
      districts: [] as DistrictModel.GetDistrictResponseItem[],
      villages: [] as VillageModel.GetVillageResponseItem[],
      loading_overlay: false,
    };
  },
  actions: {
    async GetProvinceData() {
      try {
        const res = await axios.get<ProvinceModel.GetProvinceResponse>(
          "/api/v1/provinces/get-data"
        );
        if (res.status === 200) {
          this.provinces = res.data.items;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async GetDistrictData(province_id: number | null, q: string | null) {
      try {
        if (province_id === null) {
          return;
        }

        const res = await axios.get<DistrictModel.GetDistrictResponse>(
          "/api/v1/districts/get-data",
          {
            params: {
              province_id: province_id,
              q: q,
            },
          }
        );
        if (res.status === 200) {
          this.districts = res.data.items;
        }
      } catch (error) {
        console.error(error);
      }
    },

    debouncedGetDistricts: useDebounceFn(async function (
      this: any,
      query: string | null,
      provinceId: number | null
    ) {
      if (provinceId === null) return;
      await this.GetDistrictData(provinceId, query);
    },
    1000),

    async GetVillagesData(district_id: string | null, q: string | null) {
      try {
        if (district_id === null) {
          return;
        }

        const res = await axios.get<VillageModel.GetVillageResponse>(
          "/api/v1/villages/get-data",
          {
            params: {
              district_id: district_id,
              q: q,
            },
          }
        );
        if (res.status === 200) {
          this.villages = res.data.items;
        }
      } catch (error) {
        console.error(error);
      }
    },

    DebounceGetVillages: useDebounceFn(async function (
      this: any,
      district_id: string | null,
      query: string | null
    ) {
      if (district_id === null) return;
      await this.GetVillagesData(district_id, query);
    }),

    async GetFileData(fileLink: string | File) {
      try {
        if (!fileLink) {
          return "";
        }

        if (typeof fileLink === "object") {
          return URL.createObjectURL(fileLink) ?? "";
        }
        const res = await axios.get(fileLink, {
          responseType: "blob", 
        });
        // const res = await axios.get("", {
        //   params: {
        //     q: fileLink,
        //   },
        //   responseType: "blob",
        // });

        if (res.status === 200) {
          return URL.createObjectURL(res.data);
        }
        return notfoundImage;
      } catch (error) {
        console.error(error);
        return notfoundImage;
      }
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(UseGlobalStore, import.meta.hot));
}
