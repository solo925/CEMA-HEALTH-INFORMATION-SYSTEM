import { apiSlice } from './apiSlice';
import { Client, ClientFormData } from '../../types/client.types';

export const clientsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => '/clients/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Clients' as const, id })),
              { type: 'Clients', id: 'LIST' },
            ]
          : [{ type: 'Clients', id: 'LIST' }],
    }),
    getClientById: builder.query<Client, string>({
      query: (id) => `/clients/${id}/`,
      providesTags: (_, __, id) => [{ type: 'Clients', id }],
    }),
    searchClients: builder.query<Client[], string>({
      query: (searchTerm) => `/clients/search/?query=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: 'Clients', id: 'SEARCH' }],
    }),
    addClient: builder.mutation<Client, ClientFormData>({
      query: (clientData) => ({
        url: '/clients/',
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }],
    }),
    updateClient: builder.mutation<Client, { id: string; data: Partial<ClientFormData> }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Clients', id }],
    }),
    enrollClientInProgram: builder.mutation<
      void,
      { clientId: string; programId: string }
    >({
      query: ({ clientId, programId }) => ({
        url: `/clients/${clientId}/enroll/`,
        method: 'POST',
        body: { programId },
      }),
      invalidatesTags: (_, __, { clientId }) => [{ type: 'Clients', id: clientId }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useSearchClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useEnrollClientInProgramMutation,
} = clientsApi;