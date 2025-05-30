export interface MenuMainRespons {
    totalItems:  number;
    totalPages:  number;
    currentPage: number;
    data:        Datum[];
  
}

export interface Datum {
    main_id:    number;
    name:       string;
    icon:       string;
    created_at: Date;
    updated_at: Date;
}
export interface DetailMainRespons {
    main_id:    number;
    name:       string;
    icon:       string;
    actions:    null;
    created_at: Date;
    updated_at: Date;
}
export interface SupMenuRespons {
    sub_id:  number;
    main_id: number;
    name:    string;
    url:     string;
    actions: null;
    icon:    null | string;
}