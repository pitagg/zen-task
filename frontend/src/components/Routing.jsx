import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import ProjectsIndex from "./projects/ProjectsIndex";
import ProjectShow from "./projects/ProjectShow";
import ProjectEdit from "./projects/ProjectEdit";

const Routing = ({ apiClient }) => {
  return (<>
    <Routes>
      <Route path="/" element={
        <Navigate to={apiClient.isAuth ? '/projects' : '/login'} replace />
      } />

      {/* Public routes */}
      <Route path="/login" element={<Login apiClient={ apiClient } />} />

      {/* Private routes */}
      <Route path="/projects" element={
        <ProtectedRoute apiClient={ apiClient }>
          <ProjectsIndex apiClient={ apiClient }/>
        </ProtectedRoute>
      } />

      {/* TODO: Handle show and edit routes. */}
      {/* <Route path="/projects/:projectId" element={
        <ProtectedRoute>
          <ProjectShow apiClient={ apiClient }/>
        </ProtectedRoute>
      } />
      <Route path="/projects/:projectId/edit" element={
        <ProtectedRoute>
          <ProjectEdit apiClient={ apiClient }/>
        </ProtectedRoute>
      } /> */}

      {/* Catch undefined paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>)
}

export default Routing;
