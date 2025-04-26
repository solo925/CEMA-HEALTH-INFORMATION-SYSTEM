import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Person as PersonIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import { Client } from '../../types/client.types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { ROUTES } from '../../constants/routes';
import { Program } from '../../types/program.types';

interface ProgramDetailsProps {
  program: Program;
  enrolledClients?: Client[];
  isLoading?: boolean;
  isClientsLoading?: boolean;
  onEdit?: () => void;
  onViewAllClients?: () => void;
}

const ProgramDetails: React.FC<ProgramDetailsProps> = ({
  program,
  enrolledClients,
  isLoading,
  isClientsLoading,
  onEdit,
  onViewAllClients,
}) => {
  const navigate = useNavigate();
  
  const statusColor = useMemo(() => {
    switch (program?.status) {
      case 'active':
        return 'success';
      case 'planned':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  }, [program?.status]);
  
  // Calculate enrollment percentage
  const enrollmentPercentage = useMemo(() => {
    if (!program?.capacity) return null;
    return Math.min(100, Math.round((program.enrolledClients / program.capacity) * 100));
  }, [program?.capacity, program?.enrolledClients]);
  
  const handleViewClient = (clientId: string) => {
    navigate(ROUTES.CLIENTS.DETAIL(clientId));
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingSpinner />
      </Box>
    );
  }
  
  if (!program) {
    return (
      <Typography color="error">
        Program not found.
      </Typography>
    );
  }
  
  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {program.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={program.status}
                  color={statusColor as any}
                  sx={{ textTransform: 'capitalize', mr: 2 }}
                />
                <Typography variant="subtitle1" color="text.secondary">
                  ID: {program.id}
                </Typography>
              </Box>
            </Box>
            {onEdit && (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} {...({} as any)}>
              <Typography variant="h6" gutterBottom>
                Program Information
              </Typography>
              <Typography variant="body1" paragraph>
                {program.description}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Start Date:</strong> {formatDate(program.startDate)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {program.endDate ? (
                    <>
                      <EventAvailableIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>
                        <strong>End Date:</strong> {formatDate(program.endDate)}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <EventBusyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>
                        <strong>End Date:</strong> Not specified
                      </Typography>
                    </>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Last Updated:</strong> {formatDateTime(program.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} {...({} as any)}>
              <Typography variant="h6" gutterBottom>
                Enrollment Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Enrolled:</strong> {program.enrolledClients}
                    {program.capacity ? ` out of ${program.capacity}` : ''}
                  </Typography>
                </Box>
                
                {enrollmentPercentage !== null && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Capacity Usage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {enrollmentPercentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={enrollmentPercentage}
                      color={enrollmentPercentage >= 90 ? 'error' : 'primary'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Box>
              
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recently Enrolled
                  </Typography>
                  {onViewAllClients && (
                    <Button
                      size="small"
                      endIcon={<MoreHorizIcon />}
                      onClick={onViewAllClients}
                    >
                      View All
                    </Button>
                  )}
                </Box>
                
                {isClientsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <LoadingSpinner size={24} />
                  </Box>
                ) : enrolledClients && enrolledClients.length > 0 ? (
                  <List>
                    {enrolledClients.slice(0, 5).map((client) => (
                      <ListItem
                        key={client.id}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 'none' },
                        }}
                        secondaryAction={
                          <Tooltip title="View Client">
                            <IconButton edge="end" size="small" onClick={() => handleViewClient(client.id)}>
                              <PersonIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {client.firstName.charAt(0)}
                            {client.lastName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${client.firstName} ${client.lastName}`}
                          secondary={client.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography color="text.secondary">
                      No clients enrolled yet
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(ProgramDetails);