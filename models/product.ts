export interface ProductResponse{
    error : string;
    loading: boolean;
    Items: ProductResponseItems[] | null;
}
export interface ProductResponseItems {
    id:                number;
    product_name:      string;
    category_id:       string;
    quantity_in_stock: number;
    expiry_date:       Date;
    price:             number;
    reorder_level:     number;
    barcode:           string;
    product_image: string | File | null;
    created_at:        Date;
    updated_at:        Date;
    deleted_at:        null;
    Category:          Category;
}

export interface Category {
    id:         string;
    Name:       string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
    products:   null;
}

