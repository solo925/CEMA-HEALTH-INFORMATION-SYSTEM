import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAddProgramMutation } from '../../store/api/programsApi';
import { ProgramFormData } from '../../types/program.types';
import { ERROR_MESSAGES } from '../../constants/errorMessages';

const validationSchema = yup.object().shape({
  name: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  description: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  startDate: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD),
  endDate: yup.string().nullable(),
  status: yup.string().oneOf(['active', 'completed', 'planned']).required(ERROR_MESSAGES.REQUIRED_FIELD),
  capacity: yup.number().nullable().transform((v) => (isNaN(v) ? null : v)),
});

const defaultValues: ProgramFormData = {
  name: '',
  description: '',
  startDate: '',
  endDate: undefined,
  status: 'planned',
  capacity: undefined,
};

interface ProgramFormProps {
  onSuccess?: () => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ onSuccess }) => {
  const [addProgram, { isLoading }] = useAddProgramMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const watchStartDate = watch('startDate');

  const onSubmit = useCallback(
    async (data: ProgramFormData) => {
      try {
        await addProgram(data).unwrap();
        setSnackbar({
          open: true,
          message: 'Program created successfully!',
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
    },
    [addProgram, onSuccess, reset]
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Health Program
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} {...({} as any)}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Program Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} {...({} as any)}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date: { toISOString: () => string; }) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="End Date (Optional)"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date: { toISOString: () => string; }) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                    minDate={watchStartDate ? new Date(watchStartDate) : undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="planned">Planned</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Capacity (Optional)"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Max</InputAdornment>,
                    }}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button type="button" variant="outlined" sx={{ mr: 1 }} onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Program'}
            </Button>
          </Box>
        </Box>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
};

export default React.memo(ProgramForm);

