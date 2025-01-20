export interface ExpenseCreateResponse {
  error: null;
  items: Items;
  status: number;
  timestamp: string;
}

export interface Items {
  list_data: ListDatum[];
  pagination: Pagination;
}

export interface ListDatum {
  id: string;
  name: string;
  name_en: string;
  created_at: Date;
  updated_at: Date;
  created_by_user_id: string;
  delete_by_user_id: string;
  status: number;
  user: User;
}

export interface User {
  id: string;
  agent_code: string;
  fullname: string;
  nick_name: string;
}

export interface Pagination {
  current_page: number;
  limit: number;
  total_count: number;
  total_page: number;
}

export interface ExpenseDetailResponse {
  error: null;
  items: ExpenseDetailResponseItems;
  status: number;
  timestamp: string;
}

export interface ExpenseDetailResponseItems {
  id: string;
  name: string;
  name_en: string;
  created_at: Date;
  updated_at: Date;
  created_by_user_id: string;
  delete_by_user_id: string;
  status: number;
  user: User;
}

export interface User {
  id: string;
  agent_code: string;
  fullname: string;
  nick_name: string;
}
