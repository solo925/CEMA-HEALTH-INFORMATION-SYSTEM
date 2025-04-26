import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  AddCircle as AddCircleIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetClientsQuery } from '../store/api/clientsApi';
import { ROUTES } from '../constants/routes';
import { formatDate } from '../utils/formatters';
import { Client } from '../types/client.types';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ClientForm from '../components/clients/ClientForm';
import { withAuth } from '../HOC/withAuth';

const ClientsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const { data: clients, isLoading, isError, refetch } = useGetClientsQuery();
  
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);
  
  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);
  
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  }, []);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);
  
  const handleOpenAddDialog = useCallback(() => {
    setOpenAddDialog(true);
  }, []);
  
  const handleCloseAddDialog = useCallback(() => {
    setOpenAddDialog(false);
  }, []);
  
  const handleClientAdded = useCallback(() => {
    handleCloseAddDialog();
    refetch();
  }, [handleCloseAddDialog, refetch]);
  
  const handleViewClient = useCallback((clientId) => {
    navigate(ROUTES.CLIENTS.DETAIL(clientId));
  }, [navigate]);
  
  const handleEditClient = useCallback((clientId) => {
    navigate(ROUTES.CLIENTS.EDIT(clientId));
  }, [navigate]);
  
  const handleEnrollClient = useCallback((clientId) => {
    navigate(ROUTES.CLIENTS.ENROLL(clientId));
  }, [navigate]);
  
  const filteredClients = React.useMemo(() => {
    if (!clients) return [];
    
    if (!debouncedSearchQuery) return clients;
    
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(lowercasedQuery) ||
        client.lastName.toLowerCase().includes(lowercasedQuery) ||
        client.email.toLowerCase().includes(lowercasedQuery) ||
        client.contactNumber.includes(debouncedSearchQuery)
    );
  }, [clients, debouncedSearchQuery]);
  
  // Apply pagination
  const paginatedClients = React.useMemo(() => {
    return filteredClients.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredClients, page, rowsPerPage]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingSpinner />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Error loading clients. Please try again later.
        </Typography>
        <Button onClick={refetch} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Client
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search clients by name, email or phone"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact Information</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Programs</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.length > 0 ? (
              paginatedClients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onView={handleViewClient}
                  onEdit={handleEditClient}
                  onEnroll={handleEnrollClient}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {searchQuery ? 'No matching clients found' : 'No clients registered yet'}
                    </Typography>
                    {!searchQuery && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{ mt: 1 }}
                      >
                        Add New Client
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredClients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
      
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Register New Client</DialogTitle>
        <DialogContent>
          <ClientForm onSuccess={handleClientAdded} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

interface ClientRowProps {
  client: Client;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onEnroll: (id: string) => void;
}

const ClientRow: React.FC<ClientRowProps> = ({ client, onView, onEdit, onEnroll }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2">
          {client.firstName} {client.lastName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{client.email}</Typography>
        <Typography variant="body2" color="text.secondary">
          {client.contactNumber}
        </Typography>
      </TableCell>
      <TableCell>{formatDate(client.registrationDate)}</TableCell>
      <TableCell>
        {client.programs.length > 0 ? (
          <Chip
            label={`${client.programs.length} Program${
              client.programs.length > 1 ? 's' : ''
            }`}
            size="small"
            color="primary"
          />
        ) : (
          <Chip label="Not Enrolled" size="small" variant="outlined" />
        )}
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View Client">
          <IconButton onClick={() => onView(client.id)} size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Client">
          <IconButton onClick={() => onEdit(client.id)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Enroll in Program">
          <IconButton onClick={() => onEnroll(client.id)} size="small" color="primary">
            <AddCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default withAuth(ClientsPage);