export interface TotalOtRespons {
    status: string;
    data:   Data;
}

export interface Data {
    totalOt: string;
}
export interface OtRespons {
    special_allowance_id: number;
    employee_id:          number;
    bonus_money:          string;
    tigh_money:           string;
    food_money:           string;
    ot:                   string;
    createdAt:            Date;
    updatedAt:            Date;
    employee:             Employee;
}

export interface Employee {
    employee_id: number;
    name:        string;
    gender:      Gender;
    birthdate:   Date;
    address:     string;
    phone:       string;
    schedule_id: number;
    position_id: number;
    createdAt:   Date;
    updatedAt:   Date;
}

export type Gender = "ຍິງ" | "ຊາຍ";

export interface SalaryRespons {
    status: string;
    data:   Datum[];
}

export interface Datum {
    payroll_id:           number;
    employee_id:          number;
    special_allowance_id: number;
    base_salary:          string;
    cut_money:            string;
    net_salary:           string;
    payment_date:         Date;
    createdAt:            Date;
    updatedAt:            Date;
    employee:             Employee;
    specialAllowance:     SpecialAllowance;
}

export interface Employee {
    employee_id: number;
    name:        string;
}

export interface SpecialAllowance {
    special_allowance_id: number;
    bonus_money:          string;
    tigh_money:           string;
    food_money:           string;
    ot:                   string;
}
