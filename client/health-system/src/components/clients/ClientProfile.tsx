import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  MedicalServices as MedicalIcon,
  PersonAdd as EnrollIcon,
  CalendarToday as CalendarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactPhoneIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { Client } from '../../types/client.types';
import { Program } from '../../types/program.types';
import { ROUTES } from '../../constants/routes';
import { useGetProgramByIdQuery } from '../../store/api/programsApi';
import LoadingSpinner from '../common/LoadingSpinner';

interface ClientProfileProps {
  client: Client;
  isLoading?: boolean;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ client, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;
  if (!client) return null;

  const handleEditClick = () => {
    navigate(ROUTES.CLIENTS.EDIT(client.id));
  };

  const handleEnrollClick = () => {
    navigate(ROUTES.CLIENTS.ENROLL(client.id));
  };

  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {client.firstName} {client.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Client ID: {client.id}
              </Typography>
            </Box>
            <Box>
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={handleEditClick}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                startIcon={<EnrollIcon />}
                variant="contained"
                color="primary"
                onClick={handleEnrollClick}
              >
                Enroll in Program
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} {...({} as any)}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Date of Birth:</strong> {formatDate(client.dateOfBirth)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip size="small" label={client.gender} sx={{ mr: 1, textTransform: 'capitalize' }} />
                  <Typography>
                    <strong>Gender</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Email:</strong> {client.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Contact:</strong> {client.contactNumber}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} {...({} as any)}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Address:</strong> {client.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ContactPhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Emergency Contact:</strong> {client.emergencyContact}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Registration Date:</strong> {formatDate(client.registrationDate)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <EnrolledProgramsTable programs={client.programs} clientId={client.id} />
    </Box>
  );
};

interface EnrolledProgramsTableProps {
  programs: Client['programs'];
  clientId: string;
}

const EnrolledProgramsTable: React.FC<EnrolledProgramsTableProps> = ({ programs, clientId }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Enrolled Programs
      </Typography>
      {programs.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <MedicalIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Not enrolled in any programs yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<EnrollIcon />}
            sx={{ mt: 1 }}
            component="a"
            href={ROUTES.CLIENTS.ENROLL(clientId)}
          >
            Enroll in a Program
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Program</TableCell>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((enrollment) => (
                <EnrolledProgramRow
                  key={enrollment.programId}
                  enrollment={enrollment}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

interface EnrolledProgramRowProps {
  enrollment: Client['programs'][0];
}

const EnrolledProgramRow: React.FC<EnrolledProgramRowProps> = ({ enrollment }) => {
  const { data: program, isLoading } = useGetProgramByIdQuery(enrollment.programId);
  const navigate = useNavigate();

  const statusColor = useMemo(() => {
    switch (enrollment.status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  }, [enrollment.status]);

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner size={24} />
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  if (!program) return null;

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body1">{program.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {program.description.substring(0, 60)}
          {program.description.length > 60 ? '...' : ''}
        </Typography>
      </TableCell>
      <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
      <TableCell>
        <Chip
          label={enrollment.status}
          color={statusColor as any}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View Program">
          <IconButton
            size="small"
            onClick={() => navigate(ROUTES.PROGRAMS.DETAIL(enrollment.programId))}
          >
            <MedicalIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ClientProfile);