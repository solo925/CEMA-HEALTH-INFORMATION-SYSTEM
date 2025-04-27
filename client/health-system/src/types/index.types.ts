import { Client, Program } from "./client.types";

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }


export interface ClientsState {
    clients: Client[];
    selectedClient: Client | null;
    isLoading: boolean;
    error: string | null;
  }


export interface ProgramsState {
    programs: Program[];
    selectedProgram: Program | null;
    isLoading: boolean;
    error: string | null;
  }

  export interface UiState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
  }
  
  export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    read: boolean;
    timestamp: number;
  }

export  interface statCards{
    title:string;
    value:number;
    icon:any;
    color:string;
  
  }