export interface MenuRespons {
    id:       number;
    name:     string;
    children: Child[];
}

export interface Child {
    id:   number;
    name: string;
    url:  string;
}
