import { Routes, Route, Navigate } from 'react-router-dom';
import ApiClient from '../utils/ApiClient';
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import ProjectsIndex from "./projects/ProjectsIndex";
import ProjectShow from "./projects/ProjectShow";
import ProjectEdit from "./projects/ProjectEdit";
import ActivityEdit from "./projects/ActivityEdit";

const isAuthenticated = ApiClient.isAuthenticated;

const Routing = () => {
  return (<>
    <Routes>
      <Route path="/" element={
        <Navigate to={isAuthenticated() ? '/projects' : '/login'} replace />
      } />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Private routes */}
      <Route path="/projects" element={
        <ProtectedRoute><ProjectsIndex /></ProtectedRoute>
      } />
      <Route path="/project/:projectId" element={
        <ProtectedRoute><ProjectShow /></ProtectedRoute>
      } />
      <Route path="/project/:projectId/edit" element={
        <ProtectedRoute><ProjectEdit /></ProtectedRoute>
      } />
      <Route path="/project/:projectId/activities/:activityId/edit" element={
        <ProtectedRoute><ActivityEdit /></ProtectedRoute>
      } />

      {/* Catch undefined paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>)
}

export default Routing;
