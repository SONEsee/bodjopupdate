export interface Positoin{
    items: PositoinRespons[];
}
export interface PositoinRespons {
    position_id:   number;
    position_name: string;
    base_sal_id:   string;
    rate_ot:       string;
    createdAt:     Date;
    updatedAt:     Date;
}