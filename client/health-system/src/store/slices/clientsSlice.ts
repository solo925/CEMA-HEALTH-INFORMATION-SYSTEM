import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Client } from '../../types/client.types';
import { clientService } from '../../services/client.service';
import { ClientsState } from '../../types/index.types';


const initialState: ClientsState = {
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
};

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const clients = await clientService.getClients();
      return clients;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: string, { rejectWithValue }) => {
    try {
      const client = await clientService.getClientById(id);
      return client;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData: Omit<Client, 'id' | 'programs' | 'registrationDate'>, { rejectWithValue }) => {
    try {
      const client = await clientService.createClient(clientData);
      return client;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }: { id: string; data: Partial<Client> }, { rejectWithValue }) => {
    try {
      const client = await clientService.updateClient(id, data);
      return client;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enrollClientInProgram = createAsyncThunk(
  'clients/enrollInProgram',
  async ({ clientId, programId }: { clientId: string; programId: string }, { rejectWithValue }) => {
    try {
      const response = await clientService.enrollInProgram(clientId, programId);
      return { clientId, programId, enrollment: response };
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setSelectedClient: (state, action: PayloadAction<Client | null>) => {
      state.selectedClient = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Client By ID
      .addCase(fetchClientById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients.push(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.selectedClient?.id === action.payload.id) {
          state.selectedClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Enroll Client in Program
      .addCase(enrollClientInProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollClientInProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the client in the clients list
        const clientIndex = state.clients.findIndex(client => client.id === action.payload.clientId);
        if (clientIndex !== -1) {
          const client = state.clients[clientIndex];
          if (!client.programs.some(p => p.programId === action.payload.programId)) {
            client.programs.push({
              programId: action.payload.programId,
              ...action.payload.enrollment
            });
          }
        }
        
        // Update the selected client if it's the same client
        if (state.selectedClient?.id === action.payload.clientId) {
          if (!state.selectedClient.programs.some(p => p.programId === action.payload.programId)) {
            state.selectedClient.programs.push({
              programId: action.payload.programId,
              ...action.payload.enrollment
            });
          }
        }
      })
      .addCase(enrollClientInProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedClient, clearError } = clientsSlice.actions;
export default clientsSlice.reducer;

