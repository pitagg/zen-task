import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Drawer,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { Edit, Delete, Warning } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ApiClient from '../../utils/ApiClient';
import Header from '../Header';
import ProjectShow from "./ProjectShow";
import ProjectEdit from "./ProjectEdit";
import ProjectNew from "./ProjectNew";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


const ProjectsIndex = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerComponent, setDrawerComponent] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await ApiClient.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleShow = (project) => {
    setSelectedProject(project);
    setDrawerComponent('show');
    setDrawerOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setDrawerComponent('edit');
    setDrawerOpen(true);
  };

  const handleNew = (project) => {
    setSelectedProject(project);
    setDrawerComponent('new');
    setDrawerOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Tem certeza que quer excluir o projeto?')) {
      try {
        await ApiClient.deleteProject(projectId);
        setProjects(projects.filter((project) => project.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
  };

  const handleCreateProject = () => {
    fetchProjects();
  }

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const isDelayed = (completion_date, end_date) => {
    return new Date(completion_date) > new Date(end_date);
  }

  return (
    <div>
      <Header />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Projetos</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNew}
            size='small'
          >
            Novo
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Data de Início</TableCell>
                <TableCell>Data de Fim</TableCell>
                <TableCell>Prazo estimado</TableCell>
                <TableCell>Progresso</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => {
                const progress = project.completion * 100;

                return (
                  <TableRow key={project.id}>
                    <TableCell
                      onClick={() => handleShow(project)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {project.name}
                    </TableCell>
                    <TableCell>{formatDate(project.start_date)}</TableCell>
                    <TableCell>{formatDate(project.end_date)}</TableCell>
                    <TableCell>
                      {formatDate(project.completion_date)}
                      {isDelayed(project.completion_date, project.end_date) && (
                        <Tooltip title="Risco de atraso com base na previsão de entrega da última atividade.">
                          <Warning color="error" style={{ marginLeft: 10 }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`${progress}%`}>
                        <LinearProgress variant="determinate" value={project.completion * 100} />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <IconButton onClick={() => handleEdit(project)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(project.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerComponent === 'show' && selectedProject && (
          <ProjectShow project={selectedProject} />
        )}
        {drawerComponent === 'edit' && selectedProject && (
          <ProjectEdit
            project={selectedProject}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onUpdate={handleUpdateProject}
          />
        )}
        {drawerComponent === 'new' && selectedProject && (
          <ProjectNew
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onCreate={handleCreateProject}
          />
        )}
      </Drawer>
    </div>
  );
};

export default ProjectsIndex;
