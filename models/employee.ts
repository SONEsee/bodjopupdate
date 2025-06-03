export interface EmployeeResponse {
  success: boolean;
  data: ResponeEmployee;
}

export interface ResponeEmployee {
    employee_id: number;
    name:        string;
    gender:      string;
    birthdate:   Date;
    address:     string;
    phone:       string;
    schedule_id: number;
    position_id: number;
    createdAt:   Date;
    updatedAt:   Date;
}
export interface ResponeDetailEmployee {
    employee_id: number;
    name:        string;
    gender:      string;
    birthdate:   Date;
    address:     string;
    phone:       string;
    schedule_id: number;
    position_id: number;
    createdAt:   Date;
    updatedAt:   Date;
    schedule:    Schedule;
    position:    Position;
}

export interface Position {
    position_id:   number;
    position_name: string;
    salary_rate:   string;
    ot_rate:       string;
    createdAt:     Date;
    updatedAt:     Date;
}

export interface Schedule {
    schedule_id: number;
    shift_start: string;
    shift_end:   string;
    createdAt:   Date;
    updatedAt:   Date;
}
