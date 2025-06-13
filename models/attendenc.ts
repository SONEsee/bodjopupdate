export interface AttendancResponse {
    status:  boolean;
    message: string;
    items:   AttendancResponsItems[];
}
export interface AttendancResponsItems {
    attendance_id:  number;
    employee_id:    number;
    check_in_time:  string;
    check_out_time: string;
    date:           Date;
    createdAt:      Date;
    updatedAt:      Date;
}