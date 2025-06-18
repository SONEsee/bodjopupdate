export interface AbsentRespons {
    status: string;
    data:   Data;
}

export interface Data {
    absentDetails: AbsentDetail[];
}

export interface AbsentDetail {
    date:  string;
    count: number;
}
