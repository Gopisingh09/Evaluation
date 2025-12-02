export interface NavItem {
    label: string;
    routerLink?: string;
    icon?: string;
    children?: NavItem[];
    isActive?: boolean;
  }
  
  export interface User {
    name: string;
    role: string;
    token: string;
    doctorId?: number;
    userId: number;
  }