import React, { useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { Program } from '../../types/program.types';

interface ProgramListProps {
  programs: Program[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onViewClients: (id: string) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  isLoading,
  isError,
  onView,
  onEdit,
  onViewClients,
}) => {
  const sortedPrograms = useMemo(() => {
    if (!programs) return [];
    
    // Sort by status first (active, planned, completed), then by start date
    return [...programs].sort((a, b) => {
      // Status order: active, planned, completed
      const statusOrder = { active: 0, planned: 1, completed: 2 };
      if (statusOrder[a.status as keyof typeof statusOrder] !== statusOrder[b.status as keyof typeof statusOrder]) {
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      }
      
      // Then sort by start date (newest first)
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [programs]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingSpinner />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Typography color="error">
        Error loading programs. Please try again later.
      </Typography>
    );
  }
  
  if (!sortedPrograms || sortedPrograms.length === 0) {
    return (
      <Typography align="center" sx={{ p: 4 }}>
        No programs found.
      </Typography>
    );
  }
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Enrollment</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPrograms.map((program) => (
            <TableRow key={program.id} hover>
              <TableCell>
                <Typography variant="subtitle2">{program.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 300 }}
                >
                  {program.description.length > 60
                    ? `${program.description.slice(0, 60)}...`
                    : program.description}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={program.status}
                  size="small"
                  color={
                    program.status === 'active'
                      ? 'success'
                      : program.status === 'planned'
                      ? 'warning'
                      : 'info'
                  }
                  sx={{ textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell>{formatDate(program.startDate)}</TableCell>
              <TableCell>
                {program.endDate ? formatDate(program.endDate) : 'N/A'}
              </TableCell>
              <TableCell>
                {program.enrolledClients}
                {program.capacity ? ` / ${program.capacity}` : ''}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => onView(program.id)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Program">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(program.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Enrolled Clients">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onViewClients(program.id)}
                  >
                    <GroupIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(ProgramList);
