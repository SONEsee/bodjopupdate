export interface DeviceDetailidResponse {
  error: null;
  items: DeviceDetailidResponseItems;
  status: number;
  timestamp: string;
}

export interface DeviceDetailidResponseItems {
  id: string;
  pos_no: string;
  imei: string;
  created_at: Date;
  updated_at: Date;
  created_by_user_id: string;
  create_username: string;
  create_fullname: string;
  create_nickname: string;
  status: number;
  device_locations: DeviceLocation[];
  device_transactions: any[];
}

export interface DeviceLocation {
  id: string;
  latitude: number;
  longitude: number;
  device_id: string;
  created_at: Date;
  updated_at: Date;
}
