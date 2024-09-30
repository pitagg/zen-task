import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from "@mui/material";
import { Check, Edit, Delete, Cancel } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from "date-fns/locale";

const ProjectShow = ({ project, onUpdate, apiClient }) => {
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, [project]);

  const fetchActivities = async () => {
    try {
      if (project) {
        const { data } = await apiClient.getActivities(project.id);
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = { name, start_date: startDate, end_date: endDate }
      if (editingActivityId) {
        await apiClient.updateActivity(project.id, editingActivityId, formData);
      } else {
        await apiClient.createActivity(project.id, formData);
      }
      refreshProjectActivities();
      clearForm();
    } catch (error) {
      const { response, data } = error;

      switch (response?.status) {
        case 422:
          setErrors(data.errors || []);
          break;

        default:
          if (data?.error) {
            setErrors([`Erro ${response?.status}: ${data.error}`]);
          } else {
            setErrors(['Erro no servidor. Não foi possível processar a requisição.']);
          }
          break;
      }
    }
  };

  const refreshProjectActivities = async () => {
    const projectResponse = await apiClient.getProject(project.id);
    const activitiesResponse = await apiClient.getActivities(project.id);
    onUpdate(projectResponse.data);
    setActivities(activitiesResponse.data);
  };

  const clearForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setEditingActivityId(null);
    setErrors([]);
  };

  const handleEditClick = (activity) => {
    setName(activity.name);
    setStartDate(new Date(activity.start_date));
    setEndDate(new Date(activity.end_date));
    setEditingActivityId(activity.id);
  };

  const handleDeleteClick = async (activityId) => {
    if (window.confirm("Tem certeza que quer excluir a atividade?")) {
      await apiClient.deleteActivity(project.id, activityId);
      setActivities(activities.filter((activity) => activity.id !== activityId));
    }
  };

  const handleCompleteToggle = async (activity) => {
    try {
      await apiClient.updateActivity(project.id, activity.id, { completed: !activity.completed });
      refreshProjectActivities();
    } catch (error) {
      const { response, data } = error;
      window.alert(`Erro ${error.response?.status}`);
      console.log(error);
    }
  };

  return (
    <Box p={2}>
      <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ptBR}>
        <Typography variant="h6">{project.name}</Typography>
        <Box mb={3} p={2} border={1} borderRadius={4} borderColor="grey.300">
          <Typography variant="subtitle1">{
            editingActivityId ? 'Atualizar atividade' : 'Criar atividade'
          }</Typography>

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

          <TextField
            label="Nome"
            name="name"
            value={name}
            onChange={(e)=>{setName(e.target.value)}}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <>
                  <Tooltip title={
                    editingActivityId
                      ? "Gravar alterações"
                      : "Criar nova atividade"}
                  >
                    <IconButton onClick={handleSubmit}>
                      <Check />
                    </IconButton>
                  </Tooltip>
                  {(editingActivityId || errors.length > 0 ) && (
                    <Tooltip title={
                      editingActivityId
                        ? "Cancelar alterações"
                        : "Descartar nova atividade"}
                    >
                      <IconButton onClick={clearForm}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              ),
            }}
          />
          <Box display="flex" gap={2}>
            <DatePicker
              label="Data de Início"
              name="start_date"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <DatePicker
              label="Data de Fim"
              name="end_date"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </LocalizationProvider>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <Checkbox
                    checked={activity.completed}
                    onChange={() => handleCompleteToggle(activity)}
                  />
                </TableCell>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{apiClient.formatDate(activity.start_date)}</TableCell>
                <TableCell>{apiClient.formatDate(activity.end_date)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(activity)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(activity.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectShow;
