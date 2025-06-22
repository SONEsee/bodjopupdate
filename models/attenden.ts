export interface AttendancesRespons {
    attendance_id:  number;
    employee_id:    number;
    check_in_time:  string;
    check_out_time: null;
    date:           Date;
    late:           boolean;
    penalty_amount: string;
    createdAt:      Date;
    updatedAt:      Date;
    employee:       Employee;
}

export interface Employee {
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
