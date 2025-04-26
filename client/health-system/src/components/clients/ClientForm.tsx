import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  MenuItem, 
  Paper,
  Snackbar,
  Grid,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ClientFormData } from '../../types/client.types';
import { useAddClientMutation } from '../../store/api/clientsApi';
import { ERROR_MESSAGES } from '../../constants/errorMessages';



const validationSchema = yup.object().shape({
  firstName: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  lastName: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  dateOfBirth: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  gender: yup.string().oneOf(['male', 'female', 'other']).required(ERROR_MESSAGES.REQUIRED_FIELD),
  contactNumber: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  email: yup.string().email(ERROR_MESSAGES.INVALID_EMAIL).required(ERROR_MESSAGES.REQUIRED_FIELD),
  address: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  emergencyContact: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
});

const defaultValues: ClientFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'male',
  contactNumber: '',
  email: '',
  address: '',
  emergencyContact: '',
};

interface ClientFormProps {
  onSuccess?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSuccess }) => {
  const [addClient, { isLoading }] = useAddClientMutation();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });
  
  const onSubmit = useCallback(async (data: ClientFormData) => {
    try {
      await addClient(data).unwrap();
      setSnackbar({
        open: true,
        message: 'Client registered successfully!',
        severity: 'success',
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      setSnackbar({
        open: true,
        message: ERROR_MESSAGES.SERVER_ERROR,
        severity: 'error',
      });
    }
  }, [addClient, onSuccess, reset]);
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Register New Client
      </Typography>
      
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} {...({} as any)}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} {...({} as any)}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} {...({} as any)}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} {...({} as any)}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Gender"
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} {...({} as any)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} {...({} as any)}>
            <Controller
              name="contactNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Contact Number"
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} {...({} as any)}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} {...({} as any)}>
            <Controller
              name="emergencyContact"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Emergency Contact"
                  error={!!errors.emergencyContact}
                  helperText={errors.emergencyContact?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Register Client'}
          </Button>
        </Box>
      </Box>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default React.memo(ClientForm);