import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  EventNote as EventNoteIcon,
  Group as GroupIcon,
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProgramsQuery } from '../store/api/programsApi';
import { Program } from '../types/program.types';
import { ROUTES } from '../constants/routes';
import { formatDate } from '../utils/formatters';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProgramForm from '../components/programs/ProgramForm';
import { withAuth } from '../HOC/withAuth';

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const { data: programs, isLoading, isError, refetch } = useGetProgramsQuery();
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
  
  const handleProgramCreated = useCallback(() => {
    handleCloseAddDialog();
    refetch();
  }, [handleCloseAddDialog, refetch]);
  
  const handleViewProgram = useCallback((programId: string) => {
    navigate(ROUTES.PROGRAMS.DETAIL(programId));
  }, [navigate]);
  
  const filteredPrograms = useMemo(() => {
    if (!programs) return [];
    
    if (!debouncedSearchQuery) return programs;
    
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    return programs.filter(
      (program) =>
        program.name.toLowerCase().includes(lowercasedQuery) ||
        program.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [programs, debouncedSearchQuery]);
  
  // Group programs by status
  const groupedPrograms = useMemo(() => {
    if (!filteredPrograms.length) return {};
    
    return filteredPrograms.reduce<Record<string, Program[]>>(
      (groups, program) => {
        const status = program.status;
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(program);
        return groups;
      },
      {}
    );
  }, [filteredPrograms]);
  
  // Order of status display
  const statusOrder = ['active', 'planned', 'completed'];
  
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
          Error loading programs. Please try again later.
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
          Health Programs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Program
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search programs by name or description"
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
      
      {statusOrder.map((status) => {
        if (!groupedPrograms[status]?.length) return null;
        
        return (
          <Box key={status} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {status === 'active' && (
                <PlayArrowIcon
                  sx={{ color: 'success.main', mr: 1 }}
                />
              )}
              {status === 'planned' && (
                <EventNoteIcon
                  sx={{ color: 'warning.main', mr: 1 }}
                />
              )}
              {status === 'completed' && (
                <PauseIcon
                  sx={{ color: 'info.main', mr: 1 }}
                />
              )}
              <Typography variant="h5" component="h2" sx={{ textTransform: 'capitalize' }}>
                {status} Programs
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              {groupedPrograms[status].map((program) => (
                <Grid item xs={12} md={6} lg={4} key={program.id} {...({} as any)}>
                  <ProgramCard program={program} onView={handleViewProgram} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
      
      {filteredPrograms.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MedicalIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchQuery
              ? 'No matching programs found'
              : 'No programs available yet'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{ mt: 1 }}
            >
              Add New Program
            </Button>
          )}
        </Paper>
      )}
      
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Health Program</DialogTitle>
        <DialogContent>
          <ProgramForm onSuccess={handleProgramCreated} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

interface ProgramCardProps {
  program: Program;
  onView: (id: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = React.memo(({ program, onView }) => {
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
  
  // Calculate enrollment percentage
  const enrollmentPercentage = useMemo(() => {
    if (!program.capacity) return null;
    return Math.min(100, Math.round((program.enrolledClients / program.capacity) * 100));
  }, [program.capacity, program.enrolledClients]);
  
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
          {program.description.length > 120
            ? `${program.description.substring(0, 120)}...`
            : program.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            Starts: {formatDate(program.startDate)}
          </Typography>
        </Box>
        
        {program.endDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              Ends: {formatDate(program.endDate)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GroupIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            Enrolled: {program.enrolledClients}
            {program.capacity ? ` / ${program.capacity}` : ''}
          </Typography>
        </Box>
        
        {enrollmentPercentage !== null && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Capacity
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {enrollmentPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={enrollmentPercentage}
              color={enrollmentPercentage >= 90 ? 'error' : 'primary'}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => onView(program.id)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
});

export default withAuth(ProgramsPage);