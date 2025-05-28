export interface RoleRespons {
    success: boolean;
    data:    Data;
}

export interface Data {
    roles:      Role[];
    pagination: Pagination;
}

export interface Pagination {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
}

export interface Role {
    role_id:     number;
    name:        string;
    description: string;
}
export interface RoleDetailRespons {
    success: boolean;
    data:    Data;
}

export interface Data {
    role_id:     number;
    name:        string;
    description: string;
}