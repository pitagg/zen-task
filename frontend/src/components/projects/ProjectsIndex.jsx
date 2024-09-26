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
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ApiClient from '../../utils/ApiClient';
import Header from '../Header';
import ProjectShow from "./ProjectShow";
import ProjectEdit from "./ProjectEdit";
import ProjectNew from "./ProjectNew";
import ActivityEdit from "./ActivityEdit";


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

  return (
    <div>
      <Header />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Projects</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNew}
          >
            New Project
          </Button>
          {/* <IconButton onClick={handleNew}>
            <Delete />
          </IconButton> */}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Data de Início</TableCell>
                <TableCell>Data de Fim</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell
                    onClick={() => handleShow(project)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                  >
                    {project.name}
                  </TableCell>
                  <TableCell>{project.start_date}</TableCell>
                  <TableCell>{project.end_date}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(project)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(project.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
