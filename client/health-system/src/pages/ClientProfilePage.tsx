import React, { useEffect } from 'react';
import { Box, Typography, Button, Breadcrumbs, Link, Paper } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useGetClientByIdQuery } from '../store/api/clientsApi';
import ClientProfile from '../components/clients/ClientProfile';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../constants/routes';
import { withAuth } from '../HOC/withAuth';

const ClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: client, isLoading, isError, error } = useGetClientByIdQuery(id || '');
  
  // Handle non-existent client
  useEffect(() => {
    if (isError) {
      console.error('Error fetching client:', error);
    }
  }, [isError, error]);
  
  const handleGoBack = () => {
    navigate(ROUTES.CLIENTS.LIST);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back to Clients
        </Button>
        
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to={ROUTES.DASHBOARD} color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to={ROUTES.CLIENTS.LIST} color="inherit">
            Clients
          </Link>
          <Typography color="text.primary">
            {isLoading ? 'Loading...' : client ? `${client.firstName} ${client.lastName}` : 'Client Profile'}
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1">
          Client Profile
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LoadingSpinner text="Loading client data..." />
        </Box>
      ) : isError ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error loading client data
          </Typography>
          <Typography variant="body1" paragraph>
            The client could not be found or there was an error retrieving their information.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoBack}
          >
            Return to Clients List
          </Button>
        </Paper>
      ) : client ? (
        <ClientProfile client={client} />
      ) : null}
    </Box>
  );
};

export default withAuth(ClientProfilePage);