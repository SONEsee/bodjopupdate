export interface ResponeSchedules{
    item:ResponeSchedulesItem
}
export interface ResponeSchedulesItem {
    scheduleID: number;
    shiftStart: string;
    shiftEnd:   string;
    createdAt:  Date;
    updatedAt:  Date;
}
export interface ResponeSchedulesDetail {
    schedule_id: number;
    shift_start: string;
    shift_end:   string;
    createdAt:   Date;
    updatedAt:   Date;
}
