export interface ResponeSchedules{
    item:ResponeSchedulesItem
}
export interface ResponeSchedulesItem {
    schedule_id: number;
    work_shift:  string;
    shift_start: string;
    shift_end:   string;
    createdAt:   Date;
    updatedAt:   Date;
}
export interface ResponeSchedulesDetail {
    schedule_id: number;
    work_shift:  string;
    shift_start: string;
    shift_end:   string;
    createdAt:   Date;
    updatedAt:   Date;
}
