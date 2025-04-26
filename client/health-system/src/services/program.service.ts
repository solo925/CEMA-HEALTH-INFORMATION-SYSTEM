import { apiService } from './api';
import { API_PATHS } from '../constants/apiPaths';
import { Program } from '../types/program.types';
import { Client } from '../types/client.types';

export const programService = {
  async getPrograms(): Promise<Program[]> {
    const response = await apiService.get<{results: Program[]}>(API_PATHS.PROGRAMS.BASE);
    return response.results;
  },
  
  async getProgramById(id: string): Promise<Program> {
    return apiService.get<Program>(API_PATHS.PROGRAMS.DETAIL(id));
  },
  
  async createProgram(data: Omit<Program, 'id' | 'enrolledClients' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    return apiService.post<Program>(API_PATHS.PROGRAMS.BASE, data);
  },
  
  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    return apiService.patch<Program>(API_PATHS.PROGRAMS.DETAIL(id), data);
  },
  
  async getProgramClients(programId: string): Promise<Client[]> {
    const response = await apiService.get<{results: Client[]}>(
      `${API_PATHS.PROGRAMS.DETAIL(programId)}/clients/`
    );
    return response.results;
  }
};