export interface Program {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'completed' | 'planned';
    capacity?: number;
    enrolledClients: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProgramFormData {
    name: string;
    description: string;
    startDate: string;
    endDate?: string|null;
    status: 'active' | 'completed' | 'planned';
    capacity?: number;
  }