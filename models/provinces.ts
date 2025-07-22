export interface GetProvinceResponse {
  error: null;
  items: GetProvinceResponseItem[];
  status: number;
  timestamp: string;
}

export interface GetProvinceResponseItem {
  id: number;
  pr_name: string;
  pr_name_en: string;
}
