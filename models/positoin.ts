export interface Positoin{
    items: PositoinRespons[];
}
export interface PositoinRespons {
        position_id:   number;
    position_name: string;
    rate_ot:       string;
    base_sal_id:   number;
    createdAt:     Date;
    updatedAt:     Date;
    baseSalary:    BaseSalary;
}
export interface BaseSalary {
    base_sal_id: number;
    salary:      string;
}
export interface NgernduenRespons {
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
   
}



export interface SpecialAllowance {
    special_allowance_id: number;
    bonus_money:          string;
    tigh_money:           string;
    food_money:           string;
    ot:                   string;
}
