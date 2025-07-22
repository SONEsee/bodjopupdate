export interface CategoryRespons {
    categories: Category[];
}

export interface Category {
    DeletedAt: null;
    ID:        number;
    Name:      string;
    CreatedAt: Date;
    UpdatedAt: Date;
    Products:  null;
    loading:   boolean;
    error:     string;
}