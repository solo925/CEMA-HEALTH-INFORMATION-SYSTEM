import { apiSlice } from './apiSlice';
import { Program } from '../../types/program.types';
import { Client } from '../../types/client.types';

export const programsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<Program[], void>({
      query: () => '/programs/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Programs' as const, id })),
              { type: 'Programs', id: 'LIST' },
            ]
          : [{ type: 'Programs', id: 'LIST' }],
    }),

    getProgramById: builder.query<Program, string>({
      query: (id) => `/programs/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Programs', id }],
    }),

    getProgramClients: builder.query<Client[], string>({
      query: (programId) => `/programs/${programId}/clients/`,
      providesTags: (result, error, programId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Clients' as const, id })),
              { type: 'Programs', id: programId },
            ]
          : [{ type: 'Programs', id: programId }],
    }),

    addProgram: builder.mutation<Program, Partial<Program>>({
      query: (programData) => ({
        url: '/programs/',
        method: 'POST',
        body: programData,
      }),
      invalidatesTags: [{ type: 'Programs', id: 'LIST' }],
    }),

    updateProgram: builder.mutation<Program, { id: string; data: Partial<Program> }>({
      query: ({ id, data }) => ({
        url: `/programs/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Programs', id }],
    }),

    deleteProgram: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/programs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Programs', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useGetProgramClientsQuery,
  useAddProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programsApi;
