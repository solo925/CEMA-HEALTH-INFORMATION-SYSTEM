export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    contactNumber: string;
    email: string;
    address: string;
    emergencyContact: string;
    registrationDate: string;
    programs: EnrolledProgram[];
  }
  
  export interface EnrolledProgram {
    programId: string;
    enrollmentDate: string;
    status: 'active' | 'completed' | 'suspended';
  }
  
  export interface ClientFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    contactNumber: string;
    email: string;
    address: string;
    emergencyContact: string;
  }
  
  // types/program.types.ts
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
    endDate?: string;
    status: 'active' | 'completed' | 'planned';
    capacity?: number;
  }