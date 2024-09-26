import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ApiClient from '../../utils/ApiClient';

const ProjectEdit = ({ open, onClose, project, onUpdate }) => {
  const [name, setName] = useState(project?.name || '');
  const [startDate, setStartDate] = useState(project?.start_date || '');
  const [endDate, setEndDate] = useState(project?.end_date || '');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setStartDate(project.start_date);
      setEndDate(project.end_date);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { responseOk, data, status } = await ApiClient.updateProject(
        project.id, {
        name,
        start_date: startDate,
        end_date: endDate,
      });

      if (status === 422) return setErrors(data.errors);
      if (!responseOk) throw new Error(`Erro ${status}: ${data.error}`);

      onUpdate(data);
      onClose();
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Project
        </Typography>

        {errors.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error" variant="body1" gutterBottom>
              Não foi possível gravar. Corrija os seguintes errors:
            </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                {errors.map((error, index) => (
                  <ListItem key={index} sx={{ display: 'list-item' }} disableGutters dense>
                    <ListItemText primary={error} />
                  </ListItem>
                ))}
              </List>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default ProjectEdit;
