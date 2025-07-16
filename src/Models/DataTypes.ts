export interface USER_DATA{
    id: string;
    email: string;
    password: string;
    fullName: string;
    Role: "ADMIN" | "USER",
    status: 'Active' | 'Disabled',
}