export interface Positoin{
    items: PositoinRespons[];
}
export interface PositoinRespons {
    position_id:   number;
    position_name: string;
    salary_rate:   string;
    ot_rate:       string;
    createdAt:     Date;
    updatedAt:     Date;
}