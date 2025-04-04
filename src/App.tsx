import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';

const App: React.FC = () => {
  return (
    <Router>
      <TaskProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </TaskProvider>
    </Router>
  );
};

export default App;
