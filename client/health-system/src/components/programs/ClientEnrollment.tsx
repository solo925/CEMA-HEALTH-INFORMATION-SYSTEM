import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  Event as EventIcon,
  Check as CheckIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { Client, Program } from '../../types/client.types';
import LoadingSpinner from '../common/LoadingSpinner';
import { useEnrollClientInProgramMutation } from '../../store/api/clientsApi';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { formatDate } from '../../utils/formatters';
import { useGetProgramsQuery } from '../../store/api/programsApi';


interface ClientEnrollmentProps {
  client: Client;
  onSuccess?: () => void;
}

const ClientEnrollment: React.FC<ClientEnrollmentProps> = ({ client, onSuccess }) => {
  const { data: programs, isLoading } = useGetProgramsQuery();
  const [enrollClient, { isLoading: isEnrolling }] = useEnrollClientInProgramMutation();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const enrolledProgramIds = useMemo(
    () => new Set(client.programs.map((p) => p.programId)),
    [client.programs]
  );

  const availablePrograms = useMemo(() => {
    if (!programs) return [];
    return programs.filter(
      (program:any) => !enrolledProgramIds.has(program.id) && program.status !== 'completed'
    );
  }, [programs, enrolledProgramIds]);

  const handleProgramSelect = useCallback((program: Program) => {
    setSelectedProgram(program);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedProgram(null);
  }, []);

  const handleConfirmEnrollment = useCallback(async () => {
    if (!selectedProgram) return;
    
    try {
      await enrollClient({
        clientId: client.id,
        programId: selectedProgram.id,
      }).unwrap();
      
      setSnackbar({
        open: true,
        message: `Successfully enrolled in ${selectedProgram.name}`,
        severity: 'success',
      });
      
      handleCloseDialog();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: ERROR_MESSAGES.SERVER_ERROR,
        severity: 'error',
      });
      handleCloseDialog();
    }
  }, [client.id, enrollClient, handleCloseDialog, onSuccess, selectedProgram]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enroll {client.firstName} {client.lastName} in a Health Program
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {availablePrograms.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <MedicalIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Available Programs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The client is already enrolled in all active programs.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {availablePrograms.map((program:any) => (
              <Grid item xs={12} md={6} lg={4} key={program.id} {...({} as any)}>
                <ProgramCard program={program} onSelect={handleProgramSelect} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to enroll {client.firstName} {client.lastName} in{' '}
            <strong>{selectedProgram?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isEnrolling}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEnrollment}
            color="primary"
            variant="contained"
            disabled={isEnrolling}
            startIcon={isEnrolling ? <CircularProgress size={20} /> : <CheckIcon />}
          >
            {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

interface ProgramCardProps {
  program: Program;
  onSelect: (program: Program) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onSelect }) => {
  const statusColor = useMemo(() => {
    switch (program.status) {
      case 'active':
        return 'success';
      case 'planned':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  }, [program.status]);

  const isAtCapacity = useMemo(() => {
    return program.capacity !== undefined && program.enrolledClients >= program.capacity;
  }, [program]);

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {program.name}
          </Typography>
          <Chip
            size="small"
            label={program.status}
            color={statusColor as any}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {program.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            Starts: {formatDate(program.startDate)}
          </Typography>
        </Box>

        {program.endDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              Ends: {formatDate(program.endDate)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            Enrolled: {program.enrolledClients}
            {program.capacity && ` / ${program.capacity}`}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          fullWidth
          variant="contained"
          onClick={() => onSelect(program)}
          disabled={isAtCapacity}
          startIcon={<MedicalIcon />}
        >
          {isAtCapacity ? 'Program Full' : 'Enroll'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default React.memo(ClientEnrollment);