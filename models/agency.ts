import type { GetIdentitiesResponse } from "./identities";

export interface IdentitiesAgency {
  type: string;
  identity_no: string;
  file: File;
}

export interface GetAgencyResponse {
  error: null;
  items: GetAgencyResponseItems;
  status: number;
  timestamp: string;
}

export interface GetAgencyDetailResponse {
  error: null;
  items: GetDetailAgencyResponse | null;
  status: number;
  timestamp: string;
}

export interface GetAgencyResponseItems {
  list_data: GetAgencyResponseItemsListData[];
  pagination: Pagination;
}

export interface GetAgencyResponseItemsListData {
  id: string;
  agent_code: string;
  village_id: number;
  fullname: string;
  nick_name: string;
  phone_number: string;
  agent_type: string;
  created_at: Date;
  updated_at: Date;
  created_by_user_id: string;
  role: string;
  status: number;
  money_outstanding: number;
  gender: number;
  image_profile: string;
  username: string;
  village: Village;
}

export interface GetDetailAgencyResponse {
  id: string;
  agent_code: string;
  village_id: number | null;
  fullname: string;
  nick_name: string;
  phone_number: string;
  agent_type: string;
  created_at: Date;
  updated_at: Date;
  created_by_user_id: string;
  role: string;
  status: number;
  money_outstanding: number;
  gender: number;
  image_profile: string | File;
  username: string;
  village: Village;
  user_identities: GetIdentitiesResponse[];
}

export interface Pagination {
  current_page: number;
  limit: number;
  total_count: number;
  total_page: number;
}

export interface Village {
  id: number;
  vill_name: string;
  vill_name_en: string;
  district_id: number | null;
  district: District;
}

export interface District {
  id: number;
  dr_name: string;
  dr_name_en: string;
  province_id: number;
  province: Province;
}

export interface Province {
  id: number;
  pr_name: string;
  pr_name_en: string;
}
