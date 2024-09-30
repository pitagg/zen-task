import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, TextField, Typography, Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Tooltip } from "@mui/material";
import { Check, Edit, Delete, Cancel } from "@mui/icons-material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ProjectShow = ({ project, onUpdate, apiClient }) => {
  const blankFormData = {
    name: "",
    start_date: "",
    end_date: ""
  }
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState(blankFormData);
  const [editingActivityId, setEditingActivityId] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (editingActivityId) {
      await apiClient.updateActivity(project.id, editingActivityId, formData);
    } else {
      await apiClient.createActivity(project.id, formData);
    }
    refreshProjectActivities();
    clearForm();
  };

  const refreshProjectActivities = async () => {
    const projectResponse = await apiClient.getProject(project.id);
    const activitiesResponse = await apiClient.getActivities(project.id);
    onUpdate(projectResponse.data);
    setActivities(activitiesResponse.data);
  };

  const clearForm = () => {
    setFormData(blankFormData);
    setEditingActivityId(null);
  };

  const handleEditClick = (activity) => {
    setFormData({
      name: activity.name,
      start_date: activity.start_date,
      end_date: activity.end_date,
    });
    setEditingActivityId(activity.id);
  };

  const handleDeleteClick = async (activityId) => {
    if (window.confirm("Tem certeza que quer excluir a atividade?")) {
      await apiClient.deleteActivity(activityId);
      refreshProjectActivities();
    }
  };

  const handleCompleteToggle = async (activity) => {
    await apiClient.updateActivity(project.id, activity.id, { completed: !activity.completed });
    refreshProjectActivities();
  };

  return (
    <Box p={2}>
      <Typography variant="h6">{project.name}</Typography>
      <Box mb={3} p={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography variant="subtitle1">{
          editingActivityId ? 'Atualizar atividade' : 'Criar atividade'
        }</Typography>
        <TextField
          label="Nome"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <>
                <IconButton onClick={handleSubmit}>
                  <Check />
                </IconButton>
                {editingActivityId && (
                  <IconButton onClick={clearForm}>
                    <Cancel />
                  </IconButton>
                )}
              </>
            ),
          }}
        />
        <Box display="flex" gap={2}>
          <TextField
            label="Data de Início"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            fullWidth
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Data de Fim"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            fullWidth
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>
      </Box>

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
                <TableCell>{format(new Date(activity.start_date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{format(new Date(activity.end_date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
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
