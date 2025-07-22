
export interface BaseSalaryRespons {
    base_sal_id: number;
    salary:      string;
}

export interface LateDetail {
    status: string;
    data:   Data;
}

export interface Data {
    lateDetails: LateDetail[];
}

export interface LateDetail {
    date:  string;
    count: number;
}

export interface LatefordayRespons {
    status: string;
    data:   Data;
}

export interface DataLate {
    lateToday: number;
}

export interface AbsentRespons {
    status: string;
    data:   Data;
}

export interface Data {
    absentToday: number;
}
