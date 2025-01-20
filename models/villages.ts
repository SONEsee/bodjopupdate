export interface GetVillageResponse {
  error: null;
  items: GetVillageResponseItem[];
  status: number;
  timestamp: string;
}

export interface GetVillageResponseItem {
  id: number;
  vill_name: string;
  vill_name_en: string;
  district_id: number;
}
