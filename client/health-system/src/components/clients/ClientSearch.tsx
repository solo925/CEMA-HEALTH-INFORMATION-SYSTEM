import React, { useState, useCallback, useMemo } from 'react';
import { TextField, Box, Typography, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Client } from '../../types/client.types';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchClientsQuery } from '../../store/api/clientsApi';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import LoadingSpinner from '../common/LoadingSpinner';



interface ClientSearchProps {
  onClientSelect: (client: Client) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ onClientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { data: clients, isLoading, isError } = useSearchClientsQuery(
    debouncedSearchTerm,
    {
      skip: debouncedSearchTerm.length < 3,
    }
  );
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleClientClick = useCallback((client: Client) => {
    onClientSelect(client);
    setSearchTerm('');
  }, [onClientSelect]);
  
  const renderSearchResults = useMemo(() => {
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <Typography color="error">{ERROR_MESSAGES.SERVER_ERROR}</Typography>;
    if (!clients || clients.length === 0) {
      return debouncedSearchTerm.length >= 3 ? (
        <Typography>No clients found</Typography>
      ) : null;
    }
    
    return (
      <Paper elevation={3} sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
        {clients.map((client: Client) => (
          <Box
            key={client.id}
            onClick={() => handleClientClick(client)}
            sx={{
              p: 2,
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Typography variant="subtitle1">
              {client.firstName} {client.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {client.email} • {client.contactNumber}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }, [clients, debouncedSearchTerm, handleClientClick, isError, isLoading]);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
        <TextField
          fullWidth
          label="Search clients"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, email or phone"
          helperText={
            debouncedSearchTerm.length > 0 && debouncedSearchTerm.length < 3
              ? 'Type at least 3 characters to search'
              : ' '
          }
        />
      </Box>
      {renderSearchResults}
    </Box>
  );
};

export default React.memo(ClientSearch);

