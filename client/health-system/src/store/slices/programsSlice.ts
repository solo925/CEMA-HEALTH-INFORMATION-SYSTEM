import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Program } from '../../types/program.types';
import { programService } from '../../services/program.service';

interface ProgramsState {
  programs: Program[];
  selectedProgram: Program | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgramsState = {
  programs: [],
  selectedProgram: null,
  isLoading: false,
  error: null,
};

export const fetchPrograms = createAsyncThunk(
  'programs/fetchPrograms',
  async (_, { rejectWithValue }) => {
    try {
      const programs = await programService.getPrograms();
      return programs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProgramById = createAsyncThunk(
  'programs/fetchProgramById',
  async (id: string, { rejectWithValue }) => {
    try {
      const program = await programService.getProgramById(id);
      return program;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProgram = createAsyncThunk(
  'programs/createProgram',
  async (programData: Omit<Program, 'id' | 'enrolledClients' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const program = await programService.createProgram(programData);
      return program;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProgram = createAsyncThunk(
  'programs/updateProgram',
  async ({ id, data }: { id: string; data: Partial<Program> }, { rejectWithValue }) => {
    try {
      const program = await programService.updateProgram(id, data);
      return program;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    setSelectedProgram: (state, action: PayloadAction<Program | null>) => {
      state.selectedProgram = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Programs
      .addCase(fetchPrograms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Program By ID
      .addCase(fetchProgramById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgramById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProgram = action.payload;
      })
      .addCase(fetchProgramById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Program
      .addCase(createProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs.push(action.payload);
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Program
      .addCase(updateProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.programs.findIndex(program => program.id === action.payload.id);
        if (index !== -1) {
          state.programs[index] = action.payload;
        }
        if (state.selectedProgram?.id === action.payload.id) {
          state.selectedProgram = action.payload;
        }
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProgram, clearError } = programsSlice.actions;
export default programsSlice.reducer;