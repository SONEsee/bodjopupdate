export interface GetDistrictResponse {
  error: null;
  items: GetDistrictResponseItem[];
  status: number;
  timestamp: string;
}

export interface GetDistrictResponseItem {
  id: number;
  province_id: number;
  dr_name: string;
  dr_name_en: string;
}
