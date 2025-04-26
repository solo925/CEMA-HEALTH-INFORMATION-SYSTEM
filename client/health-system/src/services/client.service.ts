import { apiService } from './api';
import { API_PATHS } from '../constants/apiPaths';
import { Client } from '../types/client.types';

export const clientService = {
  async getClients(): Promise<Client[]> {
    const response = await apiService.get<{results: Client[]}>(API_PATHS.CLIENTS.BASE);
    return response.results;
  },
  
  async getClientById(id: string): Promise<Client> {
    return apiService.get<Client>(API_PATHS.CLIENTS.DETAIL(id));
  },
  
  async createClient(data: Omit<Client, 'id' | 'programs' | 'registrationDate'>): Promise<Client> {
    return apiService.post<Client>(API_PATHS.CLIENTS.BASE, data);
  },
  
  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    return apiService.patch<Client>(API_PATHS.CLIENTS.DETAIL(id), data);
  },
  
  async searchClients(query: string): Promise<Client[]> {
    const response = await apiService.get<Client[]>(
      `${API_PATHS.CLIENTS.SEARCH}?query=${encodeURIComponent(query)}`
    );
    return response;
  },
  
  async enrollInProgram(clientId: string, programId: string): Promise<any> {
    return apiService.post(API_PATHS.CLIENTS.ENROLL(clientId), { program_id: programId });
  },
};