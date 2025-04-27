import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  MedicalServices as MedicalIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Attachment as AttachmentIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useGetClientsQuery } from '../store/api/clientsApi';
import { useGetProgramsQuery } from '../store/api/programsApi';
import { ROUTES } from '../constants/routes';
import { formatDate } from '../utils/formatters';
import { withAuth } from '../HOC/withAuth';
import { withLoading } from '../HOC/withLoading';
import { statCards } from '../types/index.types';


const StatCard = ({ title, value, icon, color }:statCards) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        borderTop: `4px solid ${color}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          bgcolor: theme.palette.mode === 'dark' ? `${color}20` : `${color}10`,
          p: 1.5,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const { data: clients, isLoading: isClientsLoading } = useGetClientsQuery();
  const { data: programs, isLoading: isProgramsLoading } = useGetProgramsQuery();
  
  const isLoading = isClientsLoading || isProgramsLoading;
  
  const stats = useMemo(() => {
    if (!clients || !programs) return null;
    
    const activePrograms = programs.filter(program => program.status === 'active').length;
    const totalEnrollments = clients.reduce(
      (total, client) => total + client.programs.length,
      0
    );
    
    return {
      totalClients: clients.length,
      activePrograms,
      totalEnrollments,
    };
  }, [clients, programs]);
  
  const recentClients = useMemo(() => {
    if (!clients) return [];
    return [...clients]
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      .slice(0, 5);
  }, [clients]);
  
  const upcomingPrograms = useMemo(() => {
    if (!programs) return [];
    return [...programs]
      .filter(program => program.status === 'planned')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);
  }, [programs]);
  
  if (isLoading || !stats) {
    return <div>Loading...</div>;
  }
  
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Box>
          <Button
            component={Link}
            to={ROUTES.CLIENTS.CREATE}
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            sx={{ mr: 1 }}
          >
            New Client
          </Button>
          <Button
            component={Link}
            to={ROUTES.PROGRAMS.CREATE}
            variant="outlined"
            startIcon={<MedicalIcon />}
          >
            New Program
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4} {...({} as any)}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<GroupIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4} {...({} as any)}>
          <StatCard
            title="Active Programs"
            value={stats.activePrograms}
            icon={<MedicalIcon sx={{ color: theme.palette.success.main, fontSize: 32 }} />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} md={4} {...({} as any)}>
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments}
            icon={<AssignmentIcon sx={{ color: theme.palette.info.main, fontSize: 32 }} />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7} {...({} as any)}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Recent Clients</Typography>
              <Button
                component={Link}
                to={ROUTES.CLIENTS.LIST}
                size="small"
                endIcon={<AttachmentIcon />}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentClients.map((client) => (
                <ListItem
                  key={client.id}
                  component={Link}
                  to={ROUTES.CLIENTS.DETAIL(client.id)}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                    textDecoration: 'none',
                    color: 'text.primary',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {client.firstName.charAt(0)}
                      {client.lastName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${client.firstName} ${client.lastName}`}
                    secondary={`Registered: ${formatDate(client.registrationDate)}`}
                  />
                </ListItem>
              ))}
              {recentClients.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary">No clients registered yet</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5} {...({} as any)}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Upcoming Programs</Typography>
              <Button
                component={Link}
                to={ROUTES.PROGRAMS.LIST}
                size="small"
                endIcon={<AttachmentIcon />}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {upcomingPrograms.map((program) => (
              <Card
                key={program.id}
                variant="outlined"
                sx={{ mb: 2, '&:last-child': { mb: 0 } }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {program.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {program.description.substring(0, 100)}
                    {program.description.length > 100 ? '...' : ''}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Starts: {formatDate(program.startDate)}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ px: 2, pb: 1.5 }}>
                  <Button
                    component={Link}
                    to={ROUTES.PROGRAMS.DETAIL(program.id)}
                    size="small"
                    color="primary"
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            ))}
            {upcomingPrograms.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary">No upcoming programs</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withAuth(DashboardPage);