import React, { useState } from 'react';
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

const ProjectNew = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { responseOk, data, status } = await ApiClient.createProject({
        name,
        start_date: startDate,
        end_date: endDate,
      });

      if (status === 422) return setErrors(data.errors);
      if (!responseOk) throw new Error(`Erro ${status}: ${data.error}`);

      onCreate(data);
      onClose();
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Novo Projeto
        </Typography>

        {errors.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error" variant="body1" gutterBottom>
              Não foi possível gravar. Corrija os seguintes errors:
            </Typography>
            <List>
              {errors.map((error, index) => (
                <ListItem key={index}>
                  <ListItemText primary={error} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Data de Início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Data de Fim"
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
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Criar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default ProjectNew;
