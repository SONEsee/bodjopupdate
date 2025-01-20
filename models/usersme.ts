export interface UserMeResponse {
  error: null;
  items: UserMeResponseItems;
}

export interface UserMeResponseItems {
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

export interface Village {
  id: number;
  vill_name: string;
  vill_name_en: string;
  district_id: number;
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
