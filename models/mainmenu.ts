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