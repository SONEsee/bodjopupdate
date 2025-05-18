export interface UserListRespons {
    success: boolean;
    data: Data;
}

export interface Data {
    users: User[];
    pagination: Pagination;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: string;
    employee_id: number;
    profile_image: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date | null;
}